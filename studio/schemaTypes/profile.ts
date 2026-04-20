import {defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Profil (Hero)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom complet',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'badge',
      title: 'Badge (au dessus du nom)',
      type: 'localeString',
      description: 'Ex. "Recherche alternance — Septembre 2026"',
    }),
    defineField({
      name: 'dateline',
      title: 'Dateline',
      type: 'localeString',
      description: 'Ex. "Marseille · Bordeaux · Bruxelles · \u201926"',
    }),
    defineField({
      name: 'roles',
      title: 'Rôles (carousel)',
      type: 'array',
      of: [{type: 'localeString'}],
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'CTA principal',
      type: 'object',
      fields: [
        {name: 'label', title: 'Libellé', type: 'localeString'},
        {name: 'href', title: 'Lien (URL ou ancre)', type: 'string'},
      ],
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'CTA secondaire',
      type: 'object',
      fields: [
        {name: 'label', title: 'Libellé', type: 'localeString'},
        {name: 'href', title: 'Lien (URL ou ancre)', type: 'string'},
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Réseaux sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: [
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'GitHub', value: 'github'},
                  {title: 'X / Twitter', value: 'x'},
                  {title: 'Email', value: 'email'},
                  {title: 'Téléphone', value: 'phone'},
                ],
              },
            },
            {name: 'url', title: 'URL', type: 'string'},
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'name', media: 'photo'},
    prepare({title, media}) {
      return {title: title || 'Profil', subtitle: 'Hero', media}
    },
  },
})
