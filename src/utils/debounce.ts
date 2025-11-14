export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 400) {
  let t: number | undefined
  return (...args: Parameters<T>) => {
    window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), wait)
  }
}


