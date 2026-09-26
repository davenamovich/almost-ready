import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        wallNav: "h-9 rounded-none border border-primary bg-transparent px-4 font-mono text-[10px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground",
        wallPrimary: "rounded-none bg-primary px-6 font-mono text-[11px] font-semibold text-primary-foreground shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_24%,transparent)] hover:bg-primary/90 hover:shadow-[0_0_34px_color-mix(in_oklch,var(--primary)_44%,transparent)] [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",
        wallOutline: "rounded-none border border-border bg-transparent px-6 font-mono text-[11px] font-semibold text-foreground hover:border-primary hover:text-primary",
        wallTool: "rounded-none bg-transparent px-3 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground",
        wallIcon: "rounded-none bg-transparent text-muted-foreground hover:bg-secondary hover:text-primary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        wallLarge: "min-h-13 px-7 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
