/* eslint-disable no-undef */
const mongoose = require('mongoose')
const { app, server } = require('../index')
const Peripheral = require('../models/peripheral.model')
const Gateway = require('../models/gateway.model')
const supertest = require('supertest')

const api = supertest(app)

const gatewayParams = {
  name: 'Home Gateway',
  ipv4_address: '10.2.80.199'
}

const paramas = {
  uid: 725,
  vendor: 'Samsung',
  status: 'online'
}

const wrongParamas = {
  uid: null,
  vendor: 'Samsungs',
  status: 'online'
}

describe('Peripherals routes tests', () => {
  let gateway
  beforeAll(async () => {
    await api.post('/api/gateway').send(gatewayParams)
    gateway = await Gateway.findOne({ name: gatewayParams.name })
  })

  afterAll(async () => {
    await Peripheral.deleteMany({ uid: paramas.uid })
    await Gateway.deleteMany({ name: gatewayParams.name })
    await mongoose.disconnect()
    server.close()
  })

  describe('POST /api/peripheral', () => {
    it('Response 200', async () => {
      const response = await api.post('/api/peripheral').send({ gateway: gateway?._id, ...paramas })
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await api.post('/api/peripheral').send({ gateway: gateway?._id, ...wrongParamas })
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body.errors.uid).not.toBeNull()
    })
  })

  describe('GET /api/peripherals', () => {
    let response = null
    beforeEach(async () => {
      response = await api.get('/api/peripherals').send()
    })

    it('Response 200', () => {
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/peripheral/:id', () => {
    it('Response 200', async () => {
      const device = await Peripheral.findOne({ uid: paramas.uid })
      const response = await api.get(`/api/peripheral/${device?._id.toString()}`).send()

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
      expect(JSON.stringify(response.body)).not.toBe('{}')
    })
  })

  describe('PATCH /api/peripheral/:id', () => {
    let device = null
    beforeAll(async () => {
      device = await Peripheral.findOne({ name: paramas.uid })
    })

    it('Response 200', async () => {
      const response = await api.patch(`/api/peripheral/${device?._id?.toString()}`).send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 400', async () => {
      const response = await api.patch(`/api/peripheral/${device?._id?.toString()}`).send(wrongParamas)
      console.log(response.body)
      expect(response.status).toBe(400)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toEqual('UID field is requiered')
    })
  })

  describe('DELETE /api/peripheral/:id', () => {
    let device = null
    beforeAll(async () => {
      device = await Peripheral.findOne({ name: paramas.uid })
    })

    it('Response 200', async () => {
      const response = await api.delete(`/api/peripheral/${device?._id?.toString()}`).send(paramas)
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
      expect(response.body).toBeInstanceOf(Object)
    })

    it('Response 404', async () => {
      const response = await api.delete('/api/peripheral/wrong_id').send()
      expect(response.status).toBe(404)
    })
  })
})
