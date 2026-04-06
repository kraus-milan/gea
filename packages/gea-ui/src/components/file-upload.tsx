import * as fileUpload from '@zag-js/file-upload'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp, LabelProp } from './types'

export interface FileUploadProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Label content rendered above the dropzone. */
  label?: LabelProp
  /** Accepted file types (e.g. `{ 'image/*': [] }`). */
  accept?: fileUpload.Props['accept']
  /** Maximum number of files that can be selected.
   * @default 1 */
  maxFiles?: number
  /** Maximum file size in bytes. */
  maxFileSize?: number
  /** Minimum file size in bytes. */
  minFileSize?: number
  /** Disables the file upload when true. */
  disabled?: boolean
  /** Allows dropping files onto the dropzone.
   * @default true */
  allowDrop?: boolean
  /** Name attribute for form submission. */
  name?: string
  /** Called when the selected files change. */
  onFileChange?: (details: fileUpload.FileChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<fileUpload.Machine>
  Api: fileUpload.Api
}

export default class FileUpload extends ZagComponent<FileUploadProps, ZE> {
  declare acceptedFiles: File[]
  declare rejectedFiles: any[]

  override createMachine() {
    return fileUpload.machine
  }

  override getMachineProps(props: FileUploadProps): Props<ZE> {
    return {
      id: this.id,
      accept: props.accept,
      maxFiles: props.maxFiles,
      maxFileSize: props.maxFileSize,
      minFileSize: props.minFileSize,
      disabled: props.disabled,
      allowDrop: props.allowDrop ?? true,
      name: props.name,
      onFileChange: (details) => {
        this.acceptedFiles = details.acceptedFiles
        this.rejectedFiles = details.rejectedFiles
        props.onFileChange?.(details)
      },
    }
  }

  override connectApi(service: Service<ZE>) {
    return fileUpload.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="label"]': 'getLabelProps',
      '[data-part="dropzone"]': 'getDropzoneProps',
      '[data-part="trigger"]': 'getTriggerProps',
      '[data-part="hidden-input"]': 'getHiddenInputProps',
      '[data-part="clear-trigger"]': 'getClearTriggerProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.acceptedFiles = api.acceptedFiles
    this.rejectedFiles = api.rejectedFiles
  }

  template(props: FileUploadProps) {
    return (
      <div data-part="root" class={cn(props.class)}>
        {props.label && (
          <label data-part="label" class="file-upload-label text-sm font-medium mb-2 block">
            {props.label}
          </label>
        )}
        <div
          data-part="dropzone"
          class="file-upload-dropzone flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-muted-foreground/50 transition-colors"
        >
          <p class="text-sm text-muted-foreground mb-2">Drag and drop files here</p>
          <button
            data-part="trigger"
            class="file-upload-trigger inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Choose Files
          </button>
        </div>
        <input data-part="hidden-input" type="file" class="sr-only" />
        {this.acceptedFiles.length > 0 && (
          <div class="file-upload-file-list mt-3 space-y-1">
            {this.acceptedFiles.map((file) => (
              <div key={file.name} class="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>{file.name}</span>
              </div>
            ))}
            <button
              data-part="clear-trigger"
              class="file-upload-clear text-xs text-muted-foreground hover:text-foreground mt-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    )
  }
}
