import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Extend tailwind-merge so it recognises custom colour utilities defined in
// `tailwind.config.ts` (e.g. `bg-background`, `text-foreground`, etc.).  When
// these utilities are unknown, tailwind-merge v3 throws an exception and the
// whole React tree fails to render – this is what we were seeing in the dev
// logs.  By explicitly listing the custom colour names we silence the error
// while still benefitting from duplicate-class merging.

const twMerge = extendTailwindMerge({
  theme: {
    colors: [
      "background",
      "foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "popover",
      "popover-foreground",
      "card",
      "card-foreground",
      "border",
      "input",
      "ring",
    ],
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}