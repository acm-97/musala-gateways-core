const { Router } = require('express')
const router = Router()
const Gateway = require('../modules/gateway.module')
const { checkIfValidIP, Errors } = require('../utils')
const { Types } = require('mongoose')

const agg = [
  {
    $lookup: {
      from: 'peripherals',
      localField: '_id',
      foreignField: 'gateway',
      as: 'peripherals_devices'
    }
  }
]

router.route('/api/gateways').get(async (req, res) =>
  await Gateway.aggregate(agg)
    .then((gateways) => res.status(200).json(gateways))
    .catch(err => res.status(400).json(Errors(err)))
)

router.route('/api/gateway/:id').get(async (req, res) => {
  const { id } = req.params

  await Gateway.aggregate([{ $match: { _id: Types.ObjectId(id) } }, ...agg])
    .then((gateway) => res.status(200).json(gateway))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/gateway').post(async (req, res) => {
  const ipv4 = req.body.ipv4_address
  if (!checkIfValidIP(ipv4) || await existIPV4(ipv4)) {
    return res.status(400).json(`${ipv4} is an invalid IP`)
  }

  await Gateway.create(req.body)
    .then((gateway) => res.status(200).json(gateway))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/gateway/:id').patch(async (req, res) => {
  const ipv4 = req.body.ipv4_address
  if (ipv4 && (!checkIfValidIP(ipv4) || await existIPV4(ipv4))) {
    return res.status(400).json(`${ipv4} is an invalid IP`)
  }

  const { id: _id } = req.params

  await Gateway.updateOne({ _id }, req.body)
    .then((gateway) => res.status(200).json(gateway))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/gateway/:id').delete(async (req, res) => {
  const { id: _id } = req.params

  await Gateway.deleteOne({ _id })
    .then((gateway) => res.status(200).json(gateway))
    .catch(err => res.status(400).json(Errors(err)))
})

/**
 * If the IP is valid and it exists, return a 400 status code with a message.
 * @param ip - the ip address to be checked
 * @param res - is the response object
 * @returns The function isValidIPV4 is returning a promise.
 */
async function existIPV4 (ip) {
  const exist = await Gateway.findOne({ ipv4_address: ip })
  return exist
}

module.exports = router
