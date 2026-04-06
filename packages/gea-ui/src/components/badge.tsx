import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export interface BadgeProps {
  /** CSS class(es) applied to the root element. */
  class?: string
  /** Visual style of the badge.
   * @default "default" */
  variant?: BadgeVariant
  /** Content rendered inside the badge. */
  children: JSXNode
}

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline: 'text-foreground',
}

export default class Badge extends Component<BadgeProps> {
  template(props: BadgeProps) {
    const variant = variants[props.variant || 'default'] || variants.default

    return (
      <span
        class={cn(
          'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring',
          variant,
          props.class,
        )}
      >
        {props.children}
      </span>
    )
  }
}
