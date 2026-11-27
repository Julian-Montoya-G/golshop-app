import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Index() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GolShop</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        Hola {user?.displayName || user?.email} ⚽
      </IonContent>
    </IonPage>
  )
}