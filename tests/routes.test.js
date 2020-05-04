const request = require('supertest')
const app = require('../server')
describe('Home Get', () => {
  it('Home Get', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200)
  })
})

describe('Card Get', () => {
    it('Card Get', async () => {
      const res = await request(app)
        .get('/cards')
      expect(res.statusCode).toEqual(200)
    })
  })

describe('Register Get', () => {
    it('Register Get', async () => {
      const res = await request(app)
        .get('/register')
      expect(res.statusCode).toEqual(200)
    })
  })

describe('Register Post', () => {
    it('Register Post', async () => {
      const res = await request(app)
        .post('/register')
        .send({
            username: '234324',
            password: 'sdfdsf',
          })
          console.log(res)
      expect(res.statusCode).toEqual(200)
    })
  })

describe('clearList', () => {
    it('clearList', async () => {
      const res = await request(app)
        .get('/clearList')
      expect(res.statusCode).toEqual(302)
    })
  })