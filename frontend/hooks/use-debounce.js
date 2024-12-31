// hooks/useDebounce.js
'use client'

import { useEffect, useState } from 'react'

// This hook is used while searching in a field. It delays the search until the user stops typing.

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}