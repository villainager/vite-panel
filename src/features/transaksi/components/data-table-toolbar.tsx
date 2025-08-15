import { useState } from 'react'
import { format } from 'date-fns'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Search,
  CalendarIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '../../tasks/components/data-table-view-options'
import { Transaksi } from '../data/schema'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

interface DataTableToolbarProps {
  table: Table<Transaksi>
  onSearch: (filters: {
    nomor_tujuan?: string
    tgl_awal?: string
    tgl_akhir?: string
    limit?: number
  }) => void
  isLoading?: boolean
}

// Status options untuk faceted filter
const statusOptions = [
  { label: 'Sukses', value: '20' },
  { label: 'Pending', value: '50' },
  { label: 'Gagal', value: '99' },
]

// Helper functions untuk export
const exportToCSV = (data: Transaksi[], filename: string = 'transaksi.csv') => {
  const headers = [
    'Tanggal Entri',
    'Tanggal Status',
    'Kode Agen',
    'Nama Agen',
    'Produk',
    'Tujuan',
    'Status',
    'Serial Number',
    'Keterangan',
    'Harga',
    'Saldo Awal',
  ]

  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      [
        `"${new Date(row.tgl_entri).toLocaleString('id-ID')}"`,
        `"${new Date(row.tgl_status).toLocaleString('id-ID')}"`,
        `"${row.kode_reseller}"`,
        `"${row.nama_reseller}"`,
        `"${row.kode_produk}"`,
        `"${row.tujuan}"`,
        `"${row.status_string}"`,
        `"${row.sn}"`,
        `"${row.keterangan || '-'}"`,
        `${row.harga}`,
        `${row.saldo_awal}`,
      ].join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToExcel = (data: Transaksi[]) => {
  // Simple Excel export using HTML table format
  const headers = [
    'Tanggal Entri',
    'Tanggal Status',
    'Kode Agen',
    'Nama Agen',
    'Produk',
    'Tujuan',
    'Status',
    'Serial Number',
    'Keterangan',
    'Harga',
    'Saldo Awal',
  ]

  const htmlContent = `
    <table>
      <thead>
        <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            <td>${new Date(row.tgl_entri).toLocaleString('id-ID')}</td>
            <td>${new Date(row.tgl_status).toLocaleString('id-ID')}</td>
            <td>${row.kode_reseller}</td>
            <td>${row.nama_reseller}</td>
            <td>${row.kode_produk}</td>
            <td>${row.tujuan}</td>
            <td>${row.status_string}</td>
            <td>${row.sn}</td>
            <td>${row.keterangan || '-'}</td>
            <td>${row.harga}</td>
            <td>${row.saldo_awal}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `

  const blob = new Blob([htmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'transaksi.xls')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const printPDF = (data: Transaksi[]) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Data Transaksi</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { text-align: center; margin-bottom: 20px; }
        .date { font-size: 10px; color: #666; }
        @media print {
          body { margin: 0; }
          table { font-size: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Data Transaksi</h2>
        <div class="date">Dicetak pada: ${new Date().toLocaleString('id-ID')}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tanggal Entri</th>
            <th>Tanggal Status</th>
            <th>Kode Agen</th>
            <th>Nama Agen</th>
            <th>Produk</th>
            <th>Tujuan</th>
            <th>Status</th>
            <th>Serial Number</th>
            <th>Keterangan</th>
            <th>Harga</th>
            <th>Saldo Awal</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              <td>${new Date(row.tgl_entri).toLocaleString('id-ID')}</td>
              <td>${new Date(row.tgl_status).toLocaleString('id-ID')}</td>
              <td>${row.kode_reseller}</td>
              <td>${row.nama_reseller}</td>
              <td>${row.kode_produk}</td>
              <td>${row.tujuan}</td>
              <td>${row.status_string}</td>
              <td style="font-size: 9px;">${row.sn}</td>
              <td>${row.keterangan || '-'}</td>
              <td style="text-align: right;">${row.harga.toLocaleString('id-ID')}</td>
              <td style="text-align: right;">${row.saldo_awal.toLocaleString('id-ID')}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export function DataTableToolbar({
  table,
  onSearch,
  isLoading,
}: DataTableToolbarProps) {
  const [filters, setFilters] = useState({
    nomor_tujuan: '',
    tgl_awal: '',
    tgl_akhir: '',
    limit: 1000,
  })

  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const allFilteredRows = table.getFilteredRowModel().rows

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({
      nomor_tujuan: '',
      tgl_awal: '',
      tgl_akhir: '',
      limit: 1000,
    })
    table.resetColumnFilters()
  }

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : allFilteredRows.map((row) => row.original)

    if (dataToExport.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    switch (type) {
      case 'csv':
        exportToCSV(dataToExport)
        break
      case 'excel':
        exportToExcel(dataToExport)
        break
      case 'pdf':
        printPDF(dataToExport)
        break
    }
  }

  return (
    <div className='space-y-4'>
      {/* Filter API Section */}
      <div className='rounded-lg border p-4'>
        <div className='mb-4 flex items-center space-x-2'>
          <Search className='h-4 w-4' />
          <h3 className='text-sm font-medium'>Filter Cek Transaksi</h3>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          {/* Nomor Tujuan */}
          <div className='space-y-2'>
            <label className='text-xs font-medium'>Nomor Tujuan</label>
            <Input
              placeholder='08123456789'
              value={filters.nomor_tujuan}
              onChange={(e) =>
                handleFilterChange('nomor_tujuan', e.target.value)
              }
              className='h-8'
              disabled={isLoading}
            />
          </div>

          {/* Tanggal Awal */}
          <div className='space-y-2'>
            <label className='text-xs font-medium'>Tanggal Awal</label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-8 w-full pl-3 text-left font-normal',
                    !filters.tgl_awal && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  {filters.tgl_awal ? (
                    format(new Date(filters.tgl_awal), 'dd/MM/yyyy')
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    filters.tgl_awal ? new Date(filters.tgl_awal) : undefined
                  }
                  onSelect={(date) => {
                    handleFilterChange(
                      'tgl_awal',
                      date ? format(date, 'yyyy-MM-dd') : ''
                    )
                    setStartDateOpen(false)
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tanggal Akhir */}
          <div className='space-y-2'>
            <label className='text-xs font-medium'>Tanggal Akhir</label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-8 w-full pl-3 text-left font-normal',
                    !filters.tgl_akhir && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  {filters.tgl_akhir ? (
                    format(new Date(filters.tgl_akhir), 'dd/MM/yyyy')
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    filters.tgl_akhir ? new Date(filters.tgl_akhir) : undefined
                  }
                  onSelect={(date) => {
                    handleFilterChange(
                      'tgl_akhir',
                      date ? format(date, 'yyyy-MM-dd') : ''
                    )
                    setEndDateOpen(false)
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Limit */}
          <div className='space-y-2'>
            <label className='text-xs font-medium'>Limit Data</label>
            <Select
              onValueChange={(value) =>
                handleFilterChange('limit', Number(value))
              }
              value={filters.limit.toString()}
              disabled={isLoading}
            >
              <SelectTrigger className='h-8'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='100'>100</SelectItem>
                <SelectItem value='500'>500</SelectItem>
                <SelectItem value='1000'>1000</SelectItem>
                <SelectItem value='2000'>2000</SelectItem>
                <SelectItem value='5000'>5000</SelectItem>
                <SelectItem value='10000'>10000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className='flex items-end space-x-2'>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              size='sm'
              className='h-8'
            >
              {isLoading ? 'Mencari...' : 'Cari'}
            </Button>
            <Button
              variant='outline'
              onClick={handleReset}
              disabled={isLoading}
              size='sm'
              className='h-8'
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table Filter Section */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Cari nomor tujuan...'
            value={
              (table.getColumn('tujuan')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('tujuan')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />

          <div className='flex gap-x-2'>
            {table.getColumn('status') && (
              <DataTableFacetedFilter
                column={table.getColumn('status')}
                title='Status'
                options={statusOptions}
              />
            )}
          </div>

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => table.resetColumnFilters()}
              className='h-8 px-2 lg:px-3'
            >
              Reset Filter
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8'>
                <Download className='mr-2 h-4 w-4' />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <File className='mr-2 h-4 w-4' />
                Export ke CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className='mr-2 h-4 w-4' />
                Export ke Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className='mr-2 h-4 w-4' />
                Print PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}
