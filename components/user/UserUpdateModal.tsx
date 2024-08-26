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
import { useCallback, useEffect, useState } from "react"
import { AxiosError } from "axios"
import { UserInfo } from "@/lib/types"


const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  role: z.enum(['ADMIN', 'USER']),
})
  .strict()

type Props = {
  loadUserData: () => void
  onUpdateModalClose: (val: boolean) => void
  user: UserInfo | null
}



export default function UserUpdateModal({
  loadUserData,
  onUpdateModalClose,
  user = null
}: Props) {

  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      form.reset({
        username: user?.username ?? '',
        role: user?.role ?? 'USER',
      })
    }
  }, [user])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username ?? '',
      role: user?.role ?? 'USER',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const { data } = await novaServer.put(`/admin/users/${user?.id}`, values);
      toast({
        title: "Successfully",
        description: values.username + " updated",
      })
      setLoading(false)
      loadUserData()
      console.log("User updated successfully:", data)
    } catch (error) {
      setLoading(false)
      toast({
        title: "Error",
        description: error instanceof AxiosError ? error.response?.data.message : "User update failed",
      })
      console.error(error instanceof Error ? error.message : "User update failed")
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={onUpdateModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <DialogHeader>
              <DialogTitle>Update user</DialogTitle>
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