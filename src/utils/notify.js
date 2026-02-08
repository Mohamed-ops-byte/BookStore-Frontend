import { toast } from 'react-toastify';

export const notify = (message, type = 'info') => {
  if (type === 'success') {
    toast.success(message);
    return;
  }

  if (type === 'error') {
    toast.error(message);
    return;
  }

  toast(message);
};
