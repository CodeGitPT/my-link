import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface LinkData {
  id: string
  title: string
  url: string
  clicks?: number
  createdAt?: any
}

export function useLinks(uid?: string, sortBy: 'createdAt' | 'clicks' = 'createdAt') {
  const queryClient = useQueryClient()

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links', uid, sortBy],
    queryFn: async () => {
      if (!uid) return []
      const q = query(collection(db, "users", uid, "links"), orderBy(sortBy, "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkData[]
    },
    enabled: !!uid,
  })

  const addLinkMutation = useMutation({
    mutationFn: async (newLink: { title: string; url: string }) => {
      if (!uid) throw new Error("No user")
      const linksRef = collection(db, "users", uid, "links")
      const docRef = await addDoc(linksRef, {
        ...newLink,
        clicks: 0,
        createdAt: serverTimestamp()
      })
      return { id: docRef.id, clicks: 0, ...newLink }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    },
  })

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title: string; url: string } }) => {
      if (!uid) throw new Error("No user")
      const linkRef = doc(db, "users", uid, "links", id)
      await updateDoc(linkRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['links', uid] })
      const previousLinks = queryClient.getQueryData<LinkData[]>(['links', uid, sortBy])
      if (previousLinks) {
        queryClient.setQueryData<LinkData[]>(['links', uid, sortBy], old => 
          old?.map(link => link.id === id ? { ...link, ...data } : link)
        )
      }
      return { previousLinks }
    },
    onError: (err, variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links', uid, sortBy], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    },
  })

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!uid) throw new Error("No user")
      const linkRef = doc(db, "users", uid, "links", id)
      await deleteDoc(linkRef)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['links', uid] })
      const previousLinks = queryClient.getQueryData<LinkData[]>(['links', uid, sortBy])
      if (previousLinks) {
        queryClient.setQueryData<LinkData[]>(['links', uid, sortBy], old => 
          old?.filter(link => link.id !== id)
        )
      }
      return { previousLinks }
    },
    onError: (err, id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links', uid, sortBy], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    },
  })

  return {
    links,
    isLoading,
    addLink: addLinkMutation.mutateAsync,
    updateLink: updateLinkMutation.mutateAsync,
    deleteLink: deleteLinkMutation.mutateAsync,
  }
}
