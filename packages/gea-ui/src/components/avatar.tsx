import * as avatar from '@zag-js/avatar'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'

export interface AvatarProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Full name; initials are derived and shown when no image is available. */
  name?: string
  /** Explicit fallback text shown when the image fails to load. */
  fallback?: string
  /** Image URL to display. */
  src?: string
  /** Called when the image load status changes. */
  onStatusChange?: (details: avatar.StatusChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<avatar.Machine>
  Api: avatar.Api
}

export default class Avatar extends ZagComponent<AvatarProps, ZE> {
  loaded = false

  override createMachine() {
    return avatar.machine
  }

  override getMachineProps(props: AvatarProps): Props<ZE> {
    return {
      id: this.id,
      onStatusChange: props.onStatusChange,
    }
  }

  override connectApi(service: Service<ZE>) {
    return avatar.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="image"]': 'getImageProps',
      '[data-part="fallback"]': 'getFallbackProps',
    }
  }

  override syncState(api: ZE['Api']) {
    this.loaded = api.loaded
  }

  template(props: AvatarProps) {
    const initials =
      props.fallback ||
      (props.name
        ? props.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : '?')
    return (
      <div
        data-part="root"
        class={cn('avatar-root relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full', props.class)}
      >
        {props.src ? (
          <img
            data-part="image"
            src={props.src}
            alt={props.name || ''}
            class="avatar-image absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          ''
        )}
        <div
          data-part="fallback"
          class={`avatar-fallback flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium ${props.src ? 'absolute inset-0' : ''}`}
        >
          {initials}
        </div>
      </div>
    )
  }
}
