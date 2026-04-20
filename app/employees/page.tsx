export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Employees</h1>
      <p className="text-muted-foreground">Manage your organization's employees here.</p>
      {/* Employee list/table will go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium text-muted-foreground">Total Employees</div>
          <div className="mt-2 text-3xl font-bold">124</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="mt-2 text-3xl font-bold">120</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium text-muted-foreground">On Leave</div>
          <div className="mt-2 text-3xl font-bold">4</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium text-muted-foreground">New Hires</div>
          <div className="mt-2 text-3xl font-bold">12</div>
        </div>
      </div>
    </div>
  )
}
