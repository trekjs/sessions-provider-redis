import test from 'ava'
import RedisProvider from './'

test('should create a redis client', t => {
  const provider = new RedisProvider({
    customKey: 233
  })

  t.not(provider.client, undefined)
})

test('should return undefined', async t => {
  const provider = new RedisProvider()

  const sess = await provider.get('233')

  t.is(sess, undefined)
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
})
