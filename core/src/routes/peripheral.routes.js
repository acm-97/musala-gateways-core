const { Router } = require('express')
const router = Router()
const Peripheral = require('../modules/peripheral.module')
const { Errors } = require('../utils')

router.route('/api/peripherals').get(async (req, res) =>
  await Peripheral.find().populate('gateway')
    .then((peripherals) => res.status(200).json(peripherals))
    .catch(err => res.status(400).json(Errors(err)))
)

router.route('/api/peripheral/:id').get(async (req, res) => {
  const { id: _id } = req.params

  await Peripheral.findOne({ _id }).populate('gateway')
    .then((peripheral) => res.status(200).json(peripheral))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral').post(async (req, res) => {
  await Peripheral.create(req.body)
    .then((peripheral) => res.status(200).json(peripheral))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral/:id').patch(async (req, res) => {
  const { id: _id } = req.params

  await Peripheral.updateOne({ _id }, req.body)
    .then((peripheral) => res.status(200).json(peripheral))
    .catch(err => res.status(400).json(Errors(err)))
})

router.route('/api/peripheral/:id').delete(async (req, res) => {
  const { id: _id } = req.params

  await Peripheral.deleteOne({ _id })
    .then((peripheral) => res.status(200).json(peripheral))
    .catch(err => res.status(400).json(Errors(err)))
})

module.exports = router
