"use client"
import { novaServer } from "@/lib/axios"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

type User = {
  username: string,
  role: 'ADMIN' | 'USER'
}

const AuthContext = createContext<{
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  user: null,
  setUser: () => { },
})

type AuthProviderProps = {
  children: React.ReactNode
}

export const useAuthProvider = () => useContext(AuthContext)

export default function AuthProvider({
  children
}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.token;
    const role = localStorage.role;
    const username = localStorage.username;
    if (token) {
      setIsAuthenticated(true)
      setUser({
        username,
        role
      })
      novaServer.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      router.push('/login')
    }
  }, [])
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser
      }}
    >
      {
        children
      }
    </AuthContext.Provider>
  )
}