import { z } from 'zod'

// Transaksi schema
export const transaksiSchema = z.object({
  tgl_entri: z.string(),
  tgl_status: z.string(),
  kode_reseller: z.string(),
  nama_reseller: z.string(),
  kode_produk: z.string(),
  tujuan: z.string(),
  status: z.number(),
  status_string: z.string(),
  sn: z.string(),
  keterangan: z.string().nullable(),
  harga: z.number(),
  saldo_awal: z.number(),
})

export type Transaksi = z.infer<typeof transaksiSchema>

// Filter form schema
export const cekTransaksiFilterSchema = z.object({
  nomor_tujuan: z.string().optional(),
  tgl_awal: z.string().optional(),
  tgl_akhir: z.string().optional(),
  limit: z.number().min(1).max(10000).default(1000),
})

export type CekTransaksiFilter = z.infer<typeof cekTransaksiFilterSchema>

// Status mappings untuk display
export const statusMappings = {
  20: { label: 'Sukses', variant: 'success' as const },
  50: { label: 'Pending', variant: 'warning' as const },
  99: { label: 'Gagal', variant: 'destructive' as const },
} as const

// Helper function untuk format status
export const getStatusDisplay = (status: number, statusString: string) => {
  const mapping = statusMappings[status as keyof typeof statusMappings]
  return mapping || { label: statusString, variant: 'secondary' as const }
}