import * as checkbox from '@zag-js/checkbox'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'

export interface CheckboxProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered next to the checkbox. */
  label?: JSXNode
  /** Controlled checked state. */
  checked?: checkbox.CheckedState
  /** Initial checked state (uncontrolled). */
  defaultChecked?: checkbox.CheckedState
  /** Disables the checkbox when true. */
  disabled?: boolean
  /** Marks the checkbox as invalid. */
  invalid?: boolean
  /** Marks the checkbox as required. */
  required?: boolean
  /** Makes the checkbox read-only. */
  readOnly?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the checkbox with a form element by id. */
  form?: string
  /** Value submitted with the form when checked.
   * @default "on" */
  value?: string
  /** Called when the checked state changes. */
  onCheckedChange?: (details: checkbox.CheckedChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<checkbox.Machine>
  Api: checkbox.Api
}

export default class Checkbox extends ZagComponent<CheckboxProps, ZE> {
  checked: checkbox.CheckedState = false

  override createMachine() {
    return checkbox.machine
  }

  override getMachineProps(props: CheckboxProps): Props<ZE> {
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
    return checkbox.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="indicator"]': 'getIndicatorProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.checked = api.checkedState
  }

  template(props: CheckboxProps) {
    return (
      <label data-part="root" class={cn('checkbox-root inline-flex items-center gap-2 cursor-pointer', props.class)}>
        <input data-part="hidden-input" type="checkbox" class="sr-only" />
        <div
          data-part="control"
          class="checkbox-control h-4 w-4 shrink-0 rounded-xs border border-primary shadow transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        >
          <span
            data-part="indicator"
            class="checkbox-indicator flex items-center justify-center text-current h-full w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
        {props.label && (
          <span data-part="label" class="checkbox-label text-sm font-medium leading-none">
            {props.label}
          </span>
        )}
      </label>
    )
  }
}
