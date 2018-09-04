import { createJWT, decodeJWT } from '../jwt'

import { JsonWebTokenError } from 'jsonwebtoken'
import expect from 'unexpected'

describe('jwt - decode JWT', function() {
  it('should decode a valid JWT', async () => {
    const token = await decodeJWT(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOnRydWUsImlhdCI6MTUyNzYxODk5MCwiaXNzIjoibG9jYWxob3N0In0.YzO3mVfYnePWFXGVuQnIhmcZvRrGEKrwxRXZ4KSFZV8',
    )

    expect(token, 'to satisfy', { id: 1, admin: true })
  })

  it('should decode an invalid JWT', async () => {
    try {
      const token = await decodeJWT(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOnRydWUsImlhdCI6MTUyNzYxODk5MCwiaXNzIjoibG9jYWxob3N0In0.YzO3mVfYnePWFXGVuQnIhmcZvRrGE2rwxRXZ4KSFZV8',
      )
    } catch (err) {
      expect(err, 'to equal', new JsonWebTokenError('invalid signature'))
    }
  })
})

describe('jwt - create JWT', function() {
  it('should create a valid JWT', async () => {
    const token = await createJWT({ admin: true, id: 1, name: 'test' })

    expect(await decodeJWT(token), 'to satisfy', { id: 1, admin: true })
  })

  it('should create a valid JWT', async () => {
    try {
      global.secretKey = undefined
      const token = await createJWT({ admin: true, id: 1, name: 'test' })
    } catch (err) {
      global.secretKey = '1234567890'
      expect(err, 'to equal', new Error('secretOrPrivateKey must have a value'))
    }
  })
})
