import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, RotateCw, Save } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { z } from "zod"
import { novaServer } from "@/lib/axios"
import { useState } from "react"
import { AxiosError } from "axios"


const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  role: z.enum(['ADMIN', 'USER']),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  confirmPassword: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
})
  .strict()
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path of the error
  });


type Props = {
  loadUserData: () => void
}


export default function UserCreateModal({
  loadUserData
}: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: 'USER',
      password: "",
      confirmPassword: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const { data } = await novaServer.post('/admin/users', values);
      toast({
        title: "Successfully",
        description: values.username + " created",
      })
      form.reset({
        username: "",
        role: 'USER',
        password: "",
        confirmPassword: "",
      })
      setLoading(false)
      loadUserData()
      console.log("User created successfully:", data)
    } catch (error) {
      setLoading(false)
      toast({
        title: "Error",
        description: error instanceof AxiosError ? error.response?.data.message : "User creation failed",
      })
      console.error(error instanceof Error ? error.message : "User creation failed")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add User
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <DialogHeader>
              <DialogTitle>Add new user</DialogTitle>
              <DialogDescription>
                Add new user to nova slicer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Username</FormLabel>
                      <FormControl
                        className="col-span-3">
                        <Input
                          placeholder="Input username"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="col-span-3">
                          <SelectTrigger id="role" className="col-span-3">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="USER">USER</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Password</FormLabel>
                      <FormControl
                        className="col-span-3">
                        <Input
                          placeholder="Input password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl
                        className="col-span-3">
                        <Input
                          placeholder="Input confirm password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button className="gap-2" type="submit" disabled={loading}>
                {
                  loading ?
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" /> :
                    <Save className="w-4 h-4 mr-2 " />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}