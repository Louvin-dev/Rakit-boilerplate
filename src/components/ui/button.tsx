import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "outline" | "ghost" | "brand";
type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  default: "bg-foreground text-background hover:opacity-90",
  brand: "bg-brand text-brand-foreground hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-muted/40",
  ghost: "hover:bg-muted/40 text-muted-foreground hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[transform,background-color,border-color,color] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
