import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { User } from "firebase/auth"

export interface UserProfile {
  username: string
  bio: string
  displayName: string
}

export function useProfile(user: User | null) {
  const queryClient = useQueryClient()
  const uid = user?.uid

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      if (!uid || !user) return null
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          username: data.username || user.displayName || "Guest",
          bio: data.bio || "소개글을 입력해주세요.",
          displayName: data.displayName || user.email?.split('@')[0] || "guest"
        } as UserProfile
      } else {
        const newProfile = {
          username: user.displayName || "Guest",
          bio: "소개글을 입력해주세요.",
          displayName: user.email?.split('@')[0] || "guest",
          createdAt: serverTimestamp()
        }
        await setDoc(userRef, newProfile)
        return {
          username: newProfile.username,
          bio: newProfile.bio,
          displayName: newProfile.displayName,
        } as UserProfile
      }
    },
    enabled: !!uid,
  })

  const updateProfileMutation = useMutation({
    mutationFn: async ({ field, value }: { field: keyof UserProfile; value: string }) => {
      if (!uid) throw new Error("No user")
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, { [field]: value })
    },
    onMutate: async ({ field, value }) => {
      await queryClient.cancelQueries({ queryKey: ['profile', uid] })
      const previousProfile = queryClient.getQueryData(['profile', uid])
      queryClient.setQueryData(['profile', uid], (old: any) => ({
        ...old,
        [field]: value
      }))
      return { previousProfile }
    },
    onError: (err, newProfile, context) => {
      queryClient.setQueryData(['profile', uid], context?.previousProfile)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', uid] })
    },
  })

  const checkDisplayNameUnique = async (newDisplayName: string) => {
    if (!uid) return false
    const q = query(collection(db, "users"), where("displayName", "==", newDisplayName))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return true
    if (snapshot.docs.length === 1 && snapshot.docs[0].id === uid) return true
    return false
  }

  return {
    profile: profile || { username: "Guest", bio: "", displayName: "guest" },
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    checkDisplayNameUnique
  }
}
