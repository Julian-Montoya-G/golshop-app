import Index from '../pages/Index/Index'
import Cart from '../pages/Cart/Cart'
import Chat from '../pages/Chat/Chat'
import Profile from '../pages/Profile/Profile'

export const userRoutes = [
  { path: '/home', element: <Index /> },
  { path: '/cart', element: <Cart /> },
  { path: '/chat', element: <Chat /> },
  { path: '/profile', element: <Profile /> },
]