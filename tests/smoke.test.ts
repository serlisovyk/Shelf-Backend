import { app } from '@app'
import { describe, expect, it } from 'bun:test'

describe('app', () => {
  it('responds to GET /health', async () => {
    const response = await app.handle(new Request('http://localhost/health'))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })
})
