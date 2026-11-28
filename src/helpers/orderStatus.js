import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export const ORDER_STATUSES = ['Preparando', 'En camino', 'Entregado', 'Cancelado']

export const updateOrderStatus = (orderId, status) =>
  updateDoc(doc(db, 'orders', orderId), { status })