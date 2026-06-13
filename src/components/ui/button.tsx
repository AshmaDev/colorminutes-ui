import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-clip-padding font-sans text-base font-medium tracking-normal whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/85",
        outline:
          "border-foreground/15 bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/[0.04] aria-expanded:border-foreground/25 aria-expanded:bg-foreground/[0.04]",
        secondary:
          "border border-foreground/10 bg-background text-foreground hover:border-foreground/20 hover:bg-foreground/[0.03] aria-expanded:border-foreground/20 aria-expanded:bg-foreground/[0.03]",
        ghost:
          "text-foreground hover:bg-foreground/[0.06] aria-expanded:bg-foreground/[0.06]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-foreground underline-offset-4 hover:underline",
        landing:
          "border-0 bg-foreground text-background shadow-sm shadow-black/10 hover:bg-foreground/90 hover:shadow-md hover:shadow-black/15 focus-visible:ring-foreground/20 active:translate-y-0",
      },
      size: {
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-8 gap-1.5 rounded-xl px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-9 gap-1.5 rounded-xl px-3.5 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xl: "h-14 gap-2.5 px-8 text-lg has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-11",
        "icon-xs":
          "size-8 rounded-xl [&_svg:not([class*='size-'])]:size-4",
        "icon-sm":
          "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      nativeButton={nativeButton ?? render === undefined}
      {...props}
    />
  )
}

export { Button, buttonVariants }
