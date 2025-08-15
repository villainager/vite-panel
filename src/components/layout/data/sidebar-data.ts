import {
  IconLayoutDashboard,
  IconCreditCard,
  IconReceipt,
  IconExchange,
  IconUsers,
  IconPrinter,
  IconInfoCircle,
  IconCode,
  IconFileInvoice,
  IconClipboardList,
  IconSum,
  IconBankTransfer,
  IconCoinYuan,
  IconWallet,
  IconUserCircle,
  IconTrendingUp,
  IconFileText,
  IconSpeakerphone,
  IconBook,
  IconDots
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@timsakti.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'Tim Sakti',
      logo: Command,
      plan: 'Dashboard Monitoring',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Transaksi',
      items: [
        {
          title: 'Transaksi',
          icon: IconCreditCard,
          items: [
            {
              title: 'Cek Transaksi',
              url: '/transaksi/cek',
            },
            {
              title: 'List Transaksi',
              url: '/transaksi/list',
            },
            {
              title: 'Total Transaksi',
              url: '/transaksi/total',
            },
            {
              title: 'Invoice',
              url: '/transaksi/invoice',
            },
          ],
        },
      ],
    },
    {
      title: 'Mutasi',
      items: [
        {
          title: 'Mutasi',
          icon: IconExchange,
          items: [
            {
              title: 'Mutasi Transaksi',
              url: '/mutasi/transaksi',
            },
            {
              title: 'Mutasi Deposit',
              url: '/mutasi/deposit',
            },
            {
              title: 'Mutasi Saldo',
              url: '/mutasi/saldo',
            },
          ],
        },
      ],
    },
    {
      title: 'Downline',
      items: [
        {
          title: 'Downline',
          icon: IconUsers,
          items: [
            {
              title: 'List Downline',
              url: '/downline/list',
            },
            {
              title: 'Cek Transaksi Downline',
              url: '/downline/cek-transaksi',
            },
            {
              title: 'List Transaksi Downline',
              url: '/downline/list-transaksi',
            },
            {
              title: 'Total Transaksi Downline',
              url: '/downline/total-transaksi',
            },
            {
              title: 'Rekap Komisi',
              url: '/downline/rekap-komisi',
            },
          ],
        },
      ],
    },
    {
      title: 'Cetak Struk',
      items: [
        {
          title: 'Cetak Struk',
          url: '/cetak-struk',
          icon: IconPrinter,
        },
      ],
    },
    {
      title: 'Informasi',
      items: [
        {
          title: 'Informasi',
          icon: IconInfoCircle,
          items: [
            {
              title: 'Daftar Harga',
              url: '/informasi/daftar-harga',
            },
            {
              title: 'Pengumuman',
              url: '/informasi/pengumuman',
            },
          ],
        },
      ],
    },
    {
      title: 'Docs API',
      items: [
        {
          title: 'Docs API',
          icon: IconCode,
          items: [
            {
              title: 'Docs API',
              url: '/docs-api/documentation',
            },
            {
              title: 'Lainnya',
              url: '/docs-api/lainnya',
            },
          ],
        },
      ],
    },
  ],
}