// API pública de OpenStreetMap (Nominatim). Sin clave; úsala con pocas peticiones.
export async function reverseGeocode(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
    `&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`
  const res = await fetch(url)
  if (!res.ok) throw new Error('No se pudo obtener la dirección')
  const data = await res.json()

  const a = data.address || {}
  const street = [a.road, a.house_number].filter(Boolean).join(' ')
  const city = a.city || a.town || a.village || a.municipality
  const short = [street, a.suburb || a.neighbourhood, city, a.state].filter(Boolean).join(', ')

  return short || data.display_name || ''
}