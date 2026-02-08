import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './env'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'lake-ride-pros',
  title: 'Lake Ride Pros CMS',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],

  schema: {
    types: schemaTypes,
  },
})
