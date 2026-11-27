import { IonPage, IonContent, IonButton } from '@ionic/react'
import { useNavigate } from 'react-router-dom'
import Menu from '../../components/Shared/Menu'
import { useAuth } from '../../hooks/useAuth'

export default function Profile() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>{user?.displayName}</h2>
        <p>{user?.email}</p>

        <IonButton expand="block" onClick={() => navigate('/orders')}>
          Mis pedidos
        </IonButton>

        {role === 'admin' && (
          <IonButton expand="block" color="secondary" onClick={() => navigate('/admin')}>
            Panel de administración
          </IonButton>
        )}

        <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
          Salir
        </IonButton>
      </IonContent>
      <Menu />
    </IonPage>
  )
}