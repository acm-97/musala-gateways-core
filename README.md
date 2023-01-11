# REST service (JSON/HTTP) for storing information about gateways and their associated devices

## Description of the task

Create a REST service (JSON/HTTP) for storing information about these
gateways and their associated devices. This information must be stored in the database.\
When storing a gateway, any field marked as “to be validated” must be validated and an
error returned if it is invalid. Also, no more that 10 peripheral devices are allowed for a
gateway.\
The service must also offer an operation for displaying information about all stored gateways
(and their devices) and an operation for displaying details for a single gateway. Finally, it
must be possible to add and remove a device from a gateway.

Each gateway has:

- a unique serial number (string),
- human-readable name (string),
- IPv4 address (to be validated),
- multiple associated peripheral devices.

Each peripheral device has:

- a UID (number),
- vendor (string),
- date created,
- status - online/offline.

## How to start?

- First ypu need to install dependencies, type `yarn install` or `npm install` on console.
- Then for get the server running:
  - Create `.env` file and put the content of `.env.template` inside. This template is only for show the environment variables and a example of the values in this case you can use the same if you use it in localhost.
  - Once created you can then type in console `yarn start` or `npm run start` if you want the server runing.
  - For run the tests, type in console `yarn test` or `npm run test`

## API Endpoints

### Gateways

Models:

- `name`: number
- `ipv4_address`: string
- `id`: string

Routes:

- `GET /api/gateways` get a list of gateways and a the devices associated with each one.
- `GET /api/gateway/:id` recieve a **gateway id** by params and return all the related info.
- `POST /api/gateway/` create a gateway.
- `/api/gateway/:id` recieve a **gateway id** by params and the fields you want to update by the body of the request.
- `/api/gateway/:id` recieve a **gateway id** by params to delete a gateway.

### Peripheral

Models:

- `uid`: number
- `vendor`: string
- `status`: 'online' | 'offline'
- `gateway`: string
- `createdAt`: string

Routes:

- `GET /api/peripherals` get a list of gateways and a the devices associated with each one.
- `GET /api/peripheral/:id` recieve a **peripherals id** by params and return all the related info.
- `POST /api/peripheral/` in addition to the requested info you most provide the **gateway id** with which you want to link this device.
- `/api/peripheral/:id` recieve a **peripherals id** by params and the fields you want to update by the body of the request.
- `/api/peripheral/:id` recieve a **peripherals id** by params to delete a gateway.
