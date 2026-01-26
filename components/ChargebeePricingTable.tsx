'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface ChargebeePricingTableProps {
  /** Chargebee site name (e.g., "lakeridepros") - used for Chargebee.init() */
  site: string
  /** Pricing table site ID (e.g., "01JH3A1YVSSYZYY4TNPCTMCVB7") - used for data-pricing-table-site */
  pricingTableSite: string
  /** Pricing table ID (e.g., "01JH3A1ZZA7XFPWXCVXEBH0RR4") */
  pricingTableId: string
  defaultHeight?: string
}

export function ChargebeePricingTable({
  site,
  pricingTableSite,
  pricingTableId,
  defaultHeight = '612px',
}: ChargebeePricingTableProps) {
  const initialized = useRef(false)

  const initializePricingTable = async () => {
    if (initialized.current) return
    if (typeof window === 'undefined' || !window.Chargebee) return

    try {
      const chargebee = window.Chargebee.init({ site })
      const pricingTable = await chargebee.pricingTable()
      pricingTable.init()
      initialized.current = true
    } catch (error) {
      console.error('Failed to initialize Chargebee pricing table:', error)
    }
  }

  useEffect(() => {
    // If script is already loaded, initialize immediately
    if (window.Chargebee) {
      initializePricingTable()
    }
  }, [])

  return (
    <>
      <div
        id="chargebee-pricing-table"
        data-pricing-table-site={pricingTableSite}
        data-pricing-table-id={pricingTableId}
        data-pricing-table-viewport-default-height={defaultHeight}
      />
      <Script
        src="https://js.chargebee.com/v2/chargebee.js"
        strategy="lazyOnload"
        onLoad={initializePricingTable}
      />
    </>
  )
}

declare global {
  interface Window {
    Chargebee: {
      init: (config: { site: string; businessEntityId?: string }) => {
        pricingTable: () => Promise<{
          init: () => void
          open: () => void
          setVisitor: (visitor: Record<string, unknown>) => void
        }>
      }
    }
  }
}
