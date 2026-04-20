export default function RolesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Roles & Permissions</h1>
      <p className="text-muted-foreground">Define roles and access levels for your team.</p>
      <div className="rounded-xl border bg-card p-6 shadow">
        <h2 className="text-lg font-medium">Standard Roles</h2>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center justify-between border-b pb-2">
            <span>Administrator</span>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Full Access</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span>HR Manager</span>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">HR Management</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span>Team Lead</span>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Team Oversight</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Employee</span>
            <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">Self Service</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
