import { useNavigate } from 'react-router-dom'
import ChatRoom from '../../components/Chat/ChatRoom'
import Menu from '../../components/Shared/Menu'
import { useAuth } from '../../hooks/useAuth'

const QUICK = ['¿Tienen talla XL?', '¿Hacen envíos a Bogotá?', '¿Es original?']

export default function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <ChatRoom
      chatId={user.uid}
      from="user"
      title="Tienda Golazo"
      subtitle="● En línea · responde en minutos"
      onBack={() => navigate('/home', { replace: true })}
      quickReplies={QUICK}
      footer={<Menu />}
    />
  )
}