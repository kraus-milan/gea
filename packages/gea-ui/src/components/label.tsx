import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export interface LabelProps {
  /** CSS class(es) applied to the label element. */
  class?: ClassProp
  /** `id` of the form element this label is associated with. */
  htmlFor: string
  /** Label text or content. */
  children: JSXNode
}

export default class Label extends Component<LabelProps> {
  template(props: LabelProps) {
    return (
      <label
        class={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          props.class,
        )}
        for={props.htmlFor}
      >
        {props.children}
      </label>
    )
  }
}
