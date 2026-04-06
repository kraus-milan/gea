import { Component } from '@geajs/core'
import { dndManager } from './dnd-manager'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export interface DraggableProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Position of this item within its droppable list. */
  index: number
  /** Unique identifier for this draggable item. */
  draggableId: string
  /** Content rendered inside the draggable container. */
  children: JSXNode
}

export default class Draggable extends Component<DraggableProps> {
  _didDrag = false

  _onPointerDown(e: PointerEvent) {
    const el = (e.currentTarget as HTMLElement).closest('.gea-draggable') as HTMLElement
    if (!el) return
    this._didDrag = false
    dndManager.startTracking(e, this.props.draggableId, el)
  }

  template(props: DraggableProps) {
    return (
      <div
        class={cn('gea-draggable', props.class)}
        data-draggable-id={props.draggableId}
        data-index={props.index}
        pointerdown={(e) => this._onPointerDown(e)}
        click={(e) => {
          if (dndManager.isDragging) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {props.children}
      </div>
    )
  }
}
