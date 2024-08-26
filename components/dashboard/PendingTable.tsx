"use client"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { novaServer } from "@/lib/axios"
import { DicomInfo } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"


export default function PendingTable() {
  const [pendingList, setPendingList] = useState<DicomInfo[]>([])

  useEffect(() => {
    loadPedingList()
  }, [])
  const loadPedingList = useCallback(async () => {
    const { data } = await novaServer.get<DicomInfo[]>('/admin/dicoms/pending-list')
    setPendingList(data)
  }, [])

  return (
    <>
      <h1 className="pl-4 text-2xl mt-6 font-bold">Review Request</h1>
      <Card className="mt-6 mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">DicomId</TableHead>
              <TableHead>patientId</TableHead>
              <TableHead>Modality</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.patientId}</TableCell>
                <TableCell>{item.modality}</TableCell>
                <TableCell className="text-right">{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{pendingList.length ?? 0}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </>
  )
}

