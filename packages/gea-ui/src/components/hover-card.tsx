import * as hoverCard from '@zag-js/hover-card'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, Positioning } from './types'

export interface HoverCardProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Unused — prefer `triggerLabel` for the trigger text. */
  label?: JSXNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Milliseconds to wait before opening after hover. */
  openDelay?: number
  /** Milliseconds to wait before closing after hover ends. */
  closeDelay?: number
  /** Positioning options for the card popover. */
  positioning?: Positioning
  /** Called when the open state changes. */
  onOpenChange?: (details: hoverCard.OpenChangeDetails) => void
  /** `href` attribute on the trigger anchor element. */
  href?: string
  /** Text rendered inside the trigger anchor. */
  triggerLabel?: string
  /** Content rendered inside the hover card. */
  children: JSXNode
}

type ZE = {
  Schema: InferSchema<hoverCard.Machine>
  Api: hoverCard.Api
}

export default class HoverCard extends ZagComponent<HoverCardProps, ZE> {
  declare open: boolean

  override createMachine() {
    return hoverCard.machine
  }

  override getMachineProps(props: HoverCardProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      openDelay: props.openDelay,
      closeDelay: props.closeDelay,
      positioning: props.positioning,
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return hoverCard.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="positioner"]': 'getPositionerProps',
      '[data-part="content"]': 'getContentProps',
      '[data-part="arrow"]': 'getArrowProps',
      '[data-part="arrow-tip"]': 'getArrowTipProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.open = api.open
  }

  template(props: HoverCardProps) {
    return (
      <div class={cn(props.class)} style={{ display: 'inline-block' }}>
        <a data-part="trigger" href={props.href || '#'} class="hover-card-trigger inline-block">
          {props.triggerLabel || 'Hover me'}
        </a>
        <div data-part="positioner" class="hover-card-positioner">
          <div
            data-part="content"
            class="hover-card-content z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden"
          >
            {props.children}
          </div>
        </div>
      </div>
    )
  }
}
