import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldLabel } from "../ui/field";

/**
 * @param {{ label: string, value: string, onChange: (v: string) => void, defaultValue?: string }} props
 */
export function AlignField({ label, value, onChange, defaultValue = "left" }) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <ButtonGroup>
        {[
          { v: "left", icon: <AlignLeft size={16} /> },
          { v: "center", icon: <AlignCenter size={16} /> },
          { v: "right", icon: <AlignRight size={16} /> },
        ].map(({ v, icon }) => (
          <Button
            key={v}
            variant={(value || defaultValue) === v ? "default" : "outline"}
            size="icon"
            onClick={() => onChange(v)}
          >
            {icon}
          </Button>
        ))}
      </ButtonGroup>
    </Field>
  );
}
