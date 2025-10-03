import { useEffect, useState } from "react";

// Reusable debounce hook: returns a debounced version of the input value
// Usage: const debounced = useDebouncedValue(value, 300)
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
