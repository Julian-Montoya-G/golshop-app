import Admin from '../pages/Admin/Admin'
import AdminChats from '../pages/Admin/AdminChats'
import AdminChat from '../pages/Admin/AdminChat'

export const adminRoutes = [
  { path: '/admin', element: <Admin /> },
  { path: '/admin/chats', element: <AdminChats /> },
  { path: '/admin/chats/:uid', element: <AdminChat /> },
]