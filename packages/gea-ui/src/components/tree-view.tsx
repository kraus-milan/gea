import * as treeView from '@zag-js/tree-view'
import { normalizeProps } from '@zag-js/vanilla'
import type { PropTypes } from '@zag-js/types'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface TreeViewNode {
  id: string
  name: string
  children?: TreeViewNode[]
}

export type TreeViewCollection<T extends TreeViewNode> = treeView.Props<T>['collection']
export type TreeViewSelectionChangeDetails<T extends TreeViewNode> = {
  focusedValue: string | null
  selectedValue: string[]
  selectedNodes: T[]
}
export type TreeViewExpandedChangeDetails<T extends TreeViewNode> = {
  focusedValue: string | null
  expandedValue: string[]
  expandedNodes: T[]
}

export interface TreeViewProps<T extends TreeViewNode> {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the tree. */
  label?: LabelProp
  /** Tree node elements rendered inside the tree. */
  children: JSXNode
  /** Pre-built Zag collection describing the tree structure. */
  collection?: TreeViewCollection<T>
  /** Controlled selected node values. */
  selectedValue?: string[]
  /** Initial selected node values (uncontrolled). */
  defaultSelectedValue?: string[]
  /** Controlled expanded node values. */
  expandedValue?: string[]
  /** Initial expanded node values (uncontrolled). */
  defaultExpandedValue?: string[]
  /** Whether one or multiple nodes can be selected at once.
   * @default "single" */
  selectionMode?: 'single' | 'multiple'
  /** Expands a branch node when it is clicked.
   * @default true */
  expandOnClick?: boolean
  /** Called when the selected nodes change. */
  onSelectionChange?: (details: TreeViewSelectionChangeDetails<T>) => void
  /** Called when the expanded nodes change. */
  onExpandedChange?: (details: TreeViewExpandedChangeDetails<T>) => void
}

type ZE<T extends TreeViewNode> = {
  Schema: InferSchema<treeView.Machine<T>>
  Api: treeView.Api<PropTypes, T>
}

export default class TreeView<T extends TreeViewNode> extends ZagComponent<TreeViewProps<T>, ZE<T>> {
  selectedValue: string[] = []
  expandedValue: string[] = []

  override createMachine() {
    return treeView.machine
  }

  override getMachineProps(props: TreeViewProps<T>): Props<ZE<T>> {
    return {
      id: this.id,
      collection: props.collection,
      selectedValue: props.selectedValue,
      defaultSelectedValue: props.defaultSelectedValue,
      expandedValue: props.expandedValue,
      defaultExpandedValue: props.defaultExpandedValue,
      selectionMode: props.selectionMode ?? 'single',
      expandOnClick: props.expandOnClick ?? true,
      onSelectionChange: (details) => {
        this.selectedValue = details.selectedValue
        props.onSelectionChange?.(details)
      },
      onExpandedChange: (details) => {
        this.expandedValue = details.expandedValue
        props.onExpandedChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE<T>>) {
    return treeView.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE<T>> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="tree"]': 'getTreeProps',
    }
  }

  override syncState(api: ZE<T>['Api']) {
    this.selectedValue = api.selectedValue
    this.expandedValue = api.expandedValue
  }

  template(props: TreeViewProps<T>) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="tree-view-label text-sm font-medium mb-2 block">
            {props.label}
          </label>
        )}
        <div data-part="tree" class="tree-view-tree" role="tree">
          {props.children}
        </div>
      </div>
    )
  }
}
