import * as accordion from '@zag-js/accordion'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'

export interface AccordionItem {
  /** Unique identifier for this item, used to control expanded state. */
  value: string
  /** Content rendered in the item's trigger button. */
  label: JSXNode
  /** Content revealed when the item is expanded. */
  content: JSXNode
}

export interface AccordionProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** List of accordion items to render. */
  items: AccordionItem[]
  /** Controlled list of expanded item values. */
  value?: string[]
  /** Initially expanded item values (uncontrolled). */
  defaultValue?: string[]
  /** Allow multiple items to be expanded at the same time.
   * @default false */
  multiple?: boolean
  /** Allow the currently open item to be collapsed by clicking its trigger.
   * @default false */
  collapsible?: boolean
  /** Disables all items when true. */
  disabled?: boolean
  /** Layout orientation of the accordion.
   * @default "vertical" */
  orientation?: 'horizontal' | 'vertical'
  /** Called when the expanded items change. */
  onValueChange?: (details: accordion.ValueChangeDetails) => void
  /** Called when focus moves between item triggers. */
  onFocusChange?: (details: accordion.FocusChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<accordion.Machine>
  Api: accordion.Api
}

export default class Accordion extends ZagComponent<AccordionProps, ZE> {
  declare value: string[]

  override createMachine() {
    return accordion.machine
  }

  override getMachineProps(props: AccordionProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      multiple: props.multiple ?? false,
      collapsible: props.collapsible ?? false,
      disabled: props.disabled,
      orientation: props.orientation ?? 'vertical',
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
      onFocusChange: props.onFocusChange,
    }
  }

  override connectApi(service: Service<ZE>) {
    return accordion.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="item"]': (api, el) => api.getItemProps({ value: el.dataset.value }),
      '[data-part="item-trigger"]': (api, el) => api.getItemTriggerProps({ value: el.dataset.value }),
      '[data-part="item-content"]': (api, el) => api.getItemContentProps({ value: el.dataset.value }),
      '[data-part="item-indicator"]': (api, el) => api.getItemIndicatorProps({ value: el.dataset.value }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  template(props: AccordionProps) {
    const items = props.items || []
    return (
      <div data-part="root" class={cn(props.class)}>
        {items.map((item) => (
          <div key={item.value} data-part="item" data-value={item.value} class="accordion-item border-b">
            <h3>
              <button
                data-part="item-trigger"
                data-value={item.value}
                class="accordion-trigger flex w-full items-center justify-between py-4 text-sm font-medium transition-all"
              >
                {item.label}
                <span
                  data-part="item-indicator"
                  data-value={item.value}
                  class="accordion-indicator h-4 w-4 shrink-0 transition-transform duration-200"
                >
                  &#x25B6;
                </span>
              </button>
            </h3>
            <div data-part="item-content" data-value={item.value} class="accordion-content overflow-hidden text-sm">
              <div class="pb-4 pt-0">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
