import { App } from '../src/app'
import { boot } from '../src/main'
import supertest from 'supertest'

let application: App

beforeAll(async () => {
  const { app } = await boot
  application = app
})

describe('Users e2e', () => {
  it('Register - error', async () => {
    const res = await supertest(application.app).post('/users/register').send({
      email: 'test77@gmail.com',
      name: '77',
      password: '777',
    })

    expect(res.statusCode).toBe(422)
  })

  it('Login - success', async () => {
    const res = await supertest(application.app).post('/users/login').send({
      email: 'test77@gmail.com',
      password: '77',
    })

    expect(res.body.jwt).not.toBeUndefined()
  })

  it('Login - error', async () => {
    const res = await supertest(application.app).post('/users/login').send({
      email: 'test77@gmail.com',
      password: 'wrong',
    })

    expect(res.statusCode).toBe(401)
  })

  it('Info - success', async () => {
    const login = await supertest(application.app).post('/users/login').send({
      email: 'test77@gmail.com',
      password: '77',
    })
    const res = await supertest(application.app)
      .get('/users/info')
      .set('authorization', `Bearer ${login.body.jwt}`)

    expect(res.body.email).toEqual('test77@gmail.com')
  })

  it('Info - error', async () => {
    const res = await supertest(application.app)
      .get('/users/info')
      .set('authorization', `Bearer wrong-token`)

    expect(res.statusCode).toBe(401)
  })
})

afterAll(() => {
  application.close()
})
