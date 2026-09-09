import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './env'
import { schemaTypes } from './schemas'
import { ANNOUNCEMENT_ID } from '../lib/announcements/announcement'

export default defineConfig({
  name: 'lake-ride-pros',
  title: 'Lake Ride Pros CMS',

  projectId,
  dataset,
  basePath: '/studio',

  plugins: [structureTool({
    structure: (S) => S.list().title('Content').items([
      S.listItem().id(ANNOUNCEMENT_ID).title('Site announcement').child(
        S.document().schemaType('siteAnnouncement').documentId(ANNOUNCEMENT_ID),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteAnnouncement'),
    ]),
  }), visionTool({ defaultApiVersion: apiVersion })],

  document: {
    actions: (actions, context) => context.schemaType === 'siteAnnouncement'
      ? actions.filter(({ action }) => action && ['publish', 'unpublish', 'discardChanges', 'restore'].includes(action))
      : actions,
  },

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => template.schemaType !== 'siteAnnouncement'),
  },
})
