import * as radioGroup from '@zag-js/radio-group'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface RadioGroupItem {
  /** Unique value identifying this radio option. */
  value: string
  /** Label content rendered next to the radio control. */
  label: JSXNode
}

export type RadioGroupValueChangeDetails = { value: string }

export interface RadioGroupProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the group. */
  label?: LabelProp
  /** Radio items to render. */
  items?: RadioGroupItem[]
  /** Controlled selected value. */
  value?: string
  /** Initial selected value (uncontrolled). */
  defaultValue?: string
  /** Name attribute shared across all radio inputs for form submission. */
  name?: string
  /** Associates the group with a form element by id. */
  form?: string
  /** Disables all radio items when true. */
  disabled?: boolean
  /** Makes all radio items read-only. */
  readOnly?: boolean
  /** Layout orientation of the group.
   * @default "vertical" */
  orientation?: 'horizontal' | 'vertical'
  /** Called when the selected value changes. */
  onValueChange?: (details: RadioGroupValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<radioGroup.Machine>
  Api: radioGroup.Api
}

export default class RadioGroup extends ZagComponent<RadioGroupProps, ZE> {
  declare value: string | null

  override createMachine() {
    return radioGroup.machine
  }

  override getMachineProps(props: RadioGroupProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      name: props.name,
      form: props.form,
      disabled: props.disabled,
      readOnly: props.readOnly,
      orientation: props.orientation ?? 'vertical',
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return radioGroup.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="indicator"]': 'getIndicatorProps',
      '[data-part="item"]': (api, el) => api.getItemProps({ value: el.dataset.value }),
      '[data-part="item-text"]': (api, el) => api.getItemTextProps({ value: el.dataset.value }),
      '[data-part="item-control"]': (api, el) => api.getItemControlProps({ value: el.dataset.value }),
      '[data-part="item-hidden-input"]': (api, el) => api.getItemHiddenInputProps({ value: el.dataset.value }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  template(props: RadioGroupProps) {
    const items = props.items || []
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <span data-part="label" class="radio-group-label text-sm font-medium mb-2 block">
            {props.label}
          </span>
        )}
        <div data-part="indicator" class="radio-group-indicator"></div>
        {items.map((item) => (
          <label
            key={item.value}
            data-part="item"
            data-value={item.value}
            class="radio-group-item flex items-center gap-2 cursor-pointer py-1"
          >
            <div
              data-part="item-control"
              data-value={item.value}
              class="radio-group-item-control h-4 w-4 rounded-full border border-primary flex items-center justify-center"
            >
              <span class="radio-dot"></span>
            </div>
            <input data-part="item-hidden-input" data-value={item.value} type="radio" class="sr-only" />
            <span data-part="item-text" data-value={item.value} class="radio-group-item-text text-sm">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    )
  }
}
