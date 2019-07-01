import test from 'ava'
import alio from 'alio'

test('node', async t => {
  const app = alio([
    {
      in: './in/node.js',
      out: './out',
      presets: [
        'node'
      ]
    }
  ])

  app.on('done', () => {
    t.pass()
  })

  await app.build()
})
