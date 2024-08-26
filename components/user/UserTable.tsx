"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronLeft, ChevronRight, FilePenLine, MoreHorizontal, Search, Trash2 } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { novaServer } from "@/lib/axios"
import { UserInfo } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"
import UserCreateModal from "./UserCreateModal"
import UserUpdateModal from "./UserUpdateModal"


export type UserInfoResponse = {
  page: number
  total: number
  perPage: number
  users: UserInfo[]
}

export default function UserTable() {
  const [deleteUser, setDeleteUser] = useState<UserInfo | null>(null)
  const [updateUser, setUpdateUser] = useState<UserInfo | null>(null)
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<UserInfoResponse | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20
  })

  const onUpdateModalClose = useCallback((val: boolean) => {
    if (!val)
      setUpdateUser(null)
  }, [])

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = useCallback(async () => {
    try {
      const users = await novaServer.get<UserInfoResponse>(`/admin/users?limit=1000`)
      setData(users.data)
    } catch (error) {
      console.error("Failed to load user data:", error)
      setData(null)
    }
  }, [])

  const onDeleteUser = useCallback(async (usr: UserInfo | null) => {
    try {
      await novaServer.delete(`/admin/users/${usr?.id}`)
      setData((prevData) => (
        prevData ?
          {
            ...prevData,
            users: prevData.users.filter((user) => user.id !== usr?.id)
          } : null
      ))
      setDeleteUser(null)
      toast({
        title: "Successfully",
        description: usr?.username + " deleted successfully",
      })
    } catch (error) {
      setDeleteUser(null)
      toast({
        title: "Error",
        description: usr?.username + " deleted fail.",
      })
      console.error("Failed to delete user:", error)
    }
  }, [])

  const columns: ColumnDef<UserInfo>[] = [
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <Badge variant={row.getValue("role") === 'ADMIN' ?
            'destructive' :
            'outline'
          }>
            {row.getValue("role")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase break-all">{row.getValue("username")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setUpdateUser(user)}
                >
                  <FilePenLine className="w-4 h-4 mr-1" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteUser(user)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data?.users || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination
    },
  })

  return (
    <div className="w-full flex flex-col h-full overflow-auto">
      <div className="flex items-center py-4 gap-8">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("username")?.setFilterValue(event.target.value)
            }
            className="w-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <UserCreateModal loadUserData={loadUserData} />
        </div>
      </div>
      <Card className="md:p-1 h-full overflow-auto">
        <ScrollArea className="h-full pr-3">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="p-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="p-2"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
      <div className="py-4 flex">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant={'ghost'}
                onClick={table.previousPage}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                value={pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-12"
              />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant={'ghost'}
                onClick={table.nextPage}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(val: boolean) => {
          if (!val) setDeleteUser(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => await onDeleteUser(deleteUser)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserUpdateModal loadUserData={loadUserData} user={updateUser} onUpdateModalClose={onUpdateModalClose} />
    </div >
  )
}
