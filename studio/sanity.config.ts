import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const SINGLETONS = ['profile', 'about', 'skillsSection', 'education'] as const

const isLocalStudio =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
const PREVIEW_ORIGIN = isLocalStudio
  ? 'http://localhost:8080'
  : 'https://portfolio-bay-eta-88.vercel.app'

export default defineConfig({
  name: 'default',
  title: 'sanity-studio-jean',

  projectId: 'yh6ixjbc',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Profil (Hero)')
              .id('profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.listItem()
              .title('À propos')
              .id('about')
              .child(S.document().schemaType('about').documentId('about')),
            S.listItem()
              .title('Compétences')
              .id('skillsSection')
              .child(S.document().schemaType('skillsSection').documentId('skillsSection')),
            S.listItem()
              .title('Formation')
              .id('education')
              .child(S.document().schemaType('education').documentId('education')),
            S.divider(),
            S.documentTypeListItem('experience').title('Expériences'),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_ORIGIN,
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType as typeof SINGLETONS[number])),
  },

  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType as typeof SINGLETONS[number])
        ? input.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : input,
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((t) => !SINGLETONS.includes(t.templateId as typeof SINGLETONS[number]))
        : prev,
  },
})
