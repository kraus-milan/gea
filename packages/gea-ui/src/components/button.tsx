import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { JSXNode, MouseEventHandler } from '../types'
import type { ClassProp } from './types'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'
export type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonPropsCommon {
  /** Visual style of the button.
   * @default "default" */
  variant?: ButtonVariant
  /** Size preset of the button.
   * @default "default" */
  size?: ButtonSize
  /** HTML `type` attribute on the underlying `<button>`.
   * @default "button" */
  type?: ButtonType
  /** Disables the button when true. */
  disabled?: boolean
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the button. */
  children?: JSXNode
}

interface ButtonPropsClick extends ButtonPropsCommon {
  /** Click handler (Gea native event name). */
  click: MouseEventHandler<HTMLButtonElement>
  onClick?: never
}

interface ButtonPropsOnClick extends ButtonPropsCommon {
  /** Click handler (React-style alias). */
  onClick: MouseEventHandler<HTMLButtonElement>
  click?: never
}

interface ButtonPropsNoHandler extends ButtonPropsCommon {
  click?: never
  onClick?: never
}

export type ButtonProps = ButtonPropsClick | ButtonPropsOnClick | ButtonPropsNoHandler

const variants: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
  outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizes: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9',
}

export default class Button extends Component<ButtonProps> {
  template(props: ButtonProps) {
    const variant = variants[props.variant || 'default'] || variants.default
    const size = sizes[props.size || 'default'] || sizes.default
    const handleClick = props.click || props.onClick

    return (
      <button
        class={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variant,
          size,
          props.class,
        )}
        type={props.type || 'button'}
        disabled={props.disabled}
        click={(e) => handleClick?.(e)}
      >
        {props.children}
      </button>
    )
  }
}
