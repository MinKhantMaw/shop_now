/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { fetchProducts } from '../api/productService'
import { fetchAddresses, submitCheckout } from '../api/checkoutService'
import { initiatePayment } from '../api/paymentService'
import { createOrder } from '../api/orderService'

const ShopContext = createContext(null)

const SHIPPING_FEE = 7
const TAX_RATE = 0.08

const initialState = {
  products: [],
  productsLoading: false,
  addresses: [],
  addressesLoading: false,
  cart: [],
  filters: {
    search: '',
    category: 'All',
    inStockOnly: false,
  },
  selectedAddressId: '',
  checkoutSnapshot: null,
  paymentStatus: {
    loading: false,
    error: '',
    providerRef: '',
  },
  latestOrder: null,
  toasts: [],
}

function uniqueCartKey(productId, variantId) {
  return `${productId}::${variantId}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    case 'SET_PRODUCTS_LOADING':
      return { ...state, productsLoading: action.payload }
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload }
    case 'SET_ADDRESSES_LOADING':
      return { ...state, addressesLoading: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'SET_SELECTED_ADDRESS':
      return { ...state, selectedAddressId: action.payload }
    case 'ADD_TO_CART': {
      const item = action.payload
      const key = uniqueCartKey(item.productId, item.variantId)
      const existing = state.cart.find((entry) => entry.key === key)

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + item.quantity, item.stock)
        return {
          ...state,
          cart: state.cart.map((entry) =>
            entry.key === key ? { ...entry, quantity: nextQuantity } : entry,
          ),
        }
      }

      return {
        ...state,
        cart: [...state.cart, { ...item, key }],
      }
    }
    case 'UPDATE_CART_QTY': {
      const { key, quantity } = action.payload
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
            : item,
        ),
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.key !== action.payload),
      }
    case 'SET_CHECKOUT_SNAPSHOT':
      return { ...state, checkoutSnapshot: action.payload }
    case 'SET_PAYMENT_STATUS':
      return {
        ...state,
        paymentStatus: { ...state.paymentStatus, ...action.payload },
      }
    case 'SET_LATEST_ORDER':
      return { ...state, latestOrder: action.payload }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      }
    default:
      return state
  }
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.line1}, ${address.city}, ${address.state} ${address.zip}`
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const pushToast = useCallback((type, message) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message } })

    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id })
    }, 3200)
  }, [])

  const loadBootstrapData = useCallback(async () => {
    dispatch({ type: 'SET_PRODUCTS_LOADING', payload: true })
    dispatch({ type: 'SET_ADDRESSES_LOADING', payload: true })

    try {
      const [products, addresses] = await Promise.all([fetchProducts(), fetchAddresses()])
      dispatch({ type: 'SET_PRODUCTS', payload: products })
      dispatch({ type: 'SET_ADDRESSES', payload: addresses })

      if (addresses[0]) {
        dispatch({ type: 'SET_SELECTED_ADDRESS', payload: addresses[0].id })
      }
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      dispatch({ type: 'SET_PRODUCTS_LOADING', payload: false })
      dispatch({ type: 'SET_ADDRESSES_LOADING', payload: false })
    }
  }, [pushToast])

  useEffect(() => {
    loadBootstrapData()
  }, [loadBootstrapData])

  const categories = useMemo(
    () => ['All', ...new Set(state.products.map((product) => product.category))],
    [state.products],
  )

  const filteredProducts = useMemo(() => {
    return state.products.filter((product) => {
      const term = state.filters.search.toLowerCase().trim()
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      const matchesCategory =
        state.filters.category === 'All' || product.category === state.filters.category
      const hasStock = product.variants.some((variant) => variant.stock > 0)
      const matchesStock = !state.filters.inStockOnly || hasStock

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [state.filters, state.products])

  const cartSubtotal = useMemo(
    () => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [state.cart],
  )
  const cartTax = useMemo(() => cartSubtotal * TAX_RATE, [cartSubtotal])
  const cartTotal = useMemo(
    () => (state.cart.length ? cartSubtotal + cartTax + SHIPPING_FEE : 0),
    [cartSubtotal, cartTax, state.cart.length],
  )

  const selectedAddress = useMemo(
    () => state.addresses.find((address) => address.id === state.selectedAddressId),
    [state.addresses, state.selectedAddressId],
  )

  const addToCart = useCallback(
    (product, variant, quantity = 1) => {
      if (!variant) {
        pushToast('error', 'Select a product variant first.')
        return
      }
      if (variant.stock <= 0) {
        pushToast('error', 'This variant is currently out of stock.')
        return
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          variantLabel: variant.label,
          price: product.price,
          stock: variant.stock,
          image: product.image,
          quantity,
        },
      })
      pushToast('success', `${product.name} added to cart.`)
    },
    [pushToast],
  )

  const updateCartQty = useCallback((key, quantity) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { key, quantity } })
  }, [])

  const removeFromCart = useCallback(
    (key) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: key })
      pushToast('info', 'Item removed from cart.')
    },
    [pushToast],
  )

  const validateCart = useCallback(() => {
    const invalidItem = state.cart.find((item) => item.quantity > item.stock)
    if (invalidItem) {
      return `Only ${invalidItem.stock} unit(s) available for ${invalidItem.name}.`
    }
    if (state.cart.length === 0) {
      return 'Your cart is empty.'
    }
    return ''
  }, [state.cart])

  const prepareCheckout = useCallback(async () => {
    const cartError = validateCart()
    if (cartError) {
      pushToast('error', cartError)
      return { ok: false, message: cartError }
    }

    if (!selectedAddress) {
      pushToast('error', 'Please select a shipping address.')
      return { ok: false, message: 'Address is required.' }
    }

    const snapshot = {
      items: state.cart,
      subtotal: cartSubtotal,
      tax: cartTax,
      shipping: SHIPPING_FEE,
      total: cartTotal,
      address: selectedAddress,
      addressLabel: formatAddress(selectedAddress),
    }

    dispatch({ type: 'SET_CHECKOUT_SNAPSHOT', payload: snapshot })
    await submitCheckout(snapshot)

    return { ok: true }
  }, [
    cartSubtotal,
    cartTax,
    cartTotal,
    pushToast,
    selectedAddress,
    state.cart,
    validateCart,
  ])

  const startPayment = useCallback(
    async (method) => {
      if (!state.checkoutSnapshot) {
        return { ok: false, message: 'Checkout details are missing.' }
      }

      dispatch({
        type: 'SET_PAYMENT_STATUS',
        payload: { loading: true, error: '', providerRef: '' },
      })

      try {
        const payment = await initiatePayment({
          method,
          amount: state.checkoutSnapshot.total,
          checkout: state.checkoutSnapshot,
        })

        const order = await createOrder({
          paymentId: payment.paymentId,
          paymentMethod: method,
          providerRef: payment.providerRef,
          ...state.checkoutSnapshot,
        })

        dispatch({
          type: 'SET_PAYMENT_STATUS',
          payload: {
            loading: false,
            error: '',
            providerRef: payment.providerRef,
          },
        })
        dispatch({ type: 'SET_LATEST_ORDER', payload: order })
        dispatch({ type: 'CLEAR_CART' })
        pushToast('success', 'Payment successful. Order placed.')

        return { ok: true, orderId: order.id }
      } catch (error) {
        dispatch({
          type: 'SET_PAYMENT_STATUS',
          payload: { loading: false, error: error.message, providerRef: '' },
        })
        pushToast('error', error.message)
        return { ok: false, message: error.message }
      }
    },
    [pushToast, state.checkoutSnapshot],
  )

  const value = useMemo(
    () => ({
      ...state,
      categories,
      filteredProducts,
      selectedAddress,
      cartSubtotal,
      cartTax,
      shippingFee: SHIPPING_FEE,
      cartTotal,
      setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
      setSelectedAddress: (id) => dispatch({ type: 'SET_SELECTED_ADDRESS', payload: id }),
      addToCart,
      updateCartQty,
      removeFromCart,
      validateCart,
      prepareCheckout,
      startPayment,
    }),
    [
      addToCart,
      cartSubtotal,
      cartTax,
      cartTotal,
      categories,
      filteredProducts,
      prepareCheckout,
      removeFromCart,
      selectedAddress,
      startPayment,
      state,
      updateCartQty,
      validateCart,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used inside ShopProvider')
  }
  return context
}
