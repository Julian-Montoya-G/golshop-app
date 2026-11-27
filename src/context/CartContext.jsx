import { createContext, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { localDb } from '../helpers/db'
import { shippingFor } from '../helpers/golshopData'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const { products } = useProducts()
  const uid = user?.uid

  // useLiveQuery vuelve a renderizar cuando cambia la tabla local
  const items = useLiveQuery(
    () => (uid ? localDb.cart.where('userId').equals(uid).toArray() : []),
    [uid],
    []
  )

  const addToCart = async (productId, size, qty = 1) => {
    if (!uid) return
    const max = products.find((p) => p.id === productId)?.stock ?? 99
    const key = [uid, productId, size]
    await localDb.transaction('rw', localDb.cart, async () => {
      const existing = await localDb.cart.get(key)
      if (existing) {
        await localDb.cart.update(key, { qty: Math.min(existing.qty + qty, max) })
      } else {
        await localDb.cart.add({ userId: uid, productId, size, qty: Math.min(qty, max) })
      }
    })
  }

  const setQty = async (productId, size, qty) => {
    const key = [uid, productId, size]
    if (qty <= 0) {
      await localDb.cart.delete(key)
      return
    }
    const max = products.find((p) => p.id === productId)?.stock ?? 99
    await localDb.cart.update(key, { qty: Math.min(qty, max) })
  }

  const removeFromCart = (productId, size) => localDb.cart.delete([uid, productId, size])

  const clearCart = () => localDb.cart.where('userId').equals(uid).delete()

  const value = useMemo(() => {
    const lines = items
      .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
      .filter((line) => line.product)
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const shipping = shippingFor(subtotal)
    return {
      lines,
      cartCount: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    }
  }, [items, products])

  return (
    <CartContext.Provider value={{ ...value, addToCart, setQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}