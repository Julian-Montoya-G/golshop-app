import { deleteDoc, doc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { PRODUCTS } from './golshopData'

// merge: true crea el producto si no existe o actualiza solo los campos enviados
export const saveProduct = (id, data) =>
  setDoc(doc(db, 'products', id), data, { merge: true })

export const deleteProduct = (id) => deleteDoc(doc(db, 'products', id))

// Carga el catálogo de ejemplo (solo para empezar con la tienda vacía)
export async function seedProducts() {
  const batch = writeBatch(db)
  PRODUCTS.forEach((p, i) => {
    batch.set(doc(db, 'products', p.id), { ...p, order: i })
  })
  await batch.commit()
  return PRODUCTS.length
}