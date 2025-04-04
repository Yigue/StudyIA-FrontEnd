import React from "react";
import { cn } from "../../utils/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 