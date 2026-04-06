import * as combobox from '@zag-js/combobox'
import { normalizeProps } from '@zag-js/vanilla'
import { type PropTypes } from '@zag-js/types'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { JSXNode } from '../types'
import type { ClassProp, Positioning } from './types'
import { cn } from '../utils/cn'

export interface ComboboxItem {
  /** Display label shown in the list. Defaults to `value` if omitted. */
  label?: string
  /** Unique value identifying this item. */
  value: string
}

export type ComboboxCollection<T extends ComboboxItem = ComboboxItem> = combobox.Props<T>['collection']

export interface ComboboxProps<T extends ComboboxItem = ComboboxItem> {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the input. */
  label?: JSXNode
  /** Array of items to populate the list (used when `collection` is not provided). */
  items?: T[]
  /** Pre-built Zag collection; takes precedence over `items`. */
  collection?: ComboboxCollection<T>
  /** Controlled selected values. */
  value?: string[]
  /** Initial selected values (uncontrolled). */
  defaultValue?: string[]
  /** Controlled input text value. */
  inputValue?: string
  /** Initial input text value (uncontrolled). */
  defaultInputValue?: string
  /** Controlled open state of the listbox. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Allows selecting multiple items.
   * @default false */
  multiple?: boolean
  /** Disables the combobox when true. */
  disabled?: boolean
  /** Makes the combobox read-only. */
  readOnly?: boolean
  /** Marks the combobox as invalid. */
  invalid?: boolean
  /** Marks the combobox as required. */
  required?: boolean
  /** Placeholder text shown in the input when empty. */
  placeholder?: string
  /** Typing behavior of the input.
   * @default "none" */
  inputBehavior?: combobox.Props<T>['inputBehavior']
  /** How the input value is handled after selection.
   * @default "replace" */
  selectionBehavior?: combobox.Props<T>['selectionBehavior']
  /** Closes the listbox after an item is selected.
   * @default true */
  closeOnSelect?: boolean
  /** Allows values not present in the list. */
  allowCustomValue?: boolean
  /** Wraps keyboard focus from last to first item and vice versa.
   * @default true */
  loopFocus?: boolean
  /** Opens the listbox when the input is clicked.
   * @default false */
  openOnClick?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the combobox with a form element by id. */
  form?: string
  /** Positioning options for the listbox popover. */
  positioning?: Positioning
  /** Called when the selected value(s) change. */
  onValueChange?: (details: combobox.ValueChangeDetails<T>) => void
  /** Called when the input text value changes. */
  onInputValueChange?: (details: combobox.InputValueChangeDetails) => void
  /** Called when the listbox open state changes. */
  onOpenChange?: (details: combobox.OpenChangeDetails) => void
}

type ZE<CI extends ComboboxItem> = {
  Schema: InferSchema<combobox.Machine<CI>>
  Api: combobox.Api<PropTypes, CI>
}

export default class Combobox<T extends ComboboxItem = ComboboxItem> extends ZagComponent<ComboboxProps<T>, ZE<T>> {
  declare open: boolean
  declare value: string[]
  declare inputValue: string
  declare filteredItems: T[]
  declare _allItems: T[]

  created(props: ComboboxProps<T>) {
    this._allItems = props.items || []
    this.filteredItems = [...this._allItems]
    super.created(props)
  }

  override createMachine() {
    return combobox.machine
  }

  _buildCollection(items: T[]): Props<ZE<T>>['collection'] {
    return combobox.collection({
      items,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.label || item.value,
    })
  }

  _filterItems(query: string) {
    const q = query.toLowerCase()
    const filtered = q
      ? this._allItems.filter((item) => (item.label || item.value).toLowerCase().includes(q))
      : [...this._allItems]
    this.filteredItems = filtered
    this._machine?.updateProps({ collection: this._buildCollection(filtered) })
  }

  override getMachineProps(props: ComboboxProps<T>): Props<ZE<T>> {
    const col = props.collection || this._buildCollection(this._allItems)

    return {
      id: this.id,
      collection: col,
      value: props.value,
      defaultValue: props.defaultValue,
      inputValue: props.inputValue,
      defaultInputValue: props.defaultInputValue,
      open: props.open,
      defaultOpen: props.defaultOpen,
      multiple: props.multiple,
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      required: props.required,
      placeholder: props.placeholder,
      inputBehavior: props.inputBehavior ?? 'none',
      selectionBehavior: props.selectionBehavior ?? 'replace',
      closeOnSelect: props.closeOnSelect ?? true,
      allowCustomValue: props.allowCustomValue,
      loopFocus: props.loopFocus ?? true,
      openOnClick: props.openOnClick ?? false,
      name: props.name,
      form: props.form,
      positioning: props.positioning,
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
      onInputValueChange: (details) => {
        this.inputValue = details.inputValue
        this._filterItems(details.inputValue)
        props.onInputValueChange?.(details)
      },
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE<T>>) {
    return combobox.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE<T>> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="input"]': 'getInputProps',
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="clear-trigger"]': 'getClearTriggerProps',
      '[data-part="positioner"]': 'getPositionerProps',
      '[data-part="content"]': 'getContentProps',
      '[data-part="list"]': 'getListProps',
      '[data-part="item"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemProps({ item: { value, label } })
      },
      '[data-part="item-text"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemTextProps({ item: { value, label } })
      },
      '[data-part="item-indicator"]': (api, el) => {
        const value = el.dataset.value
        const label = el.dataset.label || value
        return api.getItemIndicatorProps({ item: { value, label } })
      },
    }
  }

  override syncState(api: ZE<T>['Api']) {
    this.open = api.open
    this.value = api.value
    this.inputValue = api.inputValue
  }

  template(props: ComboboxProps<T>) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="combobox-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="combobox-control flex">
          <input
            data-part="input"
            class="combobox-input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            data-part="trigger"
            class="combobox-trigger inline-flex h-9 items-center justify-center rounded-r-md border border-l-0 border-input px-2"
          >
            &#x25BC;
          </button>
        </div>
        <div data-part="positioner" class="combobox-positioner">
          <div
            data-part="content"
            class="combobox-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            <div data-part="list">
              {this.filteredItems.map((item) => (
                <div
                  key={item.value}
                  data-part="item"
                  data-value={item.value}
                  data-label={item.label}
                  class="combobox-item relative flex cursor-pointer select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span data-part="item-text" data-value={item.value} data-label={item.label}>
                    {item.label}
                  </span>
                  <span
                    data-part="item-indicator"
                    data-value={item.value}
                    data-label={item.label}
                    class="combobox-item-indicator ml-auto"
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
