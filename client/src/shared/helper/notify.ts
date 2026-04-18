import { toast } from 'react-toastify'

type ToastTypes = 'success' | 'error' | 'warn' | 'info'

export const notify = (message: string, type: ToastTypes = 'info') => {
  const iconMap: Record<ToastTypes, string> = {
    success: '✓',
    error: '✕',
    warn: '!',
    info: 'i',
  }

  toast[type](message, {
    autoClose: 3000,
    icon: iconMap[type],
    className: `app-toast app-toast--${type}`,
    bodyClassName: 'app-toast__body',
    progressClassName: 'app-toast__progress',
  })
}
