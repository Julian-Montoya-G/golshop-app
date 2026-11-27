import { Navigate } from 'react-router-dom'
import { IonSpinner } from '@ionic/react'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth()

  if (loading) return <IonSpinner />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && role !== 'admin') return <Navigate to="/home" replace />

  return children
}