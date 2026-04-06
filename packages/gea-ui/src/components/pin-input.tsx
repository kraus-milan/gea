import * as pinInput from '@zag-js/pin-input'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

export type PinInputType = 'alphanumeric' | 'numeric' | 'alphabetic'

export type PinInputValueChangeDetails = { value: string[]; valueAsString: string }
export type PinInputValueCompleteDetails = { value: string[]; valueAsString: string }
export type PinInputValueInvalidDetails = { value: string; index: number }

export interface PinInputProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the inputs. */
  label?: LabelProp
  /** Controlled array of per-field values. */
  value?: string[]
  /** Initial per-field values (uncontrolled). */
  defaultValue?: string[]
  /** Number of input fields to render.
   * @default 4 */
  count?: number
  /** Character set accepted by each field.
   * @default "numeric" */
  type?: PinInputType
  /** Enables OTP autocomplete hints (`autocomplete="one-time-code"`).
   * @default false */
  otp?: boolean
  /** Masks the input values like a password field.
   * @default false */
  mask?: boolean
  /** Placeholder character shown in each empty field.
   * @default "○" */
  placeholder?: string
  /** Disables all input fields when true. */
  disabled?: boolean
  /** Makes all input fields read-only. */
  readOnly?: boolean
  /** Marks the pin input as invalid. */
  invalid?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the hidden input with a form element by id. */
  form?: string
  /** Moves focus away from the last field when all fields are filled.
   * @default false */
  blurOnComplete?: boolean
  /** Automatically focuses the first field on mount. */
  autoFocus?: boolean
  /** Called when any field value changes. */
  onValueChange?: (details: PinInputValueChangeDetails) => void
  /** Called when all fields have been filled. */
  onValueComplete?: (details: PinInputValueCompleteDetails) => void
  /** Called when an invalid character is entered. */
  onValueInvalid?: (details: PinInputValueInvalidDetails) => void
}

type ZE = {
  Schema: InferSchema<pinInput.Machine>
  Api: pinInput.Api
}

export default class PinInput extends ZagComponent<PinInputProps, ZE> {
  declare value: string[]
  declare valueAsString: string

  override createMachine() {
    return pinInput.machine
  }

  override getMachineProps(props: PinInputProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      count: props.count ?? 4,
      type: props.type ?? 'numeric',
      otp: props.otp ?? false,
      mask: props.mask ?? false,
      placeholder: props.placeholder ?? '○',
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      name: props.name,
      form: props.form,
      blurOnComplete: props.blurOnComplete ?? false,
      autoFocus: props.autoFocus,
      onValueChange: (details) => {
        this.value = details.value
        this.valueAsString = details.valueAsString
        props.onValueChange?.(details)
      },
      onValueComplete: props.onValueComplete,
      onValueInvalid: props.onValueInvalid,
    }
  }

  override connectApi(service: Service<ZE>) {
    return pinInput.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
      '[data-part="input"]': (api, el) => {
        const index = parseInt(el.dataset.index || '0', 10)
        return api.getInputProps({ index })
      },
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
    this.valueAsString = api.valueAsString
  }

  template(props: PinInputProps) {
    const count = props.count ?? 4
    const inputs = Array.from({ length: count }, (_, i) => i)
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="pin-input-label text-sm font-medium mb-2 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="pin-input-control flex gap-2">
          {inputs.map((i: number) => (
            <input
              key={i}
              data-part="input"
              data-index={String(i)}
              class="pin-input-field h-9 w-9 rounded-md border border-input bg-transparent text-center text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          ))}
        </div>
        <input data-part="hidden-input" type="hidden" />
      </div>
    )
  }
}
