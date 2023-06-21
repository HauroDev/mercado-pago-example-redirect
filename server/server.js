const express = require('express')
const app = express()
const cors = require('cors')
const mercadopago = require('mercadopago')
const morgan = require('morgan')

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
  access_token:
    '<ACCESS-TOKEN>'
})

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('../../client/html-js'))
app.use(cors())
app.get('/', function (_req, res) {
  res.status(200).sendFile('index.html')
})

app.post('/create_preference', async (req, res) => {
  let preference = {
    items: [
      {
        title: String(req.body.description),
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity)
      }
    ],
    back_urls: {
      success: 'http://localhost:8080/feedback',
      failure: 'http://localhost:8080/feedback',
      pending: 'http://localhost:8080/feedback'
    },
    auto_return: 'approved'
  }

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id
      })
    })
    .catch(function (error) {
      console.log(error)
    })
})

app.get(
  '/feedback',
  function (req, _res, next) {
    console.log(req.query)
    next()
  },
  function (req, res) {
    const { payment_id, status, merchant_order_id, preference_id } = req.query

    let redirectUrl = 'http://localhost:3000/'

    if (status === 'approved') {
      redirectUrl += 'success'
    } else if (status === 'pending') {
      redirectUrl += 'pending'
    } else {
      redirectUrl += 'failure'
    }

    const queryParams = new URLSearchParams({
      payment_id,
      status,
      merchant_order_id,
      preference_id
    })

    return res.redirect(redirectUrl + '?' + queryParams.toString())
  }
)

app.get('/detail-order/:id')

app.listen(8080, () => {
  console.log('The server is now running on Port 8080')
})
