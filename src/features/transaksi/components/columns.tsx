import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Transaksi, getStatusDisplay } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { format } from 'date-fns'

// Helper function untuk format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Helper function untuk format date
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  } catch {
    return dateString
  }
}

export const columns: ColumnDef<Transaksi>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'tgl_entri',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Entri' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px] text-xs'>
        {formatDate(row.getValue('tgl_entri'))}
      </div>
    ),
  },
  {
    accessorKey: 'tgl_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Status' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px] text-xs'>
        {formatDate(row.getValue('tgl_status'))}
      </div>
    ),
  },
  {
    accessorKey: 'kode_reseller',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Agen' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] font-medium'>
        {row.getValue('kode_reseller')}
      </div>
    ),
  },
  {
    accessorKey: 'nama_reseller',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Agen' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate'>
        {row.getValue('nama_reseller')}
      </div>
    ),
  },
  {
    accessorKey: 'kode_produk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Produk' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px] font-medium'>
        {row.getValue('kode_produk')}
      </div>
    ),
  },
  {
    accessorKey: 'tujuan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tujuan' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px] font-mono text-sm'>
        {row.getValue('tujuan')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as number
      const statusString = row.original.status_string
      const statusDisplay = getStatusDisplay(status, statusString)

      return (
        <div className='w-[100px]'>
          <Badge variant={statusDisplay.variant}>
            {statusDisplay.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const status = row.getValue(id) as number
      return value.includes(status.toString())
    },
  },
  {
    accessorKey: 'sn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Serial Number' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate font-mono text-xs'>
        {row.getValue('sn')}
      </div>
    ),
  },
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Keterangan' />
    ),
    cell: ({ row }) => {
      const keterangan = row.getValue('keterangan') as string | null
      return (
        <div className='max-w-[150px] truncate text-xs'>
          {keterangan || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'harga',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Harga' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px] text-right font-medium'>
        {formatCurrency(row.getValue('harga'))}
      </div>
    ),
  },
  {
    accessorKey: 'saldo_awal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Saldo Awal' />
    ),
    cell: ({ row }) => {
      const saldo = row.getValue('saldo_awal') as number
      return (
        <div className={`w-[120px] text-right font-medium ${saldo < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatCurrency(saldo)}
        </div>
      )
    },
  },
]