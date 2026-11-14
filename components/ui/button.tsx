import { isValidElement } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Pixel buttons: stepped ink outline, darker bottom edge, press down 2px.
// The look lives in globals.css (.px-btn and its tone classes); variants only
// pick a tone, sizes keep their old heights.
const buttonVariants = cva(
  "group/button px-btn shrink-0 gap-1.5 bg-clip-padding text-sm outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-destructive aria-invalid:outline-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "px-btn-panel aria-expanded:bg-butter",
        secondary: "px-btn-mint aria-expanded:bg-mint",
        ghost:
          "[--btn-line:transparent] [--btn-edge:transparent] [--btn-hi:transparent] [--btn-bg:transparent] [--btn-hover:color-mix(in_srgb,var(--butter)_55%,transparent)] aria-expanded:bg-butter/60",
        destructive: "px-btn-danger",
        link: "h-auto! px-0! normal-case! tracking-normal! font-sans! font-semibold! text-coral-deep underline-offset-4 shadow-none! bg-transparent! hover:underline [--btn-fg:var(--coral-deep)]",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
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
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  // A `render` that is not a <button> (e.g. a Link) is not a native button;
  // telling Base UI so keeps its semantics right and silences its warning.
  const render = props.render
  const isNative =
    nativeButton ??
    (render == null || (isValidElement(render) && render.type === "button"))
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={isNative}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
