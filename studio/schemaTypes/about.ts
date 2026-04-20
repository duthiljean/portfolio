import {defineField, defineType} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'À propos',
  type: 'document',
  fields: [
    defineField({name: 'kicker', title: 'Kicker', type: 'localeString'}),
    defineField({name: 'dateline', title: 'Dateline', type: 'localeString'}),
    defineField({
      name: 'headlines',
      title: 'Titres (lignes)',
      type: 'array',
      of: [{type: 'localeString'}],
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({name: 'bio', title: 'Bio (courte)', type: 'localeText'}),
    defineField({name: 'description', title: 'Description (longue)', type: 'localeText'}),
    defineField({name: 'location', title: 'Localisation', type: 'localeString'}),
    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'rhythm', title: 'Rythme', type: 'localeString'}),
    defineField({name: 'languages', title: 'Langues', type: 'localeString'}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Valeur', type: 'string', description: 'Ex. "400+", "30"'},
            {name: 'label', title: 'Libellé', type: 'localeString'},
            {name: 'trend', title: 'Tendance (optionnelle)', type: 'localeString'},
          ],
          preview: {
            select: {title: 'value', subtitle: 'label.fr'},
          },
        },
      ],
    }),
    defineField({name: 'nowLabel', title: 'Label "En ce moment"', type: 'localeString'}),
    defineField({
      name: 'nowItems',
      title: 'Items "En ce moment"',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Titre', type: 'string'},
            {name: 'description', title: 'Description', type: 'localeString'},
            {name: 'href', title: 'Lien (optionnel)', type: 'string'},
          ],
          preview: {select: {title: 'title', subtitle: 'description.fr'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'À propos'}
    },
  },
})
