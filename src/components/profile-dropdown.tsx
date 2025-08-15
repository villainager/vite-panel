import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authApi } from '@/api/auth'
import { useAuth } from '@/stores/authStore'

export function ProfileDropdown() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { user, refreshToken, logout } = useAuth()

  const handleLogout = async () => {
    if (!refreshToken) {
      logout()
      navigate({ to: '/sign-in' })
      return
    }

    setIsLoggingOut(true)
    
    try {
      await authApi.logout(refreshToken, false)
      toast.success('Logout berhasil')
    } catch (error: any) {
      console.error('Logout error:', error)
      // Tetap logout meskipun API call gagal
      toast.warning('Logout berhasil (local only)')
    } finally {
      logout()
      navigate({ to: '/sign-in' })
      setIsLoggingOut(false)
    }
  }

  // Generate initials from username
  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='' alt={user?.username || 'User'} />
            <AvatarFallback>
              {user?.username ? getInitials(user.username) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user?.username || 'Unknown User'}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              Role ID: {user?.roleId || 'N/A'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}