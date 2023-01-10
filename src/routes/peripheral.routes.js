const { Router } = require('express')
const router = Router()
const Peripheral = require('../models/peripheral.model')
const { Errors } = require('../utils')

router.route('/api/peripherals').get(
  async (req, res) =>
    await Peripheral.find()
      .populate('gateway')
      .then((peripherals) => res.status(200).json(peripherals))
      .catch((err) => res.status(400).json(Errors(err)))
)

router.route('/api/peripheral/:id').get(async (req, res) => {
  const { id: _id } = req.params

  await Peripheral.findOne({ _id })
    .populate('gateway')
    .then((peripheral) => res.status(200).json(peripheral[0]))
    .catch((err) => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral').post(async (req, res) => {
  let device = null

  device = await Peripheral.findOne({ uid: req.body.uid })
  if (device) {
    return res
      .status(400)
      .json(`UID ${req.body.uid} is already assigned to another device`)
  }

  device = await Peripheral.findOne({ vendor: req.body.vendor })
  if (device) {
    return res
      .status(400)
      .json(`Vendor ${req.body.vendor} is already assigned to another device`)
  }

  await Peripheral.create(req.body)
    .then((peripheral) => res.status(200).json(peripheral))
    .catch((err) => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral/:id').patch(async (req, res) => {
  const { id: _id } = req.params
  let device = null

  device = await Peripheral.findOne({ uid: req.body.uid })
  if (device && device._id.toString() !== _id) {
    return res
      .status(400)
      .json(`UID ${req.body.uid} is already assigned to another device`)
  }

  device = await Peripheral.findOne({ vendor: req.body.vendor })
  if (device && device._id.toString() !== _id) {
    return res
      .status(400)
      .json(`Vendor ${req.body.vendor} is already assigned to another device`)
  }

  await Peripheral.updateOne({ _id }, req.body)
    .then((peripheral) => res.status(200).json(peripheral))
    .catch((err) => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral/:id').delete(async (req, res) => {
  const { id: _id } = req.params

  await Peripheral.deleteOne({ _id })
    .then((peripheral) => res.status(200).json(peripheral))
    .catch((err) => res.status(400).json(Errors(err)))
})

module.exports = router
