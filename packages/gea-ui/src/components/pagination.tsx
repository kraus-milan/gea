import * as pagination from '@zag-js/pagination'
import { normalizeProps } from '@zag-js/vanilla'
import ZagComponent from '../primitives/zag-component'
import { cn } from '../utils/cn'
import type { InferSchema, Props, Service, SpreadMap } from '../primitives/zag-types'
import type { ClassProp } from './types'

export interface PaginationProps {
  /** CSS class(es) applied to the root element. */
  class?: ClassProp
  /** Total number of items to paginate. */
  count?: number
  /** Controlled current page (1-based). */
  page?: number
  /** Initial page (uncontrolled).
   * @default 1 */
  defaultPage?: number
  /** Controlled number of items per page. */
  pageSize?: number
  /** Initial number of items per page (uncontrolled).
   * @default 10 */
  defaultPageSize?: number
  /** Number of page buttons shown on each side of the current page.
   * @default 1 */
  siblingCount?: number
  /** Renders page items as buttons or anchor links.
   * @default "button" */
  type?: PaginationType
  /** Called when the current page changes. */
  onPageChange?: (details: PaginationPageChangeDetails) => void
  /** Called when the page size changes. */
  onPageSizeChange?: (details: PaginationPageSizeChangeDetails) => void
}

type ZE = {
  Schema: InferSchema<pagination.Machine>
  Api: pagination.Api
}

export default class Pagination extends ZagComponent<PaginationProps, ZE> {
  page = 1
  totalPages = 1

  override createMachine() {
    return pagination.machine
  }

  override getMachineProps(props: PaginationProps): Props<ZE> {
    return {
      id: this.id,
      count: props.count ?? 0,
      page: props.page,
      defaultPage: props.defaultPage ?? 1,
      pageSize: props.pageSize,
      defaultPageSize: props.defaultPageSize ?? 10,
      siblingCount: props.siblingCount ?? 1,
      type: props.type ?? 'button',
      onPageChange: (details) => {
        this.page = details.page
        props.onPageChange?.(details)
      },
      onPageSizeChange: props.onPageSizeChange,
    }
  }

  override connectApi(service: Service<ZE>) {
    return pagination.connect(service, normalizeProps)
  }

  override getSpreadMap(): SpreadMap<ZE> {
    return {
      '[data-part="root"]': 'getRootProps',
      '[data-part="prev-trigger"]': 'getPrevTriggerProps',
      '[data-part="next-trigger"]': 'getNextTriggerProps',
      '[data-part="item"]': (api, el) => {
        const value = parseInt(el.dataset.value || '1', 10)
        return api.getItemProps({ type: 'page', value })
      },
      '[data-part="ellipsis"]': (api, el) => {
        const index = parseInt(el.dataset.index || '0', 10)
        return api.getEllipsisProps({ index })
      },
    }
  }

  override syncState(api: ZE['Api']) {
    this.page = api.page
    this.totalPages = api.totalPages
  }

  template(props: PaginationProps) {
    return (
      <nav data-part="root" class={cn('pagination-root', props.class)}>
        <div class="flex items-center gap-1">
          <button
            data-part="prev-trigger"
            class="pagination-prev inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent disabled:opacity-50"
          >
            &lsaquo; Prev
          </button>
          <button
            data-part="next-trigger"
            class="pagination-next inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent disabled:opacity-50"
          >
            Next &rsaquo;
          </button>
        </div>
      </nav>
    )
  }
}
