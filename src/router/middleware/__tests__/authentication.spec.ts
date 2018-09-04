import { authenticate, isAdmin, isAuthenticated } from '../authentication'

import expect from 'unexpected'

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOnRydWUsImlhdCI6MTUyNzYxODk5MCwiaXNzIjoibG9jYWxob3N0In0.YzO3mVfYnePWFXGVuQnIhmcZvRrGEKrwxRXZ4KSFZV8'

const authenticatedRequest = {
  user: {
    id: 1,
    admin: true,
  },
  admin: true,
  authenticated: true,
}

describe('authentication - authenticate', function() {
  it('should write the correct user to a request with valid jwt in the header', done => {
    const req = {
      headers: {
        jwt,
      },
    }
    authenticate(req, {}, () => {
      expect(req, 'to satisfy', authenticatedRequest)
      done()
    })
  })

  it('should write the correct user to a request with valid jwt as cookie', done => {
    const req = {
      headers: {
        cookie: `test=asdweq; jwt=${jwt}; test2=awdqwe;`,
      },
    }
    authenticate(req, {}, () => {
      expect(req, 'to satisfy', authenticatedRequest)
      done()
    })
  })

  it('should write the correct user to a request with valid jwt as parsed cookie', done => {
    const req = {
      headers: {},
      cookies: {
        jwt,
      },
    }
    authenticate(req, {}, () => {
      expect(req, 'to satisfy', authenticatedRequest)
      done()
    })
  })

  it('should write the correct user to a request with valid jwt as parsed cookie', done => {
    const req = {
      headers: {},
      cookies: {
        jwt: '123123',
      },
    }
    authenticate(req, {}, () => {
      expect(req, 'to satisfy', {
        authenticated: false,
      })
      done()
    })
  })

  it('should write the correct user to a request with valid jwt as parsed cookie', done => {
    const req = {
      headers: {},
    }
    authenticate(req, {}, () => {
      expect(req, 'to satisfy', {
        authenticated: false,
      })
      done()
    })
  })
})

describe('authentication - isAdmin', function() {
  it('should call next if admin is true', done => {
    isAdmin(authenticatedRequest, {}, () => done())
  })

  it('should send an invalid response if admin is not true', done => {
    isAdmin(
      {},
      {
        status: statusId => ({
          send: response => {
            expect(statusId, 'to equal', 403)
            expect(response.success, 'to equal', false)
            done()
          },
        }),
      },
      () => null,
    )
  })
})

describe('authentication - isAdmin', function() {
  it('should call next if admin is true', done => {
    isAuthenticated(authenticatedRequest, {}, () => done())
  })

  it('should send an invalid response if admin is not true', done => {
    isAuthenticated(
      {},
      {
        status: statusId => ({
          send: response => {
            expect(statusId, 'to equal', 403)
            expect(response.success, 'to equal', false)
            done()
          },
        }),
      },
      () => null,
    )
  })
})
