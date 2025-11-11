/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '../../src/payload.config'
import { RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'

import './custom.scss'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Lake Ride Pros Admin',
  description: 'Admin panel for Lake Ride Pros',
}

const Layout = ({ children }: Args) => RootLayout({ config, children })

export default Layout
