/*!
 * sessions-provider-redis
 * Copyright(c) 2017 Fangdun Cai <cfddream@gmail.com> (https://fundon.me)
 * MIT Licensed
 */

'use strict'

const redis = require('redis')
const parse = require('fast-json-parse')
const stringify = require('fast-safe-stringify')

const defaults = {
  // Serializer
  serializer: { parse, stringify },
  // Redis client
  client: undefined,
  // Redis client options
  clientOptions: undefined
}

module.exports = class RedisProvider {

  constructor (options = {}) {
    Object.keys(options).forEach(k => {
      if (!(k in defaults)) delete options[k]
    })
    Object.assign(this, defaults, options)

    if (!this.client) {
      this.client = redis.createClient(this.clientOptions)
    }
  }

  clear () {
    return new Promise((resolve, reject) => {
      this.client.flushdb(err => {
        err ? reject(err) : resolve()
      })
    })
  }

  get (sid) {
    return new Promise((resolve, reject) => {
      this.client.get(sid, (error, data) => {
        if (error) return reject(error)
        if (!data) return resolve()
        const { err, value } = this.serializer.parse(data)
        err ? reject(err) : resolve(value)
      })
    })
  }

  set (sid, sess, expires) {
    return new Promise((resolve, reject) => {
      this.client.setex(
        sid,
        expires / 1000,
        this.serializer.stringify(sess),
        (err, data) => {
          err ? reject(err) : resolve(data)
        }
      )
    })
  }

  delete (sid) {
    return new Promise((resolve, reject) => {
      this.client.del(sid, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  quit () {
    return new Promise((resolve, reject) => {
      this.client.quit((err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

}
