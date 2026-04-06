import { Component } from '@geajs/core'
import { dndManager } from './dnd-manager'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export interface DroppableProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Unique identifier for this drop zone. */
  droppableId: string
  /** Draggable items rendered inside this drop zone. */
  children: JSXNode
}

export default class Droppable extends Component<DroppableProps> {
  private _registered = false

  _registerWithManager() {
    const el = this.el?.querySelector('[data-droppable-id]') as HTMLElement
    if (el && !this._registered) {
      dndManager.registerDroppable(this.props.droppableId, el)
      this._registered = true
    }
  }

  created() {
    queueMicrotask(() => this._registerWithManager())
  }

  onAfterRender() {
    this._registerWithManager()
  }

  dispose() {
    if (this._registered) {
      dndManager.unregisterDroppable(this.props.droppableId)
      this._registered = false
    }
    super.dispose()
  }

  template(props: DroppableProps) {
    return (
      <div class={cn('gea-droppable', props.class)} data-droppable-id={props.droppableId}>
        {props.children}
      </div>
    )
  }
}
