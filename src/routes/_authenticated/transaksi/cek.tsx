import { createFileRoute } from '@tanstack/react-router'
import CekTransaksi from '@/features/transaksi/cek'

export const Route = createFileRoute('/_authenticated/transaksi/cek')({
  component: CekTransaksi,
})
