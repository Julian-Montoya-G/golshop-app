import { IonApp } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <IonReactRouter>
              <AppRoutes />
            </IonReactRouter>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </IonApp>
  )
}