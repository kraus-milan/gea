import type { Machine as ZagMachine, MachineSchema, Service as ZagService } from '@zag-js/core'

export type InferSchema<T> = T extends ZagMachine<infer S> ? S : never

export interface ZagElement {
  Schema: MachineSchema
  Api: Record<string, any>
}

export type Machine<ZE extends ZagElement> = ZagMachine<ZE['Schema']>
export type Service<ZE extends ZagElement> = ZagService<ZE['Schema']>
export type Props<ZE extends ZagElement> = Partial<ZE['Schema']['props']>

export type SpreadCleanup = () => void
export type PropsGetter<ZE extends ZagElement> =
  | keyof ZE['Api']
  | ((api: ZE['Api'], el: HTMLElement) => Record<string, any>)

export interface SpreadMap<ZE extends ZagElement> {
  [selector: string]: PropsGetter<ZE>
}
