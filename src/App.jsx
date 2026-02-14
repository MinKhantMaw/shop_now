import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotFoundPage from './components/NotFoundPage'
import CatalogPage from './catalog/CatalogPage'
import CartPage from './cart/CartPage'
import CheckoutPage from './checkout/CheckoutPage'
import PaymentPage from './payment/PaymentPage'
import OrderConfirmationPage from './orders/OrderConfirmationPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="orders/:orderId" element={<OrderConfirmationPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
