import { useNavigate, useParams } from 'react-router-dom'
import ChatRoom from '../../components/Chat/ChatRoom'
import { useChats } from '../../hooks/useChats'

const QUICK = ['¡Hola! ¿En qué te ayudo?', 'Sí, tenemos disponibilidad.', 'Tu pedido sale hoy.']

export default function AdminChat() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const { chats } = useChats()
  const chat = chats.find((c) => c.id === uid)

  return (
    <ChatRoom
      chatId={uid}
      from="seller"
      title={chat?.userName || 'Cliente'}
      subtitle="Conversación con el cliente"
      onBack={() => navigate('/admin/chats', { replace: true })}
      quickReplies={QUICK}
    />
  )
}