import { app } from '@app'

const port = Number(Bun.env.PORT ?? 3000)

app.listen(port, ({ url }) => {
  console.log(`Shelf API is running at ${url.href}`)
})
