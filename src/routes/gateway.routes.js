const { Router } = require('express')
const router = Router()
const Gateway = require('../models/gateway.model')
const { checkIfValidIP, Errors } = require('../utils')
const { Types } = require('mongoose')

const agg = [
  {
    $lookup: {
      from: 'peripherals',
      localField: '_id',
      foreignField: 'gateway',
      as: 'peripheralsDevices'
    }
  }
]

/**
 * * get all route for gateways
 */

router.route('/api/gateways').get(
  async (req, res) =>
    await Gateway.aggregate(agg)
      .then((gateways) => res.status(200).json(gateways))
      .catch((err) => res.status(400).json(Errors(err)))
)

/**
 * * get one route for gateways
 */
router.route('/api/gateway/:id').get(async (req, res) => {
  const { id } = req.params

  await Gateway.aggregate([{ $match: { _id: Types.ObjectId(id) } }, ...agg])
    .then((gateway) => res.status(200).json(gateway[0]))
    .catch((err) => res.status(400).json(Errors(err)))
})

/**
 * * path route for gateways
 */
router.route('/api/gateway').post(async (req, res) => {
  const ipv4 = req.body.ipv4_address
  if (ipv4 && (!checkIfValidIP(ipv4) || (await existIPV4(ipv4)))) {
    return res
      .status(400)
      .json('The provided IP is invalid or is already in use')
  }

  const gate = await Gateway.findOne({ name: req.body.name })
  if (gate) {
    return res.status(400).json(`Name ${req.body.name} is already in use`)
  }

  await Gateway.create(req.body)
    .then((gateway) => res.status(200).json(gateway))
    .catch((err) => res.status(400).json(Errors(err)))
})

/**
 * * patch route for gateways
 */
router.route('/api/gateway/:id').patch(async (req, res) => {
  const ipv4 = req.body.ipv4_address
  const { id: _id } = req.params
  let gate = null

  gate = await existIPV4(ipv4)
  if (!checkIfValidIP(ipv4) || gate?._id.toString() !== _id) {
    return res
      .status(400)
      .json(`${ipv4} is an invalid IP or is already in use`)
  }

  gate = await Gateway.findOne({ name: req.body.name })
  if (gate && gate._id.toString() !== _id) {
    return res.status(400).json(`Name ${req.body.name} is already in use`)
  }

  await Gateway.updateOne({ _id }, req.body)
    .then((gateway) => res.status(200).json(gateway))
    .catch((err) => res.status(400).json(Errors(err)))
})

/**
 * * delete route for gateways
 */
router.route('/api/gateway/:id').delete(async (req, res) => {
  const { id: _id } = req.params

  await Gateway.deleteOne({ _id })
    .then((gateway) => res.status(200).json(gateway))
    .catch((err) => res.status(400).json(Errors(err)))
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
