export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="text-muted-foreground">Manage departments and organigrams.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium">Engineering</div>
          <div className="mt-2 text-2xl font-bold">45 Members</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium">Marketing</div>
          <div className="mt-2 text-2xl font-bold">22 Members</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
          <div className="text-sm font-medium">Human Resources</div>
          <div className="mt-2 text-2xl font-bold">8 Members</div>
        </div>
      </div>
    </div>
  )
}
