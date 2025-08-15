import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { authApi } from '@/api/auth'
import { useAuth } from '@/stores/authStore'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  username: z
    .string()
    .min(1, 'Kode agen tidak boleh kosong')
    .min(3, 'Kode agen minimal 3 karakter'),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(6, 'Password minimal 6 karakter'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setTokens, setPasswordChangeFlag } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const response = await authApi.login(data)
      
      if (response.status === 200) {
        // Set user data
        setUser(response.data.user)
        
        // Set tokens
        setTokens(response.data.token)
        
        // Set password change flag
        setPasswordChangeFlag(response.data.needsPasswordChange)
        
        toast.success('Login berhasil!')
        
        // Redirect berdasarkan needsPasswordChange
        if (response.data.needsPasswordChange) {
          navigate({ to: '/change-password' })
        } else {
          navigate({ to: '/' })
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Kode agen atau password salah')
      } else if (error.response?.status === 429) {
        toast.error('Terlalu banyak percobaan login. Coba lagi nanti.')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Tidak dapat terhubung ke server')
      } else {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Agen</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Masukkan kode agen' 
                  autoComplete='username'
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput 
                  placeholder='Masukkan password' 
                  autoComplete='current-password'
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type='submit' 
          className='mt-2' 
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Login'}
        </Button>
      </form>
    </Form>
  )
}