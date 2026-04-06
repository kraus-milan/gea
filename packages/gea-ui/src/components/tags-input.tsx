import * as tagsInput from '@zag-js/tags-input'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'
import { cn } from '../utils/cn'

export type TagsInputValueChangeDetails = { value: string[] }

export interface TagsInputProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the input. */
  label?: LabelProp
  /** Controlled list of tag values. */
  value?: string[]
  /** Initial list of tag values (uncontrolled). */
  defaultValue?: string[]
  /** Maximum number of tags allowed. */
  max?: number
  /** Maximum character length for each tag. */
  maxLength?: number
  /** Disables the input when true. */
  disabled?: boolean
  /** Makes the input read-only. */
  readOnly?: boolean
  /** Marks the input as invalid. */
  invalid?: boolean
  /** Adds a tag when the user pastes text.
   * @default false */
  addOnPaste?: boolean
  /** Allows editing existing tags inline.
   * @default true */
  editable?: boolean
  /** Allows adding duplicate tag values.
   * @default false */
  allowDuplicates?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Associates the input with a form element by id. */
  form?: string
  /** Placeholder text shown in the input when empty. */
  placeholder?: string
  /** What happens to the typed input value when the field loses focus. */
  blurBehavior?: tagsInput.Props['blurBehavior']
  /** Character or pattern used to split pasted text into tags. */
  delimiter?: tagsInput.Props['delimiter']
  /** Called when the list of tags changes. */
  onValueChange?: (details: TagsInputValueChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<tagsInput.Machine>
  Api: tagsInput.Api
}

export default class TagsInput extends ZagComponent<TagsInputProps, ZE> {
  declare value: string[]

  override createMachine() {
    return tagsInput.machine
  }

  override getMachineProps(props: TagsInputProps): Props<ZE> {
    return {
      id: this.id,
      value: props.value,
      defaultValue: props.defaultValue,
      max: props.max,
      maxLength: props.maxLength,
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      addOnPaste: props.addOnPaste ?? false,
      editable: props.editable ?? true,
      allowDuplicates: props.allowDuplicates ?? false,
      name: props.name,
      form: props.form,
      placeholder: props.placeholder,
      blurBehavior: props.blurBehavior,
      delimiter: props.delimiter,
      onValueChange: (details) => {
        this.value = details.value
        props.onValueChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return tagsInput.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="control"]': 'getControlProps',
      '[data-part="input"]': 'getInputProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
      '[data-part="clear-trigger"]': 'getClearTriggerProps',
      '[data-part="item"]': (api, el) => {
        const ds = el.dataset
        return api.getItemProps({ index: ds.index!, value: ds.value! })
      },
      '[data-part="item-preview"]': (api, el) => {
        const ds = el.dataset
        return api.getItemPreviewProps({ index: ds.index!, value: ds.value! })
      },
      '[data-part="item-text"]': (api, el) => {
        const ds = el.dataset
        return api.getItemTextProps({ index: ds.index!, value: ds.value! })
      },
      '[data-part="item-delete-trigger"]': (api, el) => {
        const ds = el.dataset
        return api.getItemDeleteTriggerProps({ index: ds.index!, value: ds.value! })
      },
    }
  }

  override syncState(api: ZE['Api']) {
    this.value = api.value
  }

  template(props: TagsInputProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="tags-input-label text-sm font-medium mb-1 block">
            {props.label}
          </label>
        )}
        <div
          data-part="control"
          class="tags-input-control flex flex-wrap gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs focus-within:ring-1 focus-within:ring-ring"
        >
          {(this.value || []).map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              data-part="item"
              data-index={String(i)}
              data-value={tag}
              class="tags-input-item inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
            >
              <span
                data-part="item-preview"
                data-index={String(i)}
                data-value={tag}
                class="inline-flex items-center gap-1 data-highlighted:ring-2 data-highlighted:ring-ring data-highlighted:rounded-xs"
              >
                <span data-part="item-text" data-index={String(i)} data-value={tag}>
                  {tag}
                </span>
              </span>
              <button
                data-part="item-delete-trigger"
                data-index={String(i)}
                data-value={tag}
                class="tags-input-item-delete text-muted-foreground hover:text-foreground"
              >
                &#x2715;
              </button>
            </span>
          ))}
          <input
            data-part="input"
            class="tags-input-input flex-1 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground min-w-15"
          />
        </div>
        <input data-part="hidden-input" type="hidden" />
      </div>
    )
  }
}
