import { Component } from '@geajs/core'
import { dndManager } from './dnd-manager'
import { cn } from '../utils/cn'
import type { DragResult } from './dnd-manager'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export interface DragDropContextProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Draggable and Droppable components to manage. */
  children: JSXNode
  /** Called when a drag operation ends. */
  onDragEnd?: (result: DragResult) => void
}

export default class DragDropContext extends Component<DragDropContextProps> {
  created() {
    dndManager.onDragEnd = (result) => {
      this.props.onDragEnd?.(result)
    }
  }

  dispose() {
    dndManager.destroy()
    super.dispose()
  }

  template(props: DragDropContextProps) {
    return <div class={cn('gea-dnd-context', props.class)}>{props.children}</div>
  }
}
