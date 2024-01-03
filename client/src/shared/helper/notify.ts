import { toast } from 'react-toastify'

type ToastTypes = 'success' | 'error' | 'warn' | 'info'

export const notify = (message: string, type: ToastTypes = 'info') => {
  toast[type](message, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 3000,
  })
}
