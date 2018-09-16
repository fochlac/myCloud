import { Create, login } from '../../controller/user'
import { regexpValidator, validate } from '../../middleware/validate'

import { Router } from 'express'
import { createUserToken } from '../../../utils/jwt'
import error from '../../../utils/error'

const { routerError } = error('user-router')

const user = Router()

user.post(
  '/',
  validate(
    {
      body: {
        name: regexpValidator(/^[a-zA-Z0-9]{5,20}$/),
        password: regexpValidator(/^[A-Za-z0-9+\/]{22,22}$/),
      },
    },
    {},
  ),
  async (req, res) => {
    try {
      const {
        body: { name, password },
        token,
      } = req
      const user = await Create({ name, password, token })
      await createUserToken(req, res, user)
      res.status(200).send(user)
    } catch (error) {
      routerError(3, res, 'error creating user')(error)
    }
  },
)

user.post(
  '/login',
  validate(
    {
      body: {
        name: regexpValidator(/^[a-zA-Z0-9]{5,20}$/),
        password: regexpValidator(/^[A-Za-z0-9+\/]{22,22}$/),
      },
    },
    {},
  ),
  async (req, res) => {
    try {
      const {
        body: { name, password },
        token,
      } = req
      const user = await login({ name, password, token })
      await createUserToken(req, res, user)
      res.status(200).send(user)
    } catch (error) {
      routerError(3, res, 'error logging in user')(error)
    }
  },
)

export default user
