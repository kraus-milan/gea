import * as toggleGroup from '@zag-js/toggle-group'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface ToggleGroupItem {
  /** Unique value identifying this toggle. */
  value: string
  /** Content rendered inside the toggle button. */
  label: JSXNode
}

export type ToggleGroupValueChangeDetails = { value: string[] }

export interface ToggleGroupProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Items to render as toggle buttons. */
  items?: ToggleGroupItem[]
  /** Controlled active toggle values. */
  value?: string[]
  /** Initial active toggle values (uncontrolled). */
  defaultValue?: string[]
  /** Allows multiple toggles to be active at once.
   * @default false */
  multiple?: boolean
  /** Disables all toggles when true. */
  disabled?: boolean
  /** Layout orientation of the group.
   * @default "horizontal" */
  orientation?: 'horizontal' | 'vertical'
  /** Wraps keyboard focus from last to first item and vice versa.
   * @default true */
  loopFocus?: boolean
  /** Uses roving tabindex for keyboard navigation.
   * @default true */
  rovingFocus?: boolean
  /** Called when the active toggle values change. */
  onValueChange?: (details: ToggleGroupValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<toggleGroup.Machine>
  Api: toggleGroup.Api
}

export default class ToggleGroup extends ZagComponent<ToggleGroupProps, ZE> {
  declare value: string[]

  override createMachine() {
    return toggleGroup.machine
  }

  override getMachineProps(props: ToggleGroupProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      multiple: props.multiple ?? false,
      disabled: props.disabled,
      orientation: props.orientation ?? 'horizontal',
      loopFocus: props.loopFocus ?? true,
      rovingFocus: props.rovingFocus ?? true,
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return toggleGroup.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="item"]': (api, el) => api.getItemProps({ value: el.dataset.value }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  template(props: ToggleGroupProps) {
    const items = props.items || []
    return (
      <div data-part="root" class={cn('toggle-group-root inline-flex rounded-md border', props.class)}>
        {items.map((item) => (
          <button
            key={item.value}
            data-part="item"
            data-value={item.value}
            class="toggle-group-item inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  }
}
