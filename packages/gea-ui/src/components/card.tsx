import { Component } from '@geajs/core'
import { cn } from '../utils/cn'
import type { JSXNode } from '../types'
import type { ClassProp } from './types'

export interface CardProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Content rendered inside the card. */
  children: JSXNode
}

export interface CardHeaderProps {
  /** CSS class(es) applied to the header element. */
  class?: ClassProp
  /** Content rendered inside the card header. */
  children: JSXNode
}

export interface CardTitleProps {
  /** CSS class(es) applied to the title element. */
  class?: ClassProp
  /** Content rendered inside the card title. */
  children: JSXNode
}

export interface CardDescriptionProps {
  /** CSS class(es) applied to the description element. */
  class?: ClassProp
  /** Content rendered inside the card description. */
  children: JSXNode
}

export interface CardContentProps {
  /** CSS class(es) applied to the content element. */
  class?: ClassProp
  /** Content rendered inside the card body. */
  children: JSXNode
}

export interface CardFooterProps {
  /** CSS class(es) applied to the footer element. */
  class?: ClassProp
  /** Content rendered inside the card footer. */
  children: JSXNode
}

export class Card extends Component<CardProps> {
  template(props: CardProps) {
    return <div class={cn('rounded-xl border bg-card text-card-foreground shadow', props.class)}>{props.children}</div>
  }
}

export class CardHeader extends Component<CardHeaderProps> {
  template(props: CardHeaderProps) {
    return <div class={cn('flex flex-col space-y-1.5 p-6', props.class)}>{props.children}</div>
  }
}

export class CardTitle extends Component<CardTitleProps> {
  template(props: CardTitleProps) {
    return <h3 class={cn('font-semibold leading-none tracking-tight', props.class)}>{props.children}</h3>
  }
}

export class CardDescription extends Component<CardDescriptionProps> {
  template(props: CardDescriptionProps) {
    return <p class={cn('text-sm text-muted-foreground', props.class)}>{props.children}</p>
  }
}

export class CardContent extends Component<CardContentProps> {
  template(props: CardContentProps) {
    return <div class={cn('p-6 pt-0', props.class)}>{props.children}</div>
  }
}

export class CardFooter extends Component<CardFooterProps> {
  template(props: CardFooterProps) {
    return <div class={cn('flex items-center p-6 pt-0', props.class)}>{props.children}</div>
  }
}
