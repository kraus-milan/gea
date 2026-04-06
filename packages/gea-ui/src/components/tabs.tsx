import * as tabs from '@zag-js/tabs'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface TabsItem {
  /** Unique value identifying this tab. */
  value: string
  /** Content rendered in the tab trigger button. */
  label: JSXNode
  /** Content rendered in the tab panel. */
  content: JSXNode
}

export type TabsValueChangeDetails = { value: string }
export type TabsFocusChangeDetails = { focusedValue: string }

export interface TabsProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Tab items to render. */
  items?: TabsItem[]
  /** Controlled active tab value. */
  value?: string
  /** Initial active tab value (uncontrolled). */
  defaultValue?: string
  /** Layout orientation of the tab list.
   * @default "horizontal" */
  orientation?: 'horizontal' | 'vertical'
  /** How a tab becomes active — on focus or on explicit click.
   * @default "automatic" */
  activationMode?: 'automatic' | 'manual'
  /** Wraps keyboard focus from last to first tab and vice versa.
   * @default true */
  loopFocus?: boolean
  /** Called when the active tab changes. */
  onValueChange?: (details: TabsValueChangeDetails) => void
  /** Called when focus moves between tab triggers. */
  onFocusChange?: (details: TabsFocusChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<tabs.Machine>
  Api: tabs.Api
}

export default class Tabs extends ZagComponent<TabsProps, ZE> {
  declare value: string | null

  override createMachine() {
    return tabs.machine
  }

  override getMachineProps(props: TabsProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      orientation: props.orientation ?? 'horizontal',
      activationMode: props.activationMode ?? 'automatic',
      loopFocus: props.loopFocus ?? true,
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
      onFocusChange: props.onFocusChange,
    }
  }

  override connectApi(service: Service<ZE>) {
    return tabs.connect(service, normalizeProps)
  }

  _syncMachineProps() {
    super._syncMachineProps()
    if (this._machine && this.rendered) {
      this._machine.service.send({ type: 'SET_INDICATOR_RECT' })
    }
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="list"]': 'getListProps',
      '[data-part="indicator"]': (api) => {
        const props = api.getIndicatorProps()
        props.style = (props.style || '') + 'bottom:0;width:var(--width);height:2px;'
        return props
      },
      '[data-part="trigger"]': (api, el) => api.getTriggerProps({ value: el.dataset.value }),
      '[data-part="content"]': (api, el) => api.getContentProps({ value: el.dataset.value }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  onAfterRender() {
    super.onAfterRender()
    if (this._api?.value && this._machine) {
      this._machine.service.send({ type: 'SET_INDICATOR_RECT' })
    }
  }

  template(props: TabsProps) {
    const items = props.items || []
    return (
      <div data-part="root" class={cn(props.class)}>
        <div data-part="list" class="tabs-list relative flex border-b border-gray-200 dark:border-gray-700">
          {items.map((item) => (
            <button
              key={item.value}
              data-part="trigger"
              data-value={item.value}
              class="tabs-trigger px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:data-selected:text-blue-400"
            >
              {item.label}
            </button>
          ))}
          <div data-part="indicator" class="tabs-indicator bg-blue-600 dark:bg-blue-400"></div>
        </div>
        {items.map((item) => (
          <div key={item.value} data-part="content" data-value={item.value} class="tabs-content p-4">
            {item.content}
          </div>
        ))}
      </div>
    )
  }
}
