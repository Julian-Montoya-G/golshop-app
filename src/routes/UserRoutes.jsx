import Index from '../pages/Index/Index'
import Product from '../pages/Product/Product'
import Cart from '../pages/Cart/Cart'
import Orders from '../pages/Orders/Orders'
import Chat from '../pages/Chat/Chat'
import Profile from '../pages/Profile/Profile'

export const userRoutes = [
  { path: '/home', element: <Index /> },
  { path: '/product/:id', element: <Product /> },
  { path: '/cart', element: <Cart /> },
  { path: '/orders', element: <Orders /> },
  { path: '/chat', element: <Chat /> },
  { path: '/profile', element: <Profile /> },
]