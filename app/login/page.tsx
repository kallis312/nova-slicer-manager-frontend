"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from 'axios'

import { z } from "zod"
import { novaServer } from "@/lib/axios"
import { useAuthProvider } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
})

export default function LoginPage() {
  const { setUser, setIsAuthenticated, isAuthenticated } = useAuthProvider()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isAuthenticated)
      router.replace('/')
  }, [isAuthenticated])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await novaServer.post<{
        username: string
        role: 'ADMIN' | 'USER'
        token: string
      }>('/auth/login', values);
      novaServer.defaults.headers.common.Authorization = `Bearer ${data.token}`
      localStorage.token = data.token
      localStorage.username = data.username
      localStorage.role = data.role
      setUser({
        username: data.username,
        role: data.role,
      });
      setIsAuthenticated(true)
      router.replace('/')
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Login failed")
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Input username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Input password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign in</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
