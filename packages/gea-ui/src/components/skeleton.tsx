import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { ClassProp } from './types'

export interface SkeletonProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
}

export default class Skeleton extends Component<SkeletonProps> {
  template(props: SkeletonProps) {
    return <div class={cn('animate-pulse rounded-md bg-primary/10', props.class)}></div>
  }
}
