"use client"

import { useCallback, useEffect, useState } from "react"
import { DEFAULT_USER_WEIGHT_KG } from "@/constants/user-settings"
import { getStoredWeightKg, setStoredWeightKg } from "@/lib/user"

export function useUserWeight() {
  const [weightKg, setWeightKg] = useState(DEFAULT_USER_WEIGHT_KG)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setWeightKg(getStoredWeightKg())
    setHydrated(true)
  }, [])

  const updateWeight = useCallback((value: number) => {
    setWeightKg(value)
    setStoredWeightKg(value)
  }, [])

  return { weightKg, setWeightKg: updateWeight, hydrated }
}
