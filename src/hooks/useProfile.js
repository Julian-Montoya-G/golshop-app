import { useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../helpers/firebase'
import { useAuth } from './useAuth'

export function useProfile() {
  const { user } = useAuth()
  const uid = user?.uid
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!uid) {
      setProfile(null)
      return
    }
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => setProfile(snap.exists() ? snap.data() : {}),
      () => setProfile({})
    )
  }, [uid])

  const saveProfile = (data) => updateDoc(doc(db, 'users', uid), data)

  return { profile, saveProfile }
}