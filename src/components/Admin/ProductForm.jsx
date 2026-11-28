import { useEffect, useState } from 'react'
import { IonModal, IonContent } from '@ionic/react'
import { deleteField } from 'firebase/firestore'
import ProductArt from '../Shared/ProductArt'
import { saveProduct } from '../../helpers/products'
import { SIZES } from '../../helpers/golshopData'
import styles from './ProductForm.module.scss'

const PALETTES = [
  { base: '#0B8A3E', secondary: '#FFFFFF', trim: '#FFFFFF', pattern: 'stripes' },
  { base: '#F7C600', secondary: '#F7C600', trim: '#1D3C8F', pattern: 'solid' },
  { base: '#C8102E', secondary: '#8A0A1F', trim: '#FFFFFF', pattern: 'sash' },
  { base: '#1846A3', secondary: '#1846A3', trim: '#FFFFFF', pattern: 'solid' },
  { base: '#111111', secondary: '#D4AF37', trim: '#D4AF37', pattern: 'band' },
  { base: '#FFFFFF', secondary: '#6CACE4', trim: '#1B2A4A', pattern: 'stripes' },
]

const EMPTY = {
  name: '',
  team: '',
  category: 'Camiseta',
  price: '',
  oldPrice: '',
  stock: '',
  sizes: ['S', 'M', 'L', 'XL'],
  badge: '',
  description: '',
  art: PALETTES[0],
}

const toNumber = (value) => Number(String(value).replace(/\D/g, ''))

export default function ProductForm({ isOpen, product, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Cada vez que se abre, se carga el producto a editar (o el formulario vacío)
  useEffect(() => {
    if (!isOpen) return
    setError('')
    setForm(
      product
        ? {
            name: product.name,
            team: product.team,
            category: product.category || 'Camiseta',
            price: String(product.price),
            oldPrice: product.oldPrice ? String(product.oldPrice) : '',
            stock: String(product.stock),
            sizes: product.sizes,
            badge: product.badge || '',
            description: product.description || '',
            art: product.art,
          }
        : EMPTY
    )
  }, [isOpen, product])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const changeCategory = (category) =>
    set({ category, sizes: category === 'Accesorio' ? ['Única'] : ['S', 'M', 'L', 'XL'] })

  const toggleSize = (size) => {
    const has = form.sizes.includes(size)
    if (has && form.sizes.length === 1) return // al menos una talla
    set({ sizes: has ? form.sizes.filter((s) => s !== size) : [...form.sizes, size] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const price = toNumber(form.price)
    const oldPrice = toNumber(form.oldPrice)
    const stock = toNumber(form.stock)

    if (!form.name.trim() || !form.team.trim()) return setError('Escribe el nombre y el equipo.')
    if (!price) return setError('Escribe un precio válido.')
    if (form.stock === '') return setError('Escribe el stock disponible.')
    if (oldPrice && oldPrice <= price) return setError('El precio anterior debe ser mayor al actual.')

    setSaving(true)
    setError('')
    try {
      const id = product?.id ?? `prod-${Date.now()}`
      await saveProduct(id, {
        name: form.name.trim(),
        team: form.team.trim(),
        category: form.category,
        price,
        oldPrice: oldPrice || deleteField(),
        stock,
        sizes: form.sizes,
        badge: form.badge.trim() || deleteField(),
        description: form.description.trim() || 'Producto agregado desde el panel de administración.',
        art: form.art,
        rating: product?.rating ?? 5,
        order: product?.order ?? nextOrder,
      })
      onSaved(product ? 'Producto actualizado' : 'Producto creado')
      onClose()
    } catch {
      setError('No se pudo guardar. Revisa tu conexión y tus permisos.')
    } finally {
      setSaving(false)
    }
  }

  const sameArt = (pal) => JSON.stringify(pal) === JSON.stringify(form.art)

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.92}
      breakpoints={[0, 0.92]}
      className={styles.modal}
    >
      <IonContent>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
          <p className={styles.sub}>Los cambios se ven al instante en la tienda.</p>

          <div className={styles.preview}>
            <ProductArt art={form.art} />
          </div>
          <div className={styles.palettes}>
            {PALETTES.map((pal, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Colores ${i + 1}`}
                className={`${styles.swatch} ${sameArt(pal) ? styles.swatchOn : ''}`}
                style={{ background: `linear-gradient(135deg, ${pal.base} 50%, ${pal.secondary} 50%)` }}
                onClick={() => set({ art: pal })}
              />
            ))}
          </div>

          <label className={styles.field}>
            <span>Nombre</span>
            <input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Camiseta Local 2026"
            />
          </label>

          <label className={styles.field}>
            <span>Equipo</span>
            <input
              value={form.team}
              onChange={(e) => set({ team: e.target.value })}
              placeholder="Deportivo Cali"
            />
          </label>

          <div className={styles.field}>
            <span>Categoría</span>
            <div className={styles.chips}>
              {['Camiseta', 'Accesorio'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.chip} ${form.category === c ? styles.chipOn : ''}`}
                  onClick={() => changeCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Precio (COP)</span>
              <input
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
                placeholder="249900"
              />
            </label>
            <label className={styles.field}>
              <span>Precio anterior</span>
              <input
                inputMode="numeric"
                value={form.oldPrice}
                onChange={(e) => set({ oldPrice: e.target.value })}
                placeholder="Opcional"
              />
            </label>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Stock</span>
              <input
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => set({ stock: e.target.value })}
                placeholder="10"
              />
            </label>
            <label className={styles.field}>
              <span>Etiqueta</span>
              <input
                value={form.badge}
                onChange={(e) => set({ badge: e.target.value })}
                placeholder="Nuevo"
              />
            </label>
          </div>

          {form.category === 'Camiseta' && (
            <div className={styles.field}>
              <span>Tallas disponibles</span>
              <div className={styles.chips}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.chip} ${form.sizes.includes(s) ? styles.chipOn : ''}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className={styles.field}>
            <span>Descripción</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Cuéntales a tus clientes de qué se trata."
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={saving}>
            {saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>
      </IonContent>
    </IonModal>
  )
}