import type { CollectionConfig } from 'payload'

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: {
    useAsTitle: 'name_en',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    { name: 'name_en', type: 'text', required: true, label: 'Venture Name (EN)' },
    { name: 'country', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'sector', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'description_en', type: 'textarea' },
    {
      name: 'founders',
      type: 'array',
      label: 'Founders',
      fields: [
        { name: 'user', type: 'relationship', relationTo: 'users', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'fullName', type: 'text', required: true },
      ],
    },
    {
      name: 'triageTrack',
      type: 'select',
      options: [
        { label: 'Unassigned', value: 'unassigned' },
        { label: 'Fast', value: 'fast' },
        { label: 'Slow', value: 'slow' },
      ],
      defaultValue: 'unassigned',
    },
    { name: 'triageRationale', type: 'textarea' },
  ],
}
