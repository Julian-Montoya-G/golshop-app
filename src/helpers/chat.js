import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Guarda el mensaje y actualiza el resumen del chat (último mensaje) en una sola operación.
 * from: 'user' (cliente) o 'seller' (vendedor/admin)
 */
export async function sendMessage({ chatId, from, text, sender }) {
  const clean = text.trim().slice(0, 500)
  if (!clean) return

  const chatRef = doc(db, 'chats', chatId)
  const messageRef = doc(collection(chatRef, 'messages'))

  const summary = { lastMessage: clean, lastFrom: from, lastAt: serverTimestamp() }
  if (from === 'user') {
    summary.userId = chatId
    summary.userName = sender.displayName || sender.email
  }

  const batch = writeBatch(db)
  batch.set(messageRef, {
    text: clean,
    from,
    senderId: sender.uid,
    createdAt: serverTimestamp(),
  })
  batch.set(chatRef, summary, { merge: true })
  await batch.commit()
}