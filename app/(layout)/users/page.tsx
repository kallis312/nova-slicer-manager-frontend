
import UserTable from "@/components/user/UserTable"

export default function UsersPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="container sm:px-4 overflow-auto h-full">
        <UserTable />
      </div>
    </div>
  )
}

