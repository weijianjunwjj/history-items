import { h, defineComponent, PropType } from 'vue'
import { Table, Pagination } from '@arco-design/web-vue'
import './index.less'

export type ColumnItemType = {
  key: string
  title: string
}

type TablePropsType = {
  columns: ColumnItemType[]
}

type PaginationType = {
  current: number
  pageSize: number
  onChange: () => void
}

export default defineComponent({
  name: 'LayoutTable',
  emits: ['change'],
  props: {
    tableTitle: {
      type: String,
      default: '',
    },
    tableProps: {
      type: Object as PropType<TablePropsType>,
      default: () => ({}),
    },
    pagination: {
      type: [Object, Boolean] as PropType<PaginationType>,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onRefresh: {
      type: Function as PropType<((payload: MouseEvent) => void) | undefined>,
      default: () => {}, // eslint-disable-line
    },
  },
  data() {
    const columns = this.tableProps.columns || []
    return {
      columns,
      size: 'middle',
    }
  },
  render() {
    const {
      search = () => {}, // eslint-disable-line
      buttons = () => {}, // eslint-disable-line
      extraIcons = () => {}, // eslint-disable-line
      ...restSlots
    } = this.$slots
    console.log('this.$slots :>> ', this.$slots)
    console.log('restSlots :>> ', restSlots)
    const tableProps = {
      ...this.tableProps,
      columns: this.columns,
      size: this.size,
      pagination: false,
    }
    console.log('tableProps :>> ', tableProps)
    const columns = this.tableProps.columns || []

    const p = this.pagination || {}
    const { current, pageSize, onChange, ...restP } = p
    const paginationProps = {
      ...{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`,
        hideOnSinglePage: false,
        defaultPageSize: p.pageSize || 10,
        current,
        pageSize,
        onChange,
        onShowSizeChange: onChange,
      },
      ...restP,
    }

    return (
      <div ref="wrapper" class="wrapper">
        <a-spin spinning={this.loading}>
          <div class="layout-table">
            {this.$slots.search && (
              <div class="layout-table__header">{search()}</div>
            )}
            <div class="layout-table__toolbar">
              <div class="toolbar-left">{this.tableTitle}</div>
              <div class="toolbar-right">
                <div class="toolbar-right__buttons">{buttons()}</div>
                {this.$slots.buttons ? <a-divider type="vertical" /> : null}
                <div class="toolbar-right__icons">
                  <a-tooltip title="刷新" placement="bottom">
                    <icon-sync onClick={this.onRefresh} />
                  </a-tooltip>
                  {extraIcons()}
                </div>
              </div>
            </div>
            {h(
              // eslint-disable-next-line
              Table as any,
              tableProps,
              restSlots
            )}
            <div class="layout-table__pagination">
              {h(Pagination, paginationProps)}
            </div>
          </div>
        </a-spin>
      </div>
    )
  },
})
