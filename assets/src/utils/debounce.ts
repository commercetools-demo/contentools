export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    // Create a snapshot of the arguments at the time of call
    // This prevents issues with the objects being modified or revoked later
    const safeArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          // Try to make a deep copy of the object
          return JSON.parse(JSON.stringify(arg));
        } catch (e) {
          console.warn('Could not copy argument in debounce:', e);
          return arg;
        }
      }
      return arg;
    });
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      try {
        func(...safeArgs);
      } catch (error) {
        console.error('Error in debounced function:', error);
      } finally {
        timeout = null;
      }
    }, wait);
  };
}