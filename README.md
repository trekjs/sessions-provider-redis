# sessions-provider-redis

> Sessions Redis Provider


## Install

```console
$ npm install sessions-provider-redis --save
```


## Usage

```js
'use strict'

const Engine = require('trek-engine')
const sessions = require('trek-sessions')
const RedisProvider = require('sessions-provider-redis')

async function start (port = 3000) {
  const app = new Engine()

  app.config.set('cookie', {
    keys: ['trek', 'engine']
  })

  app.use(await sessions({
    cookie: {
      signed: false,
      maxAge: 60 * 1000 // 1 minutes
    },
    provider: new RedisProvider()
  }))

  app.use(async ctx => {
    if (ctx.session.count) {
      ctx.session.count++
    } else {
      ctx.session.count = 1
    }
    if (ctx.req.path === '/clear') {
      ctx.session = null
      await ctx.sessions.store.clear()
    }
    ctx.res.body = ctx.session
  })

  await app.run(port)
}

start().catch(console.error)
```


## API

* `get(sid)`

* `set(sid, sess, expires)`

* `has(sid)`

* `delete(sid)`

* `clear()`

* `quit()`


## Badges


<a href="https://npmjs.org/package/sessions-provider-redis"><img src="https://img.shields.io/npm/v/sessions-provider-redis.svg" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/sessions-provider-redis"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"></a>
<a href="https://codecov.io/gh/trekjs/sessions-provider-redis"><img src="https://codecov.io/gh/trekjs/sessions-provider-redis/branch/master/graph/badge.svg" alt="Codecov" /></a>
<a href="https://travis-ci.org/trekjs/sessions-provider-redis"><img src="https://img.shields.io/travis/trekjs/sessions-provider-redis.svg?label=linux" alt="Linux Build"></a>
<a href="https://ci.appveyor.com/project/trekjs/sessions-provider-redis"><img src="https://img.shields.io/appveyor/ci/trekjs/sessions-provider-redis/master.svg?label=windows" alt="Window Build"/></a>


---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@Fangdun Cai](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
