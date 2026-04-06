import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { ClassProp } from './types'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Controls the direction of the separator line.
   * @default "horizontal" */
  orientation?: SeparatorOrientation
}

export default class Separator extends Component<SeparatorProps> {
  template(props: SeparatorProps) {
    const isVertical = props.orientation === 'vertical'

    return (
      <div
        class={cn('shrink-0 bg-border', isVertical ? 'h-full w-[1px]' : 'h-[1px] w-full', props.class)}
        role="separator"
        aria-orientation={props.orientation || 'horizontal'}
      ></div>
    )
  }
}
