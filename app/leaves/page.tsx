export default function LeavesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Leaves & Time Off</h1>
      <p className="text-muted-foreground">Manage employee leave requests and balances.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow">
          <h2 className="text-lg font-medium">Pending Requests</h2>
          <div className="mt-4 text-center py-8 text-muted-foreground">
            No pending leave requests.
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <h2 className="text-lg font-medium">Leave Calendar Overview</h2>
          <div className="mt-4 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span>Joe Doe (Sick Leave)</span>
              <span>Ends in 2 days</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Jane Smith (Annual)</span>
              <span>Starts in 5 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
