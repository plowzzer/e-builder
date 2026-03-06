import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

/**
 * @param {{ label: string, value: string, onChange: (v: string) => void, placeholder?: string, description?: string }} props
 */
export function TextField({ label, value, onChange, placeholder, description }) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
