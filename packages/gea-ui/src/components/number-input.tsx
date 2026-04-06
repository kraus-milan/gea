import * as numberInput from '@zag-js/number-input'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'

export type NumberInputValueChangeDetails = { value: string; valueAsNumber: number }

export interface NumberInputProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the input. */
  label?: LabelProp
  /** Controlled string value of the input. */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Minimum allowed value. */
  min?: number
  /** Maximum allowed value. */
  max?: number
  /** Amount to increment or decrement on each step.
   * @default 1 */
  step?: number
  /** Disables the input when true. */
  disabled?: boolean
  /** Makes the input read-only. */
  readOnly?: boolean
  /** Marks the input as invalid. */
  invalid?: boolean
  /** Marks the input as required. */
  required?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the input with a form element by id. */
  form?: string
  /** Allows changing the value by scrolling over the input. */
  allowMouseWheel?: boolean
  /** Clamps the value to `min`/`max` when the input loses focus.
   * @default true */
  clampValueOnBlur?: boolean
  /** `Intl.NumberFormat` options used to format the displayed value. */
  formatOptions?: numberInput.Props['formatOptions']
  /** BCP 47 locale tag used for number formatting. */
  locale?: string
  /** Called when the value changes. */
  onValueChange?: (details: numberInput.ValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<numberInput.Machine>
  Api: numberInput.Api
}

export default class NumberInput extends ZagComponent<NumberInputProps, ZE> {
  declare value: string
  declare valueAsNumber: number

  override createMachine() {
    return numberInput.machine
  }

  override getMachineProps(props: NumberInputProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      min: props.min,
      max: props.max,
      step: props.step ?? 1,
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      required: props.required,
      name: props.name,
      form: props.form,
      allowMouseWheel: props.allowMouseWheel,
      clampValueOnBlur: props.clampValueOnBlur ?? true,
      formatOptions: props.formatOptions,
      locale: props.locale,
      onValueChange: (details) => {
        this.value = details.value
        this.valueAsNumber = details.valueAsNumber
        props.onValueChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return numberInput.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="input"]': 'getInputProps',
      '[data-part="increment-trigger"]': 'getIncrementTriggerProps',
      '[data-part="decrement-trigger"]': 'getDecrementTriggerProps',
      '[data-part="scrubber"]': 'getScrubberProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
    this.valueAsNumber = api.valueAsNumber
  }

  template(props: NumberInputProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="number-input-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="number-input-control flex">
          <button
            data-part="decrement-trigger"
            class="number-input-decrement inline-flex h-9 items-center justify-center rounded-l-md border border-r-0 border-input px-2 hover:bg-accent"
          >
            &#x2212;
          </button>
          <input
            data-part="input"
            class="number-input-input h-9 w-full border border-input bg-transparent px-3 text-center text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            data-part="increment-trigger"
            class="number-input-increment inline-flex h-9 items-center justify-center rounded-r-md border border-l-0 border-input px-2 hover:bg-accent"
          >
            &#x2B;
          </button>
        </div>
      </div>
    )
  }
}
