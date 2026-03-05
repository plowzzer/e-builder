import { create } from "zustand";

/**
 * @param {import("../types/builder").Section[]} sections
 * @param {string} sectionId
 */
function findSectionIndex(sections, sectionId) {
  return sections.findIndex((s) => s.id === sectionId);
}

/**
 * Cria as colunas iniciais para uma seção com N colunas
 * @param {1|2|3} columns
 * @returns {import("../types/builder").Column[]}
 */
function createColumns(columns) {
  return Array.from({ length: columns }, () => ({
    id: crypto.randomUUID(),
    attributes: {},
    components: [],
  }));
}

const useBuilderStore = create((set, get) => ({
  // --- Estado ---
  template: {
    globalConfig: {
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      containerWidth: "600px",
    },
    sections: [],
  },
  selectedSectionId: null,
  selectedColumnId: null,
  selectedComponentId: null,
  isDirty: false,
  previewOutdated: false,

  // --- Actions de seção ---
  addSection: (columns = 1) =>
    set((state) => {
      const newSection = {
        id: crypto.randomUUID(),
        columns,
        attributes: { padding: "20px 0" },
        columnList: createColumns(columns),
      };
      return {
        template: {
          ...state.template,
          sections: [...state.template.sections, newSection],
        },
        isDirty: true,
        previewOutdated: true,
      };
    }),

  removeSection: (sectionId) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.filter((s) => s.id !== sectionId),
      },
      selectedSectionId:
        state.selectedSectionId === sectionId ? null : state.selectedSectionId,
      isDirty: true,
      previewOutdated: true,
    })),

  moveSectionUp: (sectionId) =>
    set((state) => {
      const sections = [...state.template.sections];
      const idx = findSectionIndex(sections, sectionId);
      if (idx <= 0) return {};
      [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
      return {
        template: { ...state.template, sections },
        isDirty: true,
        previewOutdated: true,
      };
    }),

  moveSectionDown: (sectionId) =>
    set((state) => {
      const sections = [...state.template.sections];
      const idx = findSectionIndex(sections, sectionId);
      if (idx < 0 || idx >= sections.length - 1) return {};
      [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
      return {
        template: { ...state.template, sections },
        isDirty: true,
        previewOutdated: true,
      };
    }),

  updateSectionAttributes: (sectionId, attrs) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.map((s) =>
          s.id === sectionId
            ? { ...s, attributes: { ...s.attributes, ...attrs } }
            : s
        ),
      },
      isDirty: true,
      previewOutdated: true,
    })),

  updateColumnAttributes: (sectionId, columnId, attrs) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                columnList: s.columnList.map((col) =>
                  col.id === columnId
                    ? { ...col, attributes: { ...col.attributes, ...attrs } }
                    : col
                ),
              }
            : s
        ),
      },
      isDirty: true,
      previewOutdated: true,
    })),

  // --- Actions de componente ---
  addComponent: (sectionId, columnId, type) =>
    set((state) => {
      const defaultAttributes = {
        "mj-text": { "font-size": "14px", color: "#000000", padding: "10px" },
        "mj-image": { src: "", alt: "", width: "100%", padding: "10px" },
        "mj-button": {
          "background-color": "#4A90E2",
          color: "#ffffff",
          "border-radius": "4px",
          padding: "10px 25px",
          href: "#",
        },
        "mj-divider": {
          "border-color": "#cccccc",
          "border-style": "solid",
          "border-width": "1px",
          padding: "10px 0",
        },
        "mj-table": {
          padding: "10px",
          border: "1px solid #cccccc",
          cellpadding: "4",
          cellspacing: "0",
        },
      };
      const newComponent = {
        id: crypto.randomUUID(),
        type,
        attributes: defaultAttributes[type] || {},
        content:
          type === "mj-text"
            ? "<p>Texto aqui</p>"
            : type === "mj-button"
            ? "Clique aqui"
            : type === "mj-table"
            ? "<tr>\n  <th>Coluna 1</th>\n  <th>Coluna 2</th>\n  <th>Coluna 3</th>\n</tr>\n<tr>\n  <td>Dado 1</td>\n  <td>Dado 2</td>\n  <td>Dado 3</td>\n</tr>"
            : "",
      };
      return {
        template: {
          ...state.template,
          sections: state.template.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  columnList: s.columnList.map((col) =>
                    col.id === columnId
                      ? { ...col, components: [...col.components, newComponent] }
                      : col
                  ),
                }
              : s
          ),
        },
        isDirty: true,
        previewOutdated: true,
      };
    }),

  removeComponent: (sectionId, columnId, componentId) =>
    set((state) => {
      const updatedSection = state.template.sections
        .find((s) => s.id === sectionId);
      if (!updatedSection) return {};

      const newColumnList = updatedSection.columnList.map((col) =>
        col.id === columnId
          ? { ...col, components: col.components.filter((c) => c.id !== componentId) }
          : col
      );

      const allEmpty = newColumnList.every((col) => col.components.length === 0);

      return {
        template: {
          ...state.template,
          sections: allEmpty
            ? state.template.sections.filter((s) => s.id !== sectionId)
            : state.template.sections.map((s) =>
                s.id === sectionId ? { ...s, columnList: newColumnList } : s
              ),
        },
        selectedSectionId: allEmpty
          ? (state.selectedSectionId === sectionId ? null : state.selectedSectionId)
          : state.selectedSectionId,
        selectedColumnId: null,
        selectedComponentId: null,
        isDirty: true,
        previewOutdated: true,
      };
    }),

  moveComponentUp: (sectionId, columnId, componentId) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                columnList: s.columnList.map((col) => {
                  if (col.id !== columnId) return col;
                  const comps = [...col.components];
                  const idx = comps.findIndex((c) => c.id === componentId);
                  if (idx <= 0) return col;
                  [comps[idx - 1], comps[idx]] = [comps[idx], comps[idx - 1]];
                  return { ...col, components: comps };
                }),
              }
            : s
        ),
      },
      isDirty: true,
      previewOutdated: true,
    })),

  moveComponentDown: (sectionId, columnId, componentId) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                columnList: s.columnList.map((col) => {
                  if (col.id !== columnId) return col;
                  const comps = [...col.components];
                  const idx = comps.findIndex((c) => c.id === componentId);
                  if (idx < 0 || idx >= comps.length - 1) return col;
                  [comps[idx], comps[idx + 1]] = [comps[idx + 1], comps[idx]];
                  return { ...col, components: comps };
                }),
              }
            : s
        ),
      },
      isDirty: true,
      previewOutdated: true,
    })),

  updateComponent: (sectionId, columnId, componentId, patch) =>
    set((state) => ({
      template: {
        ...state.template,
        sections: state.template.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                columnList: s.columnList.map((col) =>
                  col.id === columnId
                    ? {
                        ...col,
                        components: col.components.map((c) =>
                          c.id === componentId ? { ...c, ...patch } : c
                        ),
                      }
                    : col
                ),
              }
            : s
        ),
      },
      isDirty: true,
      previewOutdated: true,
    })),

  // --- Actions de seleção ---
  selectSection: (sectionId) =>
    set({ selectedSectionId: sectionId, selectedColumnId: null, selectedComponentId: null }),

  selectComponent: (sectionId, columnId, componentId) =>
    set({ selectedSectionId: sectionId, selectedColumnId: columnId, selectedComponentId: componentId }),

  clearSelection: () =>
    set({ selectedSectionId: null, selectedColumnId: null, selectedComponentId: null }),

  // --- Actions globais ---
  updateGlobalConfig: (patch) =>
    set((state) => ({
      template: {
        ...state.template,
        globalConfig: { ...state.template.globalConfig, ...patch },
      },
      isDirty: true,
      previewOutdated: true,
    })),

  loadTemplate: (templateData) =>
    set({
      template: templateData,
      isDirty: false,
      previewOutdated: false,
      selectedSectionId: null,
      selectedColumnId: null,
      selectedComponentId: null,
    }),

  markSaved: () => set({ isDirty: false }),
}));

export default useBuilderStore;
