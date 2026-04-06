import * as switchMachine from '@zag-js/switch'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

export type SwitchCheckedChangeDetails = { checked: boolean }

export interface SwitchProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered next to the switch. */
  label?: LabelProp
  /** Controlled checked state. */
  checked?: boolean
  /** Initial checked state (uncontrolled). */
  defaultChecked?: boolean
  /** Disables the switch when true. */
  disabled?: boolean
  /** Marks the switch as invalid. */
  invalid?: boolean
  /** Marks the switch as required. */
  required?: boolean
  /** Makes the switch read-only. */
  readOnly?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the switch with a form element by id. */
  form?: string
  /** Value submitted with the form when checked.
   * @default "on" */
  value?: string
  /** Called when the checked state changes. */
  onCheckedChange?: (details: SwitchCheckedChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<switchMachine.Machine>
  Api: switchMachine.Api
}

export default class Switch extends ZagComponent<SwitchProps, ZE> {
  checked = false

  override createMachine() {
    return switchMachine.machine
  }

  override getMachineProps(props: SwitchProps): Props<ZE> {
    return {
      id: this.id,
      checked: props.checked,
      defaultChecked: props.defaultChecked,
      disabled: props.disabled,
      invalid: props.invalid,
      required: props.required,
      readOnly: props.readOnly,
      name: props.name,
      form: props.form,
      value: props.value ?? 'on',
      onCheckedChange: (details) => {
        this.checked = details.checked
        props.onCheckedChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return switchMachine.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="thumb"]': 'getThumbProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.checked = api.checked
  }

  template(props: SwitchProps) {
    return (
      <label data-part="root" class={cn('switch-root inline-flex items-center gap-2 cursor-pointer', props.class)}>
        <input data-part="hidden-input" type="checkbox" />
        <span
          data-part="control"
          class="switch-control inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        >
          <span
            data-part="thumb"
            class="switch-thumb pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          ></span>
        </span>
        {props.label && (
          <span data-part="label" class="switch-label text-sm font-medium">
            {props.label}
          </span>
        )}
      </label>
    )
  }
}
