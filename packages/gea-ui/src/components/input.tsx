import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { ClassProp } from './types'
import type { GInputEvent } from '../types'

export interface InputProps {
  /** CSS class(es) applied to the input element. */
  class?: ClassProp
  /** HTML input type.
   * @default "text" */
  type?: HTMLInputElement['type']
  /** Placeholder text shown when the input is empty. */
  placeholder?: string
  /** Controlled value of the input. */
  value?: string
  /** Disables the input when true. */
  disabled?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** `id` attribute applied to the input element. */
  inputId?: string
  /** Called on each input event. */
  onInput?: (e: GInputEvent<HTMLInputElement>) => void
}

export default class Input extends Component<InputProps> {
  template(props: InputProps) {
    return (
      <input
        class={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          props.class,
        )}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
        name={props.name}
        id={props.inputId}
        input={(e) => props.onInput?.(e)}
      />
    )
  }
}
