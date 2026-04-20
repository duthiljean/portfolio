import {defineField, defineType} from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Formation',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre de la section', type: 'localeString'}),
    defineField({name: 'dateline', title: 'Dateline', type: 'localeString'}),
    defineField({
      name: 'degree',
      title: 'Diplôme',
      type: 'object',
      fields: [
        {name: 'kicker', title: 'Kicker', type: 'localeString'},
        {name: 'schoolName', title: 'École', type: 'string'},
        {name: 'schoolLogo', title: 'Logo école', type: 'image', options: {hotspot: true}},
        {name: 'name', title: 'Intitulé du diplôme', type: 'localeString'},
        {name: 'datesLabel', title: 'Label dates (ex. "2023 — 2026")', type: 'string'},
        {name: 'durationLabel', title: 'Label durée', type: 'localeString'},
        {name: 'location', title: 'Localisation', type: 'string'},
        {name: 'bdeLabel', title: 'Label BDE / extra', type: 'localeString'},
        {
          name: 'startDate',
          title: 'Date de début (pour la barre de progression)',
          type: 'date',
        },
        {
          name: 'endDate',
          title: 'Date de fin (pour la barre de progression)',
          type: 'date',
        },
      ],
    }),
    defineField({name: 'certsLabel', title: 'Label "Certifications"', type: 'localeString'}),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'kind',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Anthropic (sous-certifs cliquables)', value: 'anthropic'},
                  {title: 'MOOC (avec image de certif)', value: 'mooc'},
                  {title: 'Simple', value: 'simple'},
                ],
              },
              initialValue: 'simple',
            },
            {name: 'name', title: 'Nom', type: 'string'},
            {name: 'org', title: 'Organisation / dateline', type: 'localeString'},
            {name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}},
            {name: 'verified', title: 'Vérifié (afficher BadgeCheck)', type: 'boolean', initialValue: false},
            {
              name: 'subCerts',
              title: 'Sous-certifications (type Anthropic)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'title', title: 'Titre', type: 'string'},
                    {name: 'url', title: 'Lien de vérification', type: 'url'},
                  ],
                  preview: {select: {title: 'title', subtitle: 'url'}},
                },
              ],
              hidden: ({parent}) => parent?.kind !== 'anthropic',
            },
            {
              name: 'certImage',
              title: 'Image du certificat (type MOOC)',
              type: 'image',
              options: {hotspot: true},
              hidden: ({parent}) => parent?.kind !== 'mooc',
            },
            {name: 'order', title: 'Ordre', type: 'number', initialValue: 100},
          ],
          preview: {
            select: {title: 'name', subtitle: 'org.fr', media: 'logo'},
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Formation'}
    },
  },
})
