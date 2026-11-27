import Dexie from 'dexie'

export const localDb = new Dexie('golshop')

localDb.version(1).stores({
  // Clave compuesta: un registro por usuario + producto + talla
  cart: '[userId+productId+size], userId',
})