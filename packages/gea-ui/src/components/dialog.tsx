import * as dialog from '@zag-js/dialog'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'
import { cn } from '../utils/cn'

export interface DialogProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the dialog body. */
  children?: JSXNode
  /** Label for the button that opens the dialog. */
  triggerLabel?: string
  /** Title text rendered in the dialog header. */
  title?: string
  /** Description text rendered below the title. */
  description?: string
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Renders the dialog as a modal with a backdrop.
   * @default true */
  modal?: boolean
  /** Closes the dialog when clicking outside its content.
   * @default true */
  closeOnInteractOutside?: boolean
  /** Closes the dialog when the Escape key is pressed.
   * @default true */
  closeOnEscape?: boolean
  /** Traps keyboard focus within the dialog while open.
   * @default true */
  trapFocus?: boolean
  /** Prevents the page from scrolling while the dialog is open.
   * @default true */
  preventScroll?: boolean
  /** ARIA role applied to the dialog content.
   * @default "dialog" */
  role?: 'dialog' | 'alertdialog'
  /** Accessible label used when no visible title is present. */
  'aria-label'?: string
  /** Called when the open state changes. */
  onOpenChange?: (details: dialog.OpenChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<dialog.Machine>
  Api: dialog.Api
}

export default class Dialog extends ZagComponent<DialogProps, ZE> {
  declare open: boolean

  override createMachine() {
    return dialog.machine
  }

  override getMachineProps(props: DialogProps): Props<ZE> {
    return {
      id: this.id,
      open: props.open,
      defaultOpen: props.defaultOpen,
      modal: props.modal ?? true,
      closeOnInteractOutside: props.closeOnInteractOutside ?? true,
      closeOnEscape: props.closeOnEscape ?? true,
      trapFocus: props.trapFocus ?? true,
      preventScroll: props.preventScroll ?? true,
      role: props.role ?? 'dialog',
      'aria-label': props['aria-label'],
      onOpenChange: (details) => {
        this.open = details.open
        props.onOpenChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return dialog.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="backdrop"]': 'getBackdropProps',
      '[data-part="positioner"]': (api) => ({
        ...api.getPositionerProps(),
        hidden: !api.open,
      }),
      '[data-part="content"]': 'getContentProps',
      '[data-part="title"]': 'getTitleProps',
      '[data-part="description"]': 'getDescriptionProps',
      '[data-part="close-trigger"]': (api) => {
        const { id: _, ...props } = api.getCloseTriggerProps()
        return {
          ...props,
          // normalizeProps lowercases onClick → onclick; must match to override
          // Zag's default handler which calls stopPropagation()
          onclick: (e: MouseEvent) => {
            if (e.defaultPrevented) return
            api.setOpen(false)
          },
        }
      },
      '[data-part="trigger"]': (api) => {
        const props = api.getTriggerProps()
        const origOnClick = props.onclick
        const preventTriggerFocus = (e: MouseEvent | PointerEvent) => {
          if ('button' in e && e.button !== 0) return
          e.preventDefault()
        }
        return {
          ...props,
          onpointerdown: preventTriggerFocus,
          onmousedown: preventTriggerFocus,
          onclick: (e: MouseEvent) => {
            ;(e.currentTarget as HTMLElement)?.blur()
            origOnClick?.(e)
          },
        }
      },
    }
  }

  syncState(api: any) {
    this.open = api.open
  }

  template(props: DialogProps) {
    return (
      <div class={cn(props.class)}>
        {props.triggerLabel && (
          <button data-part="trigger" class="dialog-trigger">
            {props.triggerLabel}
          </button>
        )}
        <div data-part="backdrop" class="dialog-backdrop fixed inset-0 bg-black/50 z-50" hidden></div>
        <div
          data-part="positioner"
          class="dialog-positioner fixed inset-0 flex items-center justify-center z-50"
          hidden
        >
          <div data-part="content" class="dialog-content text-foreground rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            {props.title && (
              <h2 data-part="title" class="dialog-title text-lg font-semibold mb-2">
                {props.title}
              </h2>
            )}
            {props.description && (
              <p data-part="description" class="dialog-description text-sm text-muted-foreground mb-4">
                {props.description}
              </p>
            )}
            <div class="dialog-body">{props.children}</div>
            <button
              data-part="close-trigger"
              class="dialog-close-trigger absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              &#x2715;
            </button>
          </div>
        </div>
      </div>
    )
  }
}
