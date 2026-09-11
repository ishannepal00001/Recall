import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { FinancialItem } from '../../hooks/useFinancials'

const columnHelper = createColumnHelper<FinancialItem>()

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => {
      const v = info.getValue()
      return (
        <span className={`text-xs px-2 py-1 rounded-full capitalize border ${v === 'income' ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-red-500/15 text-red-400 border-red-500/20'}`}>
          {v}
        </span>
      )
    },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => <span className="text-white/70 capitalize">{info.getValue().replace('_', ' ')}</span>,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => {
      const row = info.row.original
      const isIncome = row.type === 'income'
      return <span className={`font-semibold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>{isIncome ? '+' : '-'}${info.getValue().toLocaleString()}</span>
    },
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => <span className="text-white/50 text-sm truncate max-w-[180px] inline-block">{info.getValue() ?? '-'}</span>,
  }),
]

export function FinancialTable({ data }: { data: FinancialItem[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (data.length === 0) {
    return <div className="text-center text-white/40 py-12 border border-white/10 rounded-lg">No recent transactions</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-white/10 bg-white/[0.04]">
              {hg.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.03]">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
