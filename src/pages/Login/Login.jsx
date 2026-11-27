import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonInput, IonButton, IonText } from '@ionic/react'
import { useAuth } from '../../hooks/useAuth'
import { getAuthErrorMessage } from '../../helpers/helpers'
import styles from './Login.module.scss'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async () => {
    setError('')
    setBusy(true)
    try {
      if (isRegister) await register(name, email, password)
      else await login(email, password)
      navigate('/home', { replace: true })
    } catch (e) {
      setError(getAuthErrorMessage(e.code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className={styles.container}>
          <h1 className={styles.title}>GolShop ⚽</h1>
          <p className={styles.subtitle}>
            {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
          </p>

          {isRegister && (
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              value={name}
              onIonInput={(e) => setName(e.detail.value ?? '')}
              className={styles.input}
            />
          )}

          <IonInput
            label="Correo"
            labelPlacement="floating"
            fill="outline"
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
            className={styles.input}
          />

          <IonInput
            label="Contraseña"
            labelPlacement="floating"
            fill="outline"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
            className={styles.input}
          />

          {error && <IonText color="danger"><p>{error}</p></IonText>}

          <IonButton expand="block" onClick={handleSubmit} disabled={busy}>
            {isRegister ? 'Registrarme' : 'Entrar'}
          </IonButton>

          <IonButton
            fill="clear"
            expand="block"
            onClick={() => setMode(isRegister ? 'login' : 'register')}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}