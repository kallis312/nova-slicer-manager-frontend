"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { novaServer } from "@/lib/axios"
import { useEffect, useState } from "react"
type Analysis = {
  pending: number
  dicoms: number
  annotated: number
  unannotated: number
}

export default function AnalysisPannel() {
  const [analysis, setAnalysis] = useState<Analysis>({
    pending: 0,
    dicoms: 0,
    annotated: 0,
    unannotated: 0,
  })
  useEffect(() => {
    const loadAnalysis = async () => {
      const { data } = await novaServer.get<Analysis>('/admin/dicoms/analysis')
      setAnalysis(data)
    }
    loadAnalysis()
  }, [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-opacity-50">Total Dicoms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right text-4xl font-semibold">{analysis.dicoms}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-opacity-50">Annotated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right text-4xl font-semibold">{analysis.annotated}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-opacity-50">Unannotated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right text-4xl font-semibold">{analysis.unannotated}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-opacity-50">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right text-4xl font-semibold">{analysis.pending}</p>
        </CardContent>
      </Card>
    </div>
  )
}