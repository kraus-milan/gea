import * as menu from '@zag-js/menu'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { JSXNode } from '../types'
import type { ClassProp, Positioning } from './types'

export interface MenuSeparatorItem {
  /** Renders a visual separator line between items. */
  type: 'separator'
}
export interface MenuOptionItem {
  /** Renders a selectable menu item. */
  type: 'item'
  /** Unique value passed to `onSelect`. */
  value: string
  /** Content rendered inside the menu item. */
  label: JSXNode
}
export type MenuItem = MenuSeparatorItem | MenuOptionItem

export interface MenuProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the trigger button. */
  triggerLabel?: JSXNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Closes the menu after an item is selected.
   * @default true */
  closeOnSelect?: boolean
  /** Wraps keyboard focus from last to first item and vice versa.
   * @default false */
  loopFocus?: boolean
  /** Positioning options for the menu popover. */
  positioning?: Positioning
  /** Called when the open state changes. */
  onOpenChange?: (details: menu.OpenChangeDetails) => void
  /** Called when a menu item is selected. */
  onSelect?: (details: menu.SelectionDetails) => void
  /** Items to render in the menu. */
  items?: MenuItem[]
}

type ZE = {
  Schema: InferSchema<menu.Machine>
  Api: menu.Api
}

export default class Menu extends ZagComponent<MenuProps, ZE> {
  declare open: boolean

  override createMachine() {
    return menu.machine
  }

  override getMachineProps(props: MenuProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      closeOnSelect: props.closeOnSelect ?? true,
      loopFocus: props.loopFocus ?? false,
      positioning: props.positioning,
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
      onSelect: props.onSelect,
    }
  }

  override connectApi(service: Service<ZE>) {
    return menu.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="positioner"]': 'getPositionerProps',
      '[data-part="content"]': 'getContentProps',
      '[data-part="separator"]': 'getSeparatorProps',
      '[data-part="item"]': (api, el) => api.getItemProps({ value: el.dataset.value }),
      '[data-part="item-group"]': (api, el) => api.getItemGroupProps({ id: el.dataset.groupId }),
      '[data-part="item-group-label"]': (api, el) => api.getItemGroupLabelProps({ htmlFor: el.dataset.htmlFor }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.open = api.open
  }

  template(props: MenuProps) {
    const items = props.items || []
    return (
      <div class={cn(props.class)}>
        <button
          data-part="trigger"
          class="menu-trigger inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
        >
          {props.triggerLabel || 'Menu'}
        </button>
        <div data-part="positioner" class="menu-positioner">
          <div
            data-part="content"
            class="menu-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {items.map((item, i) =>
              item.type === 'separator' ? (
                <div key={`sep-${i}`} data-part="separator" class="menu-separator -mx-1 my-1 h-px bg-muted"></div>
              ) : (
                <div
                  key={item.value}
                  data-part="item"
                  data-value={item.value}
                  class="menu-item relative flex cursor-pointer select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  {item.label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    )
  }
}
