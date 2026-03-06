import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

/**
 * @param {{ label: string, value: string, onChange: (v: string) => void, placeholder?: string }} props
 */
export function ColorField({ label, value, onChange, placeholder = "ex: #ffffff" }) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-1.5 items-center">
        <Input
          type="color"
          className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}
