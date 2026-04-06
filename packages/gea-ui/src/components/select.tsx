import * as select from '@zag-js/select'
import { normalizeProps } from '@zag-js/vanilla'
import type { PropTypes } from '@zag-js/types'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp, Positioning } from './types'
import { cn } from '../utils/cn'

export interface SelectItem {
  /** Display label shown in the list. Defaults to `value` if omitted. */
  label?: string
  /** Unique value identifying this item. */
  value: string
}

export type SelectCollection<T extends SelectItem = SelectItem> = select.Props<T>['collection']
export type SelectValueChangeDetails<T extends SelectItem = SelectItem> = { value: string[]; items: T[] }
export type SelectOpenChangeDetails = { open: boolean }

export interface SelectProps<T extends SelectItem = SelectItem> {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the select. */
  label?: LabelProp
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string
  /** Array of items to populate the list (used when `collection` is not provided). */
  items?: T[]
  /** Pre-built Zag collection; takes precedence over `items`. */
  collection?: SelectCollection<T>
  /** Controlled selected values. */
  value?: string[]
  /** Initial selected values (uncontrolled). */
  defaultValue?: string[]
  /** Controlled open state of the listbox. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Allows selecting multiple items. */
  multiple?: boolean
  /** Disables the select when true. */
  disabled?: boolean
  /** Marks the select as invalid. */
  invalid?: boolean
  /** Makes the select read-only. */
  readOnly?: boolean
  /** Marks the select as required. */
  required?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the select with a form element by id. */
  form?: string
  /** Closes the listbox after an item is selected.
   * @default true */
  closeOnSelect?: boolean
  /** Positioning options for the listbox popover. */
  positioning?: Positioning
  /** Wraps keyboard focus from last to first item and vice versa.
   * @default false */
  loopFocus?: boolean
  /** Called when the selected value(s) change. */
  onValueChange?: (details: SelectValueChangeDetails<T>) => void
  /** Called when the listbox open state changes. */
  onOpenChange?: (details: SelectOpenChangeDetails) => void
}

type ZE<T extends SelectItem> = {
  Schema: InferSchema<select.Machine<T>>
  Api: select.Api<PropTypes, T>
}

export default class Select<T extends SelectItem = SelectItem> extends ZagComponent<SelectProps<T>, ZE<T>> {
  declare open: boolean
  declare value: string[]
  declare valueAsString: string

  override createMachine() {
    return select.machine
  }

  override getMachineProps(props: SelectProps<T>): Props<ZE<T>> {
    const items = props.items || []
    const col =
      props.collection ||
      select.collection({
        items,
        itemToValue: (item: T) => item.value,
        itemToString: (item: T) => item.label || item.value,
      })

    return {
      id: this.id,
      collection: col,
      value: props.value,
      defaultValue: props.defaultValue,
      open: props.open,
      defaultOpen: props.defaultOpen,
      multiple: props.multiple,
      disabled: props.disabled,
      invalid: props.invalid,
      readOnly: props.readOnly,
      required: props.required,
      name: props.name,
      form: props.form,
      closeOnSelect: props.closeOnSelect ?? true,
      positioning: props.positioning,
      loopFocus: props.loopFocus ?? false,
      onValueChange: (details) => {
        this.value = details.value
        this.valueAsString = details.items.map((i: T) => i.label || i.value).join(', ')
        props.onValueChange?.(details)
      },
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE<T>>) {
    return select.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE<T>> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="indicator"]': 'getIndicatorProps',
      '[data-part="clear-trigger"]': 'getClearTriggerProps',
      '[data-part="value-text"]': 'getValueTextProps',
      '[data-part="hidden-select"]': 'getHiddenSelectProps',
      '[data-part="positioner"]': 'getPositionerProps',
      '[data-part="content"]': 'getContentProps',
      '[data-part="list"]': 'getListProps',
      '[data-part="item"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemProps({ item: { value, label } as T })
      },
      '[data-part="item-text"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemTextProps({ item: { value, label } as T })
      },
      '[data-part="item-indicator"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemIndicatorProps({ item: { value, label } as T })
      },
    }
  }

  override syncState(api: ZE<T>['Api']) {
    this.open = api.open
    this.value = api.value
    this.valueAsString = api.valueAsString
  }

  template(props: SelectProps<T>) {
    const items = props.items || []
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="select-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="select-control">
          <button
            data-part="trigger"
            class="select-trigger flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span data-part="value-text" class="select-value-text">
              {this.valueAsString || props.placeholder || 'Select...'}
            </span>
            <span data-part="indicator" class="select-indicator">
              &#x25BC;
            </span>
          </button>
        </div>
        <select data-part="hidden-select" class="select-hidden-select"></select>
        <div data-part="positioner" class="select-positioner">
          <div
            data-part="content"
            class="select-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            <div data-part="list">
              {items.map((item) => (
                <div
                  key={item.value}
                  data-part="item"
                  data-value={item.value}
                  data-label={item.label}
                  class="select-item relative flex cursor-pointer select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  <span data-part="item-text" data-value={item.value} data-label={item.label}>
                    {item.label}
                  </span>
                  <span
                    data-part="item-indicator"
                    data-value={item.value}
                    data-label={item.label}
                    class="select-item-indicator ml-auto"
                  >
                    &#x2713;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
