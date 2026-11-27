import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon } from '@ionic/react'
import {
  mailOutline,
  lockClosedOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons'
import ProductArt from '../../components/Shared/ProductArt'
import GolShopLogo from '../../components/Shared/GolShopLogo'
import { useAuth } from '../../hooks/useAuth'
import { getAuthErrorMessage } from '../../helpers/helpers'
import { ART } from '../../helpers/golshopData'
import styles from './Login.module.scss'

function Field({ icon, label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.control}>
        <IonIcon icon={icon} className={styles.fieldIcon} />
        {children}
      </span>
    </label>
  )
}

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'

  const changeMode = (m) => {
    setMode(m)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLogin && name.trim().length < 2) return setError('Escribe tu nombre.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Escribe un correo válido.')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')

    setError('')
    setBusy(true)
    try {
      if (isLogin) await login(email, password)
      else await register(name.trim(), email, password)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <IonPage>
      <IonContent>
        <section className={styles.hero}>
          <div className={styles.logoWrap}>
            <GolShopLogo />
          </div>
          <div className={styles.heroMain}>
            <ProductArt art={ART.colombia} float />
          </div>
          <div className={styles.heroSide}>
            <ProductArt art={ART.nacional} />
          </div>
          <div className={styles.heroLeft}>
            <ProductArt art={ART.balon} />
          </div>
          <div className={styles.fade} />
        </section>

        <section className={styles.content}>
          <h1 className={styles.title}>
            {isLogin ? '¡Bienvenido de vuelta!' : 'Únete a la hinchada'}
          </h1>
          <p className={styles.tagline}>Las camisetas de tu equipo, a un toque de distancia.</p>

          <div className={styles.tabs}>
            {[
              ['login', 'Ingresar'],
              ['registro', 'Registrarse'],
            ].map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => changeMode(m)}
                className={`${styles.tab} ${mode === m ? styles.tabActive : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {!isLogin && (
              <Field icon={personOutline} label="Nombre completo">
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Julián Montoya"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field icon={mailOutline} label="Correo electrónico">
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@gmail.com"
                autoComplete="email"
              />
            </Field>

            <Field icon={lockClosedOutline} label="Contraseña">
              <input
                className={`${styles.input} ${styles.inputPass}`}
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} />
              </button>
            </Field>

            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? 'Un momento...' : isLogin ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.switch}>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              type="button"
              className={styles.switchLink}
              onClick={() => changeMode(isLogin ? 'registro' : 'login')}
            >
              {isLogin ? 'Regístrate gratis' : 'Ingresa aquí'}
            </button>
          </p>
        </section>
      </IonContent>
    </IonPage>
  )
}