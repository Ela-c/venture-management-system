/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })
  const user = (await (payload as any).getRequestContext(req)).user as any
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const providerId = `mock-${params.id}-${Date.now()}`
  const updated = await (payload as any).update({ collection: 'agreements', id: params.id, data: { status: 'sent', provider: 'mock', providerRequestId: providerId } })
  await (payload as any).create({ collection: 'activityLogs', data: { action: 'agreement.sendSignature', entity: 'agreement', entityId: params.id, metadata: { providerId }, timestamp: new Date().toISOString() } })
  return Response.json({ ok: true, agreement: updated })
}
