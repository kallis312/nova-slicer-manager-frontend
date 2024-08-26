import DicomTable from "@/components/dicom/DicomTable";
import { Suspense } from 'react'


export default function DashboardPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="container sm:px-4 overflow-auto h-full">
        <Suspense>
          <DicomTable />
        </Suspense>
      </div>
    </div>
  )
}