import * as collapsible from '@zag-js/collapsible'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface CollapsibleProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered in the trigger button.
   * @default "Toggle" */
  label?: JSXNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Disables the collapsible when true. */
  disabled?: boolean
  /** Called when the open state changes. */
  onOpenChange?: (details: collapsible.OpenChangeDetails) => void
  /** Content revealed when expanded. */
  children: JSXNode
}

type ZE = {
  Schema: InferSchema<collapsible.Machine>
  Api: collapsible.Api
}

export default class Collapsible extends ZagComponent<CollapsibleProps, ZE> {
  declare open: boolean

  override createMachine() {
    return collapsible.machine
  }

  override getMachineProps(props: CollapsibleProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      disabled: props.disabled,
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return collapsible.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="content"]': 'getContentProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.open = api.open
  }

  template(props: CollapsibleProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        <button
          data-part="trigger"
          class="collapsible-trigger flex w-full items-center justify-between py-2 text-sm font-medium"
        >
          {props.label || 'Toggle'}
        </button>
        <div data-part="content" class="collapsible-content overflow-hidden">
          <div class="pb-4">{props.children}</div>
        </div>
      </div>
    )
  }
}
