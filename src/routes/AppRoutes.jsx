import { IonRouterOutlet } from '@ionic/react'
import { Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/Shared/ProtectedRoute'
import Login from '../pages/Login/Login'
import { userRoutes } from './UserRoutes'
import { adminRoutes } from './AdminRoutes'

export default function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route path="/login" element={<Login />} />

      {userRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}

      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute adminOnly>{element}</ProtectedRoute>}
        />
      ))}

      <Route path="/" element={<Navigate to="/home" replace />} />
    </IonRouterOutlet>
  )
}