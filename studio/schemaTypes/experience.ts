import {defineType, defineField} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Expérience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Intitulé du poste',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Entreprise',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Stage', value: 'Stage'},
          {title: 'CDD', value: 'CDD'},
          {title: 'CDI', value: 'CDI'},
          {title: 'Alternance', value: 'Alternance'},
          {title: 'Projet entrepreneurial', value: 'Projet entrepreneurial'},
          {title: 'Indépendant', value: 'Indépendant'},
          {title: 'Associatif', value: 'Associatif'},
          {title: 'Freelance', value: 'Freelance'},
        ],
      },
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'Format libre, ex. « Mars 2026 — Présent »',
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      description: 'Utilise des retours à la ligne pour les puces. Les lignes qui commencent par → seront stylées comme des bullets.',
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Libellé', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'link', title: 'Lien (optionnel)', type: 'string'},
          ],
          preview: {
            select: {title: 'label', subtitle: 'link'},
          },
        },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site web',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Image illustrative (optionnelle)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Plus petit = affiché en premier',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Ordre d\'affichage',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
      media: 'logo',
    },
  },
})
