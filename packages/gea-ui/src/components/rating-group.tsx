import * as ratingGroup from '@zag-js/rating-group'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

export type RatingGroupValueChangeDetails = { value: number }

export interface RatingGroupProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the rating control. */
  label?: LabelProp
  /** Controlled rating value. */
  value?: number
  /** Initial rating value (uncontrolled). */
  defaultValue?: number
  /** Total number of stars to render.
   * @default 5 */
  count?: number
  /** Allows selecting half-star values. */
  allowHalf?: boolean
  /** Makes the rating read-only. */
  readOnly?: boolean
  /** Disables the rating when true. */
  disabled?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the rating with a form element by id. */
  form?: string
  /** Called when the rating value changes. */
  onValueChange?: (details: RatingGroupValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<ratingGroup.Machine>
  Api: ratingGroup.Api
}

export default class RatingGroup extends ZagComponent<RatingGroupProps, ZE> {
  declare value: number
  declare _allowHalf: boolean

  override createMachine() {
    return ratingGroup.machine
  }

  override getMachineProps(props: RatingGroupProps): Props<ZE> {
    this._allowHalf = !!props.allowHalf
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      count: props.count ?? 5,
      allowHalf: !!props.allowHalf,
      readOnly: props.readOnly,
      disabled: props.disabled,
      name: props.name,
      form: props.form,
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return ratingGroup.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
      '[data-part="item"]': (api, el) => {
        const index = parseInt(el.dataset.index || '0', 10)
        const props = api.getItemProps({ index })
        if (this._allowHalf) {
          props.onpointerdown = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect()
            const isLeftHalf = e.clientX - rect.left < rect.width / 2
            api.setValue(isLeftHalf ? index - 0.5 : index)
          }
        }
        return props
      },
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  _applyAllSpreads() {
    super._applyAllSpreads()
    if (!this._api || !this.el) return
    const items = this.el.querySelectorAll('[data-part="item"]')
    for (let i = 0; i < items.length; i++) {
      const el = items[i] as HTMLElement
      const index = parseInt(el.dataset.index || '0', 10)
      const state = this._api.getItemState({ index })
      if (state.half) {
        el.style.background = 'linear-gradient(90deg, #facc15 50%, hsl(var(--muted-foreground)) 50%)'
        el.style.backgroundClip = 'text'
        el.style.setProperty('-webkit-background-clip', 'text')
        el.style.setProperty('-webkit-text-fill-color', 'transparent')
      } else {
        el.style.background = ''
        el.style.backgroundClip = ''
        el.style.setProperty('-webkit-background-clip', '')
        el.style.setProperty('-webkit-text-fill-color', '')
      }
    }
  }

  template(props: RatingGroupProps) {
    const count = props.count ?? 5
    const items = Array.from({ length: count }, (_, i) => i + 1)
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="rating-group-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div data-part="control" class="rating-group-control flex gap-0.5">
          {items.map((i) => (
            <span
              key={i}
              data-part="item"
              data-index={String(i)}
              class="rating-group-item cursor-pointer text-2xl text-muted-foreground data-highlighted:text-yellow-400 data-checked:text-yellow-400"
              style={{ lineHeight: 1 }}
            >
              &#x2605;
            </span>
          ))}
        </div>
        <input data-part="hidden-input" type="hidden" />
      </div>
    )
  }
}
