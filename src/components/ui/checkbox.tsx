import React from "react";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  onCheckedChange,
  id,
  ...props
}) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        className="peer absolute h-4 w-4 opacity-0"
        {...props}
      />
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border border-gray-300 dark:border-gray-700 transition-colors",
          isChecked
            ? "bg-primary border-primary"
            : "bg-white dark:bg-gray-800",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
          className
        )}
      >
        {isChecked && <Check className="h-3 w-3 text-white" />}
      </div>
    </div>
  );
}; 