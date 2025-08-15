import apiClient from './auth'

// API Endpoints
const ENDPOINTS = {
  CEK_TRANSAKSI: '/panel/v1/transaksi/cek'
} as const

export interface CekTransaksiParams {
  nomor_tujuan?: string
  tgl_awal?: string
  tgl_akhir?: string
  limit?: number
  order?: 'asc' | 'desc'
  page?: number
}

export interface TransaksiData {
  tgl_entri: string
  tgl_status: string
  kode_reseller: string
  nama_reseller: string
  kode_produk: string
  tujuan: string
  status: number
  status_string: string
  sn: string
  keterangan: string | null
  harga: number
  saldo_awal: number
}

export interface CekTransaksiResponse {
  status: number
  message: string
  data: {
    data: TransaksiData[]
    pagination: any | null
  }
}

export const transaksiApi = {
  // Cek Transaksi
  cekTransaksi: async (params: CekTransaksiParams): Promise<CekTransaksiResponse> => {
    const searchParams = new URLSearchParams()
    
    if (params.nomor_tujuan) searchParams.append('nomor_tujuan', params.nomor_tujuan)
    if (params.tgl_awal) searchParams.append('tgl_awal', params.tgl_awal)
    if (params.tgl_akhir) searchParams.append('tgl_akhir', params.tgl_akhir)
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.order) searchParams.append('order', params.order)
    if (params.page) searchParams.append('page', params.page.toString())

    const queryString = searchParams.toString()
    const url = queryString ? `${ENDPOINTS.CEK_TRANSAKSI}?${queryString}` : ENDPOINTS.CEK_TRANSAKSI

    const response = await apiClient.get<CekTransaksiResponse>(url)
    return response.data
  }
}