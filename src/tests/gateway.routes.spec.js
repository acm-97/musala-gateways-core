/* eslint-disable no-undef */
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../index')
const config = require('config')
const Gateway = require('../models/gateway.model')

const paramas = {
  name: 'Home Gateway',
  ipv4_address: '10.2.80.199'
}

const wrongParamas = {
  name: 'Wrong Home Gateway',
  ipv4_address: ''
}

describe('Gateways routes tests', () => {
  beforeAll(async () => {
    const db = config.get('MONGODB_URI')
    await mongoose.connect(db)
  })

  afterAll(async () => {
    await Gateway.deleteMany({ name: paramas.name })
    await Gateway.deleteMany({ name: wrongParamas.name })
    await mongoose.disconnect()
  })

  describe('POST /api/gateways', () => {
    it('Response 200', async () => {
      const response = await request(app).post('/api/gateway').send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await request(app).post('/api/gateway').send(wrongParamas)
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body.errors.ipv4_address).not.toBeNull()
    })
  })

  describe('GET /api/gateways', () => {
    let response = null
    beforeEach(async () => {
      response = await request(app).get('/api/gateways').send()
    })

    it('Response 200', () => {
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/gateways/:id', () => {
    it('Response 200', async () => {
      const gates = await request(app).get('/api/gateways').send()
      const response = await request(app).get(`/api/gateway/${gates.body[0]?._id.toString()}`).send()

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
      expect(JSON.stringify(response.body)).not.toBe('{}')
    })

    // it('Response 404', async () => {
    //   await request(app)
    //     .get('/api/gateway/wrong_id')
    //     .expect('Content-Type', /json/)
    //     .expect(404).end((err) => {
    //       if (err) return done(err)
    //       done()
    //     })
    // })
  })

  describe('PATCH /api/gateways/:id', () => {
    let gate = null
    beforeAll(async () => {
      gate = await Gateway.findOne({ name: paramas.name })
    })

    it('Response 200', async () => {
      const response = await request(app).patch(`/api/gateway/${gate?._id?.toString()}`).send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await request(app).patch(`/api/gateway/${gate?._id?.toString()}`).send(wrongParamas)
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toEqual(`${wrongParamas.ipv4_address} is an invalid IP or is already in use`)
    })
  })
})
