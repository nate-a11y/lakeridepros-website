'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface ChargebeePricingTableProps {
  site: string
  pricingTableId: string
  defaultHeight?: string
}

export function ChargebeePricingTable({
  site,
  pricingTableId,
  defaultHeight = '556px',
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
        data-cb-site={site}
        data-pricing-table-id={pricingTableId}
        style={{ minHeight: defaultHeight }}
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
