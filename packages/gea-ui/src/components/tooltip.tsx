import * as tooltip from '@zag-js/tooltip'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, Positioning } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export type TooltipOpenChangeDetails = { open: boolean }

export interface TooltipProps {
  /** CSS class(es) applied to the root wrapper element. */
  class?: ClassProp
  /** Content rendered inside the trigger element. */
  children: JSXNode
  /** Content rendered inside the tooltip. */
  content?: JSXNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Milliseconds to wait before opening after hover.
   * @default 400 */
  openDelay?: number
  /** Milliseconds to wait before closing after hover ends.
   * @default 150 */
  closeDelay?: number
  /** Closes the tooltip on pointer down.
   * @default true */
  closeOnPointerDown?: boolean
  /** Closes the tooltip when the Escape key is pressed.
   * @default true */
  closeOnEscape?: boolean
  /** Closes the tooltip when the page scrolls.
   * @default true */
  closeOnScroll?: boolean
  /** Allows the user to hover over the tooltip content without it closing.
   * @default false */
  interactive?: boolean
  /** Disables the tooltip when true. */
  disabled?: boolean
  /** Positioning options for the tooltip. */
  positioning?: Positioning
  /** Accessible label used when the tooltip has no visible text. */
  'aria-label'?: string
  /** Called when the open state changes. */
  onOpenChange?: (details: TooltipOpenChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<tooltip.Machine>
  Api: tooltip.Api
}

export default class Tooltip extends ZagComponent<TooltipProps, ZE> {
  declare open: boolean

  override createMachine() {
    return tooltip.machine
  }

  override getMachineProps(props: TooltipProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      openDelay: props.openDelay ?? 400,
      closeDelay: props.closeDelay ?? 150,
      closeOnPointerDown: props.closeOnPointerDown ?? true,
      closeOnEscape: props.closeOnEscape ?? true,
      closeOnScroll: props.closeOnScroll ?? true,
      interactive: props.interactive ?? false,
      disabled: props.disabled,
      positioning: props.positioning,
      'aria-label': props['aria-label'],
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return tooltip.connect(service, normalizeProps)
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

  template(props: TooltipProps) {
    return (
      <div class={cn(props.class)} style={{ display: 'inline-block' }}>
        <div data-part="trigger" class="tooltip-trigger" style={{ display: 'inline-block' }}>
          {props.children}
        </div>
        <div data-part="positioner" class="tooltip-positioner">
          <div
            data-part="content"
            class="tooltip-content z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md"
          >
            {props.content}
          </div>
        </div>
      </div>
    )
  }
}
