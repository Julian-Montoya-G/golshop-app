import { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
} from '@ionic/react'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '../../helpers/firebase'
import { PRODUCTS } from '../../helpers/golshopData'

export default function Admin() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const seedProducts = async () => {
    setBusy(true)
    setMessage('')
    try {
      const batch = writeBatch(db)
      PRODUCTS.forEach((p, i) => {
        batch.set(doc(db, 'products', p.id), { ...p, order: i })
      })
      await batch.commit()
      setMessage(`Listo: ${PRODUCTS.length} productos cargados.`)
    } catch (e) {
      setMessage('No se pudo cargar. ¿Tu usuario tiene rol admin y publicaste las reglas?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Administración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={seedProducts} disabled={busy}>
          {busy ? 'Cargando...' : 'Cargar productos de ejemplo'}
        </IonButton>
        {message && <p>{message}</p>}
      </IonContent>
    </IonPage>
  )
}