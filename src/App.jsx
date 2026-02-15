import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotFoundPage from './components/NotFoundPage'
import CatalogPage from './catalog/CatalogPage'
import CartPage from './cart/CartPage'
import CheckoutPage from './checkout/CheckoutPage'
import PaymentPage from './payment/PaymentPage'
import OrderConfirmationPage from './orders/OrderConfirmationPage'
import LoginPage from './auth/LoginPage'
import RequireAuth from './auth/RequireAuth'
import ProfilePage from './auth/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route
          path="payment"
          element={
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          }
        />
        <Route path="orders/:orderId" element={<OrderConfirmationPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
