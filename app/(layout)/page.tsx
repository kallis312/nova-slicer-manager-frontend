import AnalysisPannel from "@/components/dashboard/AnalysisPannel"
import PendingTable from "@/components/dashboard/PendingTable"


export default function HomePage() {
  return (
    <div className="h-full overflow-auto">
      <div className="container sm:px-4 overflow-auto h-full pt-10 md:pt-8">
        <AnalysisPannel />
        <PendingTable />
      </div>
    </div>
  )
}
