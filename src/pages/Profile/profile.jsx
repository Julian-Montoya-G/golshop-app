import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonPage, IonContent, IonIcon, IonSpinner, useIonToast } from '@ionic/react'
import {
  camera as cameraIcon,
  locationOutline,
  chevronForward,
  cubeOutline,
  chatbubbleEllipsesOutline,
  shieldCheckmarkOutline,
  shieldCheckmark,
  logOutOutline,
  mapOutline,
} from 'ionicons/icons'
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import Menu from '../../components/Shared/Menu'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useOrders } from '../../hooks/useOrders'
import { useProfile } from '../../hooks/useProfile'
import { getInitials, resizeImage } from '../../helpers/helpers'
import { reverseGeocode } from '../../helpers/geo'
import styles from './Profile.module.scss'

function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  )
}

function MenuLink({ icon, label, hint, gold = false, onClick }) {
  return (
    <button type="button" className={styles.link} onClick={onClick}>
      <span className={`${styles.linkIcon} ${gold ? styles.linkIconGold : ''}`}>
        <IonIcon icon={icon} />
      </span>
      <span className={styles.linkLabel}>{label}</span>
      {hint && <span className={styles.linkHint}>{hint}</span>}
      <IonIcon icon={chevronForward} className={styles.chevron} />
    </button>
  )
}

export default function Profile() {
  const { user, role, logout } = useAuth()
  const { profile, saveProfile } = useProfile()
  const { orders } = useOrders()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [present] = useIonToast()

  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState(null)
  const [locating, setLocating] = useState(false)
  const [saving, setSaving] = useState(false)

  const name = profile?.name || user?.displayName || 'Hincha'
  const savedAddress = profile?.address || ''
  const dirty = address.trim() !== savedAddress

  // Cuando llega la dirección guardada, la mostramos en el campo
  useEffect(() => {
    setAddress(savedAddress)
  }, [savedAddress])

  const toast = (message, color = 'success') =>
    present({ message, duration: 2200, color, position: 'top' })

  const handlePhoto = async () => {
    try {
      const shot = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        direction: CameraDirection.Front,
        promptLabelHeader: 'Foto de perfil',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto',
        promptLabelCancel: 'Cancelar',
      })
      const small = await resizeImage(shot.dataUrl, 256, 0.8)
      await saveProfile({ photoURL: small })
      toast('Foto actualizada')
    } catch (e) {
      // Si la persona cierra la cámara sin elegir nada, no es un error
      if (String(e?.message || e).toLowerCase().includes('cancel')) return
      toast('No se pudo actualizar la foto.', 'danger')
    }
  }

  const detectLocation = async () => {
    setLocating(true)
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      })
      const { latitude, longitude } = pos.coords
      setCoords({ lat: latitude, lng: longitude })

      let text = ''
      try {
        text = await reverseGeocode(latitude, longitude)
      } catch {
        // Si falla el servicio de direcciones, dejamos las coordenadas
      }
      setAddress(text || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
      toast('Ubicación detectada. Revisa la dirección y guárdala.')
    } catch {
      toast('No pudimos obtener tu ubicación. Revisa los permisos.', 'danger')
    } finally {
      setLocating(false)
    }
  }

  const handleSaveAddress = async () => {
    setSaving(true)
    try {
      await saveProfile({
        address: address.trim(),
        ...(coords && { location: coords }),
      })
      toast('Dirección guardada')
    } catch {
      toast('No se pudo guardar la dirección.', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const openMap = () => {
    const loc = coords || profile?.location
    if (!loc) return
    window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const activeOrders = orders.filter(
    (o) => o.status === 'Preparando' || o.status === 'En camino'
  ).length

  return (
    <IonPage>
      <IonContent>
        <section className={styles.hero}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Foto de perfil" />
                ) : (
                  <span>{getInitials(name)}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              className={styles.camBtn}
              aria-label="Cambiar foto"
              onClick={handlePhoto}
            >
              <IonIcon icon={cameraIcon} />
            </button>
          </div>

          <h1 className={styles.name}>{name}</h1>
          <p className={styles.email}>{user?.email}</p>
          <span className={styles.badge}>
            <IonIcon icon={shieldCheckmark} />
            {role === 'admin' ? 'Vendedor' : 'Hincha'}
          </span>

          <div className={styles.stats}>
            <Stat value={orders.length} label="Pedidos" />
            <Stat value={activeOrders} label="Activos" />
            <Stat value={cartCount} label="En carrito" />
          </div>
        </section>

        <div className={styles.body}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Dirección de envío</h2>
            <div className={styles.addressRow}>
              <textarea
                className={styles.textarea}
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Escribe tu dirección o usa tu ubicación"
                aria-label="Dirección"
              />
              <button
                type="button"
                className={styles.pin}
                aria-label="Usar mi ubicación"
                onClick={detectLocation}
                disabled={locating}
              >
                {locating ? <IonSpinner name="crescent" /> : <IonIcon icon={locationOutline} />}
              </button>
            </div>
            <p className={styles.hint}>
              {locating ? 'Obteniendo tu ubicación…' : 'Toca el pin para usar tu ubicación actual.'}
            </p>

            <div className={styles.addressActions}>
              {(coords || profile?.location) && (
                <button type="button" className={styles.mapBtn} onClick={openMap}>
                  <IonIcon icon={mapOutline} /> Ver en el mapa
                </button>
              )}
              {dirty && (
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSaveAddress}
                  disabled={saving}
                >
                  {saving ? 'Guardando…' : 'Guardar dirección'}
                </button>
              )}
            </div>
          </section>

          <section className={styles.links}>
            <MenuLink
              icon={cubeOutline}
              label="Mis pedidos"
              hint={activeOrders > 0 ? `${activeOrders} activos` : undefined}
              onClick={() => navigate('/orders')}
            />
            <MenuLink
              icon={chatbubbleEllipsesOutline}
              label="Mensajes"
              hint="Tienda Golazo"
              onClick={() => navigate('/chat', { replace: true })}
            />
            {role === 'admin' && (
              <MenuLink
                icon={shieldCheckmarkOutline}
                label="Panel Admin"
                hint="Vendedor"
                gold
                onClick={() => navigate('/admin')}
              />
            )}
          </section>

          <button type="button" className={styles.logout} onClick={handleLogout}>
            <IonIcon icon={logOutOutline} /> Cerrar sesión
          </button>
        </div>
      </IonContent>
      <Menu />
    </IonPage>
  )
}