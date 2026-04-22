import { toast } from 'vue-sonner'

/**
 * Toast utility composable
 *
 * Provides convenient methods for showing different types of toast messages.
 * Built on top of vue-sonner.
 */
export function useToast () {
  return {
    success: (detail: string, summary?: string) =>
      toast.success(summary ?? detail, {
        description: summary ? detail : undefined,
      }),

    error: (detail: string, summary?: string) =>
      toast.error(summary ?? detail, {
        description: summary ? detail : undefined,
      }),

    warn: (detail: string, summary?: string) =>
      toast.warning(summary ?? detail, {
        description: summary ? detail : undefined,
      }),

    info: (detail: string, summary?: string) =>
      toast.info(summary ?? detail, {
        description: summary ? detail : undefined,
      }),

    // Generic method
    custom: (options: { detail?: string, summary?: string, severity?: string }) => {
      const method = options.severity === 'error'
        ? toast.error
        : options.severity === 'warn'
          ? toast.warning
          : options.severity === 'success'
            ? toast.success
            : toast.info
      method(options.summary ?? options.detail ?? '', {
        description: options.summary ? options.detail : undefined,
      })
    },

    // Close methods
    close: (toastId: string | number) => toast.dismiss(toastId),
    closeAll: () => toast.dismiss(),
  }
}
