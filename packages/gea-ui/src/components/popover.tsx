import * as popover from '@zag-js/popover'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, Positioning } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export type PopoverOpenChangeDetails = { open: boolean }

export interface PopoverProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the popover body. */
  children: JSXNode
  /** Label for the button that opens the popover. */
  triggerLabel?: string
  /** Title text rendered in the popover header. */
  title?: string
  /** Description text rendered below the title. */
  description?: string
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Renders the popover as a modal overlay.
   * @default false */
  modal?: boolean
  /** Renders the popover in a portal outside the DOM hierarchy.
   * @default true */
  portalled?: boolean
  /** Automatically focuses the first focusable element when opened.
   * @default true */
  autoFocus?: boolean
  /** Closes the popover when clicking outside its content.
   * @default true */
  closeOnInteractOutside?: boolean
  /** Closes the popover when the Escape key is pressed.
   * @default true */
  closeOnEscape?: boolean
  /** Positioning options for the popover. */
  positioning?: Positioning
  /** Called when the open state changes. */
  onOpenChange?: (details: PopoverOpenChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<popover.Machine>
  Api: popover.Api
}

export default class Popover extends ZagComponent<PopoverProps, ZE> {
  declare open: boolean

  override createMachine() {
    return popover.machine
  }

  override getMachineProps(props: PopoverProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      modal: props.modal ?? false,
      portalled: props.portalled ?? true,
      autoFocus: props.autoFocus ?? true,
      closeOnInteractOutside: props.closeOnInteractOutside ?? true,
      closeOnEscape: props.closeOnEscape ?? true,
      positioning: props.positioning,
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return popover.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="positioner"]': 'getPositionerProps',
      '[data-part="content"]': 'getContentProps',
      '[data-part="title"]': 'getTitleProps',
      '[data-part="description"]': 'getDescriptionProps',
      '[data-part="close-trigger"]': 'getCloseTriggerProps',
      '[data-part="arrow"]': 'getArrowProps',
      '[data-part="arrow-tip"]': 'getArrowTipProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.open = api.open
  }

  template(props: PopoverProps) {
    return (
      <div class={cn(props.class)}>
        <button data-part="trigger" class="popover-trigger">
          {props.triggerLabel || 'Open'}
        </button>
        <div data-part="positioner" class="popover-positioner">
          <div
            data-part="content"
            class="popover-content z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden"
          >
            {props.title && (
              <div data-part="title" class="popover-title font-medium leading-none mb-2">
                {props.title}
              </div>
            )}
            {props.description && (
              <p data-part="description" class="popover-description text-sm text-muted-foreground mb-3">
                {props.description}
              </p>
            )}
            <div class="popover-body">{props.children}</div>
            <button
              data-part="close-trigger"
              class="popover-close-trigger absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
            >
              &#x2715;
            </button>
          </div>
        </div>
      </div>
    )
  }
}
