import test from 'ava'
import RedisProvider from './'

test('should create a redis client', t => {
  const provider = new RedisProvider({
    customKey: 233
  })

  t.not(provider.client, undefined)

  provider.quit().then(t.context.done)
})

test('should return undefined', async t => {
  const provider = new RedisProvider()

  const sess = await provider.get('233')

  t.is(sess, undefined)

  await provider.quit()
})

test('should save a session', async t => {
  const provider = new RedisProvider()

  await provider.set('233', {
    cookie: {}
  }, 2000)

  const sess = await provider.get('233')

  t.deepEqual(sess, {
    cookie: {}
  })

  await provider.quit()
})

test('should delete a session', async t => {
  const provider = new RedisProvider()

  await provider.set('233', {
    cookie: {}
  }, 2000)

  let sess = await provider.get('233')

  t.deepEqual(sess, {
    cookie: {}
  })

  await provider.delete('233')

  sess = await provider.get('233')

  t.is(sess, undefined)

  await provider.quit()
})

test('should clear all sessions', async t => {
  const provider = new RedisProvider()

  await provider.set('233', {
    cookie: {}
  }, 2000)

  await provider.set('377', {
    cookie: {}
  }, 2000)

  await provider.clear('233')

  const sess0 = await provider.get('233')
  const sess1 = await provider.get('377')

  t.is(sess0, undefined)
  t.is(sess1, undefined)

  await provider.quit()
})

test('should throw error when JSON parse', async t => {
  const provider = new RedisProvider({
    serializer: {
      parse: s => {
        let err
        let value
        try {
          value = JSON.parse(s)
        } catch (err) {
          return { err, value }
        }
        return { err, value }
      },
      stringify: s => s
    }
  })

  await provider.set('610', 'trek engine', 2000)

  const error = await t.throws(provider.get('610'))

  t.true(/SyntaxError/.test(error.toString()))

  await provider.quit()
})

test('should throw error when redis is already closed', async t => {
  const provider = new RedisProvider()

  await provider.set('610', 'trek engine', 2000)

  await provider.quit()

  const error = await t.throws(provider.get('610'))

  t.true(/The connection is already closed/.test(error.message))
})
