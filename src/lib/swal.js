// Simple, synchronous wrappers using native dialogs/toasts.
// This restores the behavior prior to SweetAlert2 integration.

export async function toast(message, type = 'success', duration = 3000) {
  // Return false to indicate no external library handled it — the app's ToastProvider
  // will handle rendering local toasts directly.
  return Promise.resolve(false);
}

export async function confirm(title, text) {
  const ok = window.confirm((title ? title + '\n\n' : '') + (text || ''));
  return Promise.resolve({ isConfirmed: ok });
}

export async function alertBox({ title, text }) {
  window.alert((title ? title + '\n\n' : '') + (text || ''));
  return Promise.resolve();
}
