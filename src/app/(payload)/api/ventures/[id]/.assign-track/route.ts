/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })
  const user = (await (payload as any).getRequestContext(req)).user as any
  if (!user || (user.role !== 'miv_analyst' && user.role !== 'admin')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { track, rationale } = body as { track: 'fast' | 'slow'; rationale?: string }
  if (!['fast', 'slow'].includes(track)) return Response.json({ error: 'Invalid track' }, { status: 400 })
  const venture = await (payload as any).update({ collection: 'ventures', id: params.id, data: { triageTrack: track, triageRationale: rationale } })
  await (payload as any).create({ collection: 'activityLogs', data: { action: 'venture.assignTrack', entity: 'venture', entityId: params.id, metadata: { track, rationale }, timestamp: new Date().toISOString() } })
  return Response.json({ ok: true, ventureId: venture.id, triageTrack: venture.triageTrack })
}
