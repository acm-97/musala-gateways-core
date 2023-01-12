/* eslint-disable no-undef */
const mongoose = require('mongoose')
const { app, server } = require('../index')
const Gateway = require('../models/gateway.model')
const supertest = require('supertest')

const api = supertest(app)

const paramas = {
  name: 'Home Gateway',
  ipv4_address: '10.2.80.199'
}

const wrongParamas = {
  name: 'Wrong Home Gateway',
  ipv4_address: ''
}

describe('Gateways routes tests', () => {
  afterAll(async () => {
    await Gateway.deleteMany({ name: paramas.name })
    await Gateway.deleteMany({ name: wrongParamas.name })
    await mongoose.disconnect()
    server.close()
  })

  describe('POST /api/gateway', () => {
    it('Response 200', async () => {
      const response = await api.post('/api/gateway').send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await api.post('/api/gateway').send(wrongParamas)
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body.errors.ipv4_address).not.toBeNull()
    })
  })

  describe('GET /api/gateways', () => {
    let response = null
    beforeEach(async () => {
      response = await api.get('/api/gateways').send()
    })

    it('Response 200', () => {
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/gateway/:id', () => {
    it('Response 200', async () => {
      const gates = await api.get('/api/gateways').send()
      const response = await api.get(`/api/gateway/${gates.body[0]?._id.toString()}`).send()

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
      expect(JSON.stringify(response.body)).not.toBe('{}')
    })
  })

  describe('PATCH /api/gateway/:id', () => {
    let gate = null
    beforeAll(async () => {
      gate = await Gateway.findOne({ name: paramas.name })
    })

    it('Response 200', async () => {
      const response = await api.patch(`/api/gateway/${gate?._id?.toString()}`).send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await api.patch(`/api/gateway/${gate?._id?.toString()}`).send(wrongParamas)
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toEqual(`${wrongParamas.ipv4_address} is an invalid IP or is already in use`)
    })
  })

  describe('DELETE /api/gateway/:id', () => {
    let gate = null
    beforeAll(async () => {
      gate = await Gateway.findOne({ name: paramas.name })
    })

    it('Response 200', async () => {
      const response = await api.delete(`/api/gateway/${gate?._id?.toString()}`).send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 404', async () => {
      const response = await api.delete('/api/gateway/wrong_id').send()
      expect(response.status).toBe(404)
    })
  })
})
