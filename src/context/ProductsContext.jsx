import { createContext, useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../helpers/firebase'
import { useAuth } from '../hooks/useAuth'

export const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Las reglas exigen sesión: solo escuchamos cuando hay usuario
    if (!uid) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setProducts(list)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar los productos.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [uid])

  const getProduct = (id) => products.find((p) => p.id === id)

  return (
    <ProductsContext.Provider value={{ products, loading, error, getProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}