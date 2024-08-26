"use client"

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
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
import { novaServer } from "@/lib/axios"
import { DicomInfo } from "@/lib/types"
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"


export type DicomInfoResponse = {
  page: number
  total: number
  perPage: number
  dicoms: DicomInfo[]
}

export default function DicomTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<DicomInfoResponse | null>(null)
  const searchParam = useSearchParams()
  const router = useRouter()
  const page = Number(searchParam.get('page') ?? 1)

  useEffect(() => {
    loadUserData(page)
  }, [page])

  const loadUserData = useCallback(async (pn?: number) => {
    try {
      const dicoms = await novaServer.get<DicomInfoResponse>(`/dicom/list/${pn ?? 1}`)
      setData(dicoms.data)
    } catch (error) {
      console.error("Failed to load user data:", error)
      setData(null)
    }
  }, [])

  const columns: ColumnDef<DicomInfo>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DicomId
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "patientId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PatientId
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("patientId")}</div>,
    },
    {
      accessorKey: "modality",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Modality
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("modality")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="uppercase">
          <Badge variant={
            row.getValue("status") === "unannotated" ?
              "default" : "outline"
          }>
            {
              row.getValue("status")
            }
          </Badge>
        </div>
      },
    },
    {
      accessorKey: "studyDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            StudyDate
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("studyDate"))
        return <div className="lowercase">{
          date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          })
        }</div>
      },
    }
  ]

  const table = useReactTable({
    data: data?.dicoms || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full flex flex-col h-full overflow-auto py-4">
      <div>
        {data?.total}
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
      <div className="py-4 flex">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant={'ghost'}
                onClick={() => {
                  router.replace(`dicoms?page=${Math.max(1, page - 1)}`)
                }}
                disabled={1 === page}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Input
                type="number"
                min="1"
                max={data ? Math.floor(data.total / data.perPage) : 1}
                defaultValue={page ?? 1}
                value={page ?? 1}
                onChange={e => {
                  const pg = e.target.value ? Number(e.target.value) : 1
                  if (pg > 0 && pg <= Math.floor(data ? data.total / data.perPage : 1)) {
                    router.replace(`dicoms?page=${pg}`)
                  }
                }}
                className="border p-1 rounded w-12"
              />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant={'ghost'}
                onClick={() => {
                  router.replace(`dicoms?page=${Math.min(Math.floor(data ? data.total / data.perPage : 1), page + 1)}`)
                }}
                disabled={data?.total === page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div >
  )
}
