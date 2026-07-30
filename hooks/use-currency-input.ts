"use client"

import { useState, useCallback } from "react"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function useCurrencyInput(initialValue = 0) {
  const [rawValue, setRawValue] = useState(initialValue)
  const [display, setDisplay] = useState(formatCurrency(initialValue))

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    if (!raw) {
      setDisplay("R$ 0,00")
      setRawValue(0)
      return
    }
    const num = parseInt(raw, 10) / 100
    setDisplay(formatCurrency(num))
    setRawValue(num)
  }, [])

  const setValue = useCallback((n: number) => {
    setRawValue(n)
    setDisplay(formatCurrency(n))
  }, [])

  return { display, rawValue, onChange, setValue }
}
