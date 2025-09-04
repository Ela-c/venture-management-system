import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    create: anyone,
    read: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  admin: {
    defaultColumns: ['email', 'name', 'role'],
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Founder', value: 'founder' },
        { label: 'MIV Analyst', value: 'miv_analyst' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'founder',
      required: true,
    },
  ],
}
