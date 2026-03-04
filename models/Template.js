import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String, enum: ["mj-text", "mj-image", "mj-button", "mj-divider"] },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    content: String,
  },
  { _id: false }
);

const ColumnSchema = new mongoose.Schema(
  {
    id: String,
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    components: [ComponentSchema],
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    id: String,
    columns: { type: Number, enum: [1, 2, 3], default: 1 },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    columnList: [ColumnSchema],
  },
  { _id: false }
);

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    data: {
      globalConfig: {
        backgroundColor: { type: String, default: "#ffffff" },
        fontFamily: { type: String, default: "Arial, sans-serif" },
        containerWidth: { type: String, default: "600px" },
      },
      sections: [SectionSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);
