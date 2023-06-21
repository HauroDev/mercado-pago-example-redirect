import React, { useState } from 'react'
import { initMercadoPago } from '@mercadopago/sdk-react'
import Payment from './components/Payment'
import Checkout from './components/Checkout'
import Footer from './components/Footer'
import InternalProvider from './components/ContextProvider'
import { SpinnerCircular } from 'spinners-react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
initMercadoPago('<PUBLIC-KEY>')

function SuccessPage() {
  const queryParams = new URLSearchParams(window.location.search)
  const paymentId = queryParams.get('payment_id')
  const status = queryParams.get('status')
  const merchantOrderId = queryParams.get('merchant_order_id')
  const preferenceId = queryParams.get('preference_id')

  return (
    <div>
      <h1>Success Page</h1>
      <p>Payment ID: {paymentId}</p>
      <p>Status: {status}</p>
      <p>Merchant Order ID: {merchantOrderId}</p>
      <p>Preference ID: {preferenceId}</p>
    </div>
  )
}

function PendingPage() {
  const queryParams = new URLSearchParams(window.location.search)
  const paymentId = queryParams.get('payment_id')
  const status = queryParams.get('status')
  const merchantOrderId = queryParams.get('merchant_order_id')
  const preferenceId = queryParams.get('preference_id')

  return (
    <div>
      <h1>Pending Page</h1>
      <p>Payment ID: {paymentId}</p>
      <p>Status: {status}</p>
      <p>Merchant Order ID: {merchantOrderId}</p>
      <p>Preference ID: {preferenceId}</p>
    </div>
  )
}

function FailurePage() {
  const queryParams = new URLSearchParams(window.location.search)
  const paymentId = queryParams.get('payment_id')
  const status = queryParams.get('status')
  const merchantOrderId = queryParams.get('merchant_order_id')
  const preferenceId = queryParams.get('preference_id')

  return (
    <div>
      <h1>Failure Page</h1>
      <p>Payment ID: {paymentId}</p>
      <p>Status: {status}</p>
      <p>Merchant Order ID: {merchantOrderId}</p>
      <p>Preference ID: {preferenceId}</p>
    </div>
  )
}

const App = () => {
  const [preferenceId, setPreferenceId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    quantity: '1',
    price: '10',
    amount: 10,
    description: 'Some book'
  })

  const handleClick = () => {
    setIsLoading(true)
    fetch('http://localhost:8080/create_preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
      .then((response) => {
        return response.json()
      })
      .then((preference) => {
        setPreferenceId(preference.id)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const renderSpinner = () => {
    if (isLoading) {
      return (
        <div className='spinner-wrapper'>
          <SpinnerCircular сolor='#009EE3' />
        </div>
      )
    }
  }

  return (
    <InternalProvider
      context={{ preferenceId, isLoading, orderData, setOrderData }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <div>
                <main>
                  {renderSpinner()}
                  <Checkout onClick={handleClick} description />
                  <Payment />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path='/success'
            element={
              <div>
                <SuccessPage />
                <NavLink to='/'>Home</NavLink>
              </div>
            }
          />
          <Route
            path='/pending'
            element={
              <div>
                <PendingPage />
                <NavLink to='/'>Home</NavLink>
              </div>
            }
          />
          <Route
            path='/failure'
            element={
              <div>
                <FailurePage />
                <NavLink to='/'>Home</NavLink>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </InternalProvider>
  )
}

export default App
