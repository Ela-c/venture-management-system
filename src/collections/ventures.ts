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
    { name: 'name_km', type: 'text', label: 'Venture Name (KM)' },
    { name: 'country', type: 'text', required: true },
    { name: 'description_en', type: 'textarea' },
    { name: 'description_km', type: 'textarea' },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'latestIntake', type: 'relationship', relationTo: 'onboardingIntakes' as any },
    {
      name: 'agreements',
      type: 'relationship',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'agreements' as any,
      hasMany: true,
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
