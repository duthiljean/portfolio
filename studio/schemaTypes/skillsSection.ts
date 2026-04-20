import {defineField, defineType} from 'sanity'

export const skillsSection = defineType({
  name: 'skillsSection',
  title: 'Compétences',
  type: 'document',
  fields: [
    defineField({name: 'kicker', title: 'Kicker', type: 'localeString'}),
    defineField({name: 'title', title: 'Titre principal', type: 'localeString'}),
    defineField({name: 'dateline', title: 'Dateline', type: 'localeString'}),
    defineField({name: 'subtitle', title: 'Sous-titre', type: 'localeText'}),
    defineField({name: 'legend', title: 'Légende (usage quotidien)', type: 'localeString'}),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'category',
          fields: [
            {name: 'kicker', title: 'Kicker (ex. AXE 01)', type: 'string'},
            {
              name: 'icon',
              title: 'Icône',
              type: 'string',
              options: {
                list: [
                  {title: 'Sparkles', value: 'sparkles'},
                  {title: 'Rocket', value: 'rocket'},
                  {title: 'LineChart', value: 'lineChart'},
                  {title: 'BadgeCheck', value: 'badgeCheck'},
                ],
              },
            },
            {name: 'title', title: 'Titre', type: 'localeString'},
            {name: 'description', title: 'Description', type: 'localeString'},
            {
              name: 'pills',
              title: 'Pills (compétences)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'name', title: 'Nom', type: 'string'},
                    {
                      name: 'tooltipType',
                      title: 'Type de tooltip',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Usage quotidien', value: 'daily'},
                          {title: 'Appliqué en projet', value: 'project'},
                          {title: 'Expérience opérationnelle', value: 'operational'},
                        ],
                      },
                      initialValue: 'project',
                    },
                  ],
                  preview: {select: {title: 'name', subtitle: 'tooltipType'}},
                },
              ],
            },
          ],
          preview: {
            select: {title: 'title.fr', subtitle: 'kicker'},
          },
        },
      ],
    }),
    defineField({
      name: 'dailyStack',
      title: 'Stack quotidien',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Nom', type: 'string'},
            {name: 'use', title: 'Usage', type: 'localeString'},
            {name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}},
          ],
          preview: {select: {title: 'name', subtitle: 'use.fr', media: 'logo'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Compétences'}
    },
  },
})
