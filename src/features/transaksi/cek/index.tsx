import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { transaksiApi } from '@/api/transaksi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from '../components/columns'
import { DataTable } from '../components/data-table'
import { Transaksi } from '../data/schema'

export default function CekTransaksi() {
  const [data, setData] = useState<Transaksi[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (filters: {
    nomor_tujuan?: string
    tgl_awal?: string
    tgl_akhir?: string
    limit?: number
  }) => {
    // Validasi input
    if (!filters.nomor_tujuan && !filters.tgl_awal && !filters.tgl_akhir) {
      toast.error('Minimal isi nomor tujuan atau range tanggal')
      return
    }

    if (
      (filters.tgl_awal && !filters.tgl_akhir) ||
      (!filters.tgl_awal && filters.tgl_akhir)
    ) {
      toast.error('Tanggal awal dan tanggal akhir harus diisi keduanya')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await transaksiApi.cekTransaksi({
        nomor_tujuan: filters.nomor_tujuan || undefined,
        tgl_awal: filters.tgl_awal || undefined,
        tgl_akhir: filters.tgl_akhir || undefined,
        limit: filters.limit || 1000,
        order: 'desc', // default order terbaru
      })

      if (response.status === 200) {
        setData(response.data.data)
        toast.success(
          `Berhasil menemukan ${response.data.data.length} transaksi`
        )
      } else {
        toast.error(response.message || 'Gagal mengambil data transaksi')
        setData([])
      }
    } catch (error: any) {
      console.error('Error fetching transaksi:', error)

      if (error.response?.status === 401) {
        toast.error('Session expired. Silakan login kembali.')
      } else if (error.response?.status === 404) {
        toast.info('Tidak ada transaksi ditemukan dengan kriteria tersebut')
        setData([])
      } else if (error.response?.status === 429) {
        toast.error('Terlalu banyak permintaan. Coba lagi nanti.')
      } else {
        toast.error(
          error.response?.data?.message ||
            'Terjadi kesalahan saat mengambil data'
        )
        setData([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='space-y-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Cek Transaksi</h2>
            <p className='text-muted-foreground'>
              Cari dan pantau transaksi berdasarkan nomor tujuan dan periode
              tanggal
            </p>
          </div>

          {/* Data Table with Integrated Filter */}
          <DataTable
            columns={columns}
            data={data}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
      </Main>
    </>
  )
}
