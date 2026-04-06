import * as progress from '@zag-js/progress'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

export type ProgressValueChangeDetails = { value: number | null }

export interface ProgressProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the progress bar. */
  label?: LabelProp
  /** Controlled value.  */
  value?: number
  /** Initial value (uncontrolled).
   * @default 0 */
  defaultValue?: number
  /** Minimum value.
   * @default 0 */
  min?: number
  /** Maximum value.
   * @default 100 */
  max?: number
  /** Layout orientation of the progress bar. */
  orientation?: 'horizontal' | 'vertical'
  /** Called when the value changes. */
  onValueChange?: (details: ProgressValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<progress.Machine>
  Api: progress.Api
}

export default class Progress extends ZagComponent<ProgressProps, ZE> {
  declare value: number | null
  percent = 0

  override createMachine() {
    return progress.machine
  }

  override getMachineProps(props: ProgressProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue ?? 0,
      min: props.min ?? 0,
      max: props.max ?? 100,
      orientation: props.orientation,
      onValueChange: props.onValueChange,
    }
  }

  override connectApi(service: Service<ZE>) {
    return progress.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="track"]': 'getTrackProps',
      '[data-part="range"]': 'getRangeProps',
      '[data-part="value-text"]': 'getValueTextProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
    this.percent = api.percent
  }

  template(props: ProgressProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        <div class="flex justify-between mb-1">
          {props.label && (
            <span data-part="label" class="progress-label text-sm font-medium">
              {props.label}
            </span>
          )}
          <span data-part="value-text" class="progress-value-text text-sm text-muted-foreground">
            {this.percent}%
          </span>
        </div>
        <div data-part="track" class="progress-track relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div
            data-part="range"
            class="progress-range h-full w-full flex-1 bg-primary transition-all"
            style={{ width: `${this.percent}%` }}
          ></div>
        </div>
      </div>
    )
  }
}
