import * as clipboard from '@zag-js/clipboard'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'
import type { JSXNode } from '../types'

export interface ClipboardProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the input. */
  label?: JSXNode
  /** Controlled value to copy to the clipboard. */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Milliseconds the "copied" state is shown before resetting.
   * @default 2000 */
  timeout?: number
  /** Called when the copy status changes. */
  onStatusChange?: (details: clipboard.CopyStatusDetails) => void
}

type ZE = {
  Schema: InferSchema<clipboard.Machine>
  Api: clipboard.Api
}

export default class Clipboard extends ZagComponent<ClipboardProps, ZE> {
  copied = false

  override createMachine() {
    return clipboard.machine
  }

  override getMachineProps(props: ClipboardProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      timeout: props.timeout ?? 2000,
      onStatusChange: (details) => {
        this.copied = details.copied
        props.onStatusChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return clipboard.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="input"]': 'getInputProps',
      '[data-part="indicator-copied"]': (api) => api.getIndicatorProps({ copied: true }),
      '[data-part="indicator-not-copied"]': (api) => api.getIndicatorProps({ copied: false }),
    }
  }

  override syncState(api: ZE['Api']) {
    this.copied = api.copied
  }

  template(props: ClipboardProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="clipboard-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="clipboard-control flex gap-2">
          <input
            data-part="input"
            class="clipboard-input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          />
          <button
            data-part="trigger"
            class="clipboard-trigger inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent"
          >
            {this.copied ? (
              <span data-part="indicator-copied">&#x2713; Copied</span>
            ) : (
              <span data-part="indicator-not-copied">Copy</span>
            )}
          </button>
        </div>
      </div>
    )
  }
}
