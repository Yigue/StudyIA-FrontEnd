import React from "react";
import { cn } from "../../../utils/cn";

interface PanelProps {
  children: React.ReactNode;
  visible?: boolean;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  visible = true,
  className,
}) => {
  if (!visible) return null;
  
  return (
    <div className={cn("rounded-lg", className)}>
      {children}
    </div>
  );
}; 