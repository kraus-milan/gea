import * as slider from '@zag-js/slider'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

const THUMB_CLASS =
  'slider-thumb block h-5 w-5 rounded-full border-2 border-primary bg-background shadow ' +
  'transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring'

export type SliderValueChangeDetails = { value: number[] }

export interface SliderProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the slider. */
  label?: LabelProp
  /** Controlled value(s) — one entry per thumb.  */
  value?: number[]
  /** Initial value(s) (uncontrolled).
   * @default [50] */
  defaultValue?: number[]
  /** Minimum value.
   * @default 0 */
  min?: number
  /** Maximum value.
   * @default 100 */
  max?: number
  /** Amount to increment or decrement on each step.
   * @default 1 */
  step?: number
  /** Layout orientation of the slider.
   * @default "horizontal" */
  orientation?: 'horizontal' | 'vertical'
  /** How the thumb aligns relative to the track.
   * @default "center" */
  thumbAlignment?: 'center' | 'contain'
  /** Disables the slider when true. */
  disabled?: boolean
  /** Makes the slider read-only. */
  readOnly?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Accessible label for the thumb when no visible label is present. */
  'aria-label'?: string[]
  /** Called while the value is being dragged. */
  onValueChange?: (details: SliderValueChangeDetails) => void
  /** Called when the drag interaction ends. */
  onValueChangeEnd?: (details: SliderValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<slider.Machine>
  Api: slider.Api
}

export default class Slider extends ZagComponent<SliderProps, ZE> {
  declare value: number[]

  override createMachine() {
    return slider.machine
  }

  override getMachineProps(props: SliderProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue ?? [50],
      min: props.min ?? 0,
      max: props.max ?? 100,
      step: props.step ?? 1,
      orientation: props.orientation ?? 'horizontal',
      thumbAlignment: props.thumbAlignment ?? 'center',
      disabled: props.disabled,
      readOnly: props.readOnly,
      name: props.name,
      'aria-label': props['aria-label'],
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
      onValueChangeEnd: props.onValueChangeEnd,
    }
  }

  override connectApi(service: Service<ZE>) {
    return slider.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="track"]': 'getTrackProps',
      '[data-part="range"]': 'getRangeProps',
      '[data-part="thumb"]': (api, el) => {
        const index = parseInt(el.dataset.index || '0', 10)
        return api.getThumbProps({ index })
      },
      '[data-part="hidden-input"]': (api, el) => {
        const index = parseInt(el.dataset.index || '0', 10)
        return api.getHiddenInputProps({ index })
      },
    }
  }

  _syncThumbs() {
    if (!this._api || !this.el) return
    const control = this.el.querySelector('[data-part="control"]')
    if (!control) return

    const thumbCount = this._api.value.length
    const existing = control.querySelectorAll(':scope > [data-part="thumb"]')

    if (existing.length === thumbCount) return

    if (existing.length < thumbCount) {
      for (let i = existing.length; i < thumbCount; i++) {
        const thumb = document.createElement('div')
        thumb.setAttribute('data-part', 'thumb')
        thumb.setAttribute('data-index', String(i))
        thumb.className = THUMB_CLASS

        const input = document.createElement('input')
        input.setAttribute('data-part', 'hidden-input')
        input.setAttribute('data-index', String(i))
        input.type = 'hidden'
        thumb.appendChild(input)

        control.appendChild(thumb)
      }
    } else {
      for (let i = existing.length - 1; i >= thumbCount; i--) {
        existing[i].remove()
      }
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  _applyAllSpreads() {
    this._syncThumbs()
    this._elementCache?.clear()
    super._applyAllSpreads()
  }

  template(props: SliderProps) {
    return (
      <div data-part="root" class={cn('w-full', props.class)}>
        {props.label && (
          <div class="flex justify-between mb-2">
            <label data-part="label" class="slider-label text-sm font-medium">
              {props.label}
            </label>
          </div>
        )}
        <div data-part="control" class="slider-control relative flex items-center">
          <div
            data-part="track"
            class="slider-track relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
          >
            <div data-part="range" class="slider-range absolute h-full bg-primary"></div>
          </div>
          <div data-part="thumb" data-index="0" class={THUMB_CLASS}>
            <input data-part="hidden-input" data-index="0" type="hidden" />
          </div>
        </div>
      </div>
    )
  }
}
