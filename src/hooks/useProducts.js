import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../helpers/firebase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // onSnapshot mantiene la lista sincronizada: si el admin cambia un producto, se actualiza solo
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
  }, [])

  return { products, loading, error }
}