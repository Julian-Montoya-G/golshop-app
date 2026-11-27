import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { shippingFor } from './golshopData'

/**
 * Crea el pedido y descuenta el stock en una transacción:
 * si algo falla (por ejemplo, otro usuario compró la última unidad), no se guarda nada.
 */
export async function createOrder({ user, lines }) {
  if (!user || lines.length === 0) throw new Error('Tu carrito está vacío.')

  const orderRef = doc(collection(db, 'orders'))
  const number = `GS-${orderRef.id.slice(0, 5).toUpperCase()}`

  // Unidades pedidas por producto (un mismo producto puede venir en varias tallas)
  const needed = {}
  lines.forEach((l) => {
    needed[l.productId] = (needed[l.productId] || 0) + l.qty
  })
  const productIds = Object.keys(needed)

  await runTransaction(db, async (tx) => {
    // 1) En una transacción, primero se leen todos los documentos
    const snaps = await Promise.all(productIds.map((id) => tx.get(doc(db, 'products', id))))

    const fresh = {}
    snaps.forEach((snap, i) => {
      const id = productIds[i]
      if (!snap.exists()) throw new Error('Uno de los productos ya no está disponible.')
      const data = snap.data()
      if (data.stock < needed[id]) {
        throw new Error(`Stock insuficiente de ${data.team} (quedan ${data.stock}).`)
      }
      fresh[id] = data
    })

    // 2) Los precios salen de los datos frescos del servidor, no del carrito local
    const items = lines.map((l) => ({
      productId: l.productId,
      size: l.size,
      qty: l.qty,
      name: fresh[l.productId].name,
      team: fresh[l.productId].team,
      price: fresh[l.productId].price,
      art: fresh[l.productId].art,
    }))
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
    const shipping = shippingFor(subtotal)

    // 3) Después se escribe: bajar stock y crear el pedido
    productIds.forEach((id) => {
      tx.update(doc(db, 'products', id), { stock: fresh[id].stock - needed[id] })
    })
    tx.set(orderRef, {
      number,
      userId: user.uid,
      userName: user.displayName || '',
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'Preparando',
      createdAt: serverTimestamp(),
    })
  })

  return { id: orderRef.id, number }
}