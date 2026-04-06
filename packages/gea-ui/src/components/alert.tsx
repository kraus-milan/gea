import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export type AlertVariant = 'default' | 'destructive'

export interface AlertProps {
  /** Visual style of the alert.
   * @default "default" */
  variant?: AlertVariant
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the alert. */
  children: JSXNode
}

export interface AlertTitleProps {
  /** CSS class(es) applied to the title element. */
  class?: ClassProp
  /** Title text or content. */
  children: JSXNode
}

export interface AlertDescriptionProps {
  /** CSS class(es) applied to the description element. */
  class?: ClassProp
  /** Description text or content. */
  children: JSXNode
}

const variants: Record<AlertVariant, string> = {
  default: 'bg-background text-foreground',
  destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
}

export class Alert extends Component<AlertProps> {
  template(props: AlertProps) {
    const variant = variants[props.variant || 'default'] || variants.default

    return (
      <div
        class={cn(
          'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
          variant,
          props.class,
        )}
        role="alert"
      >
        {props.children}
      </div>
    )
  }
}

export class AlertTitle extends Component<AlertTitleProps> {
  template(props: AlertTitleProps) {
    return <h5 class={cn('mb-1 font-medium leading-none tracking-tight', props.class)}>{props.children}</h5>
  }
}

export class AlertDescription extends Component<AlertDescriptionProps> {
  template(props: AlertDescriptionProps) {
    return <div class={cn('text-sm [&_p]:leading-relaxed', props.class)}>{props.children}</div>
  }
}
