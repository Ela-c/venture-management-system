import type { CollectionConfig } from 'payload'
import { afterIntakeCreate, setDisabilityFlag } from '@/hooks/intakes'

const wssOptions: { label: string; value: string }[] = [
  { label: 'No difficulty', value: 'no_difficulty' },
  { label: 'Some difficulty', value: 'some_difficulty' },
  { label: 'A lot of difficulty', value: 'a_lot_of_difficulty' },
  { label: 'Cannot do at all', value: 'cannot_do_at_all' },
] as const

const triageOptions: { label: string; value: string }[] = [
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'Fast', value: 'fast' },
  { label: 'Slow', value: 'slow' },
] as const

export const OnboardingIntakes: CollectionConfig = {
  slug: 'onboardingIntakes',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role !== 'founder'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  versions: { drafts: false },
  hooks: {
    beforeChange: [setDisabilityFlag],
    afterChange: [afterIntakeCreate],
  },
  fields: [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    { name: 'ventureName_en', type: 'text', required: true },
    { name: 'ventureName_km', type: 'text' },
    { name: 'country', type: 'text', required: true },
    {
      name: 'wss',
      type: 'group',
      fields: [
        { name: 'seeing', type: 'select', required: true, options: wssOptions },
        { name: 'hearing', type: 'select', required: true, options: wssOptions },
        { name: 'walking', type: 'select', required: true, options: wssOptions },
        { name: 'cognition', type: 'select', required: true, options: wssOptions },
        { name: 'selfCare', type: 'select', required: true, options: wssOptions },
        { name: 'communication', type: 'select', required: true, options: wssOptions },
      ],
    },
    { name: 'disabilityFlag', type: 'checkbox', defaultValue: false },
    {
      name: 'registration',
      type: 'group',
      fields: [
        { name: 'number', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'legalType', type: 'text' },
        { name: 'yearEstablished', type: 'number', min: 1900, max: 2100 },
      ],
    },
    {
      name: 'impactAreas',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Agriculture', value: 'agri' },
        { label: 'Gender', value: 'gender' },
        { label: 'Climate', value: 'climate' },
      ],
    },
    {
      name: 'founders',
      type: 'array',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'financials',
      type: 'group',
      fields: [
        { name: 'currency', type: 'text' },
        { name: 'lastFYRevenue', type: 'number' },
        { name: 'avgMonthlyRevenue', type: 'number' },
      ],
    },
    {
      name: 'gedsi',
      type: 'group',
      fields: [
        { name: 'hasPolicy', type: 'checkbox' },
        { name: 'notes', type: 'textarea' },
      ],
    },
  { name: 'triageTrack', type: 'select', options: triageOptions, defaultValue: 'unassigned' },
    { name: 'triageRationale', type: 'textarea' },
  ],
}

// end
