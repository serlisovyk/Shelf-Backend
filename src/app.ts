import { Elysia } from 'elysia'

export const app = new Elysia().get('/health', () => ({ status: 'ok' as const }))

export type App = typeof app
