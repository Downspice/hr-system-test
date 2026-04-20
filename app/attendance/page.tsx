export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <p className="text-muted-foreground">Track employee work hours and punctuality.</p>
      <div className="rounded-xl border bg-card p-6 shadow">
        <h2 className="text-lg font-medium">Daily Log - {new Date().toLocaleDateString()}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Employee</th>
                <th className="pb-2">Check In</th>
                <th className="pb-2">Check Out</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Joe Doe</td>
                <td className="py-2">08:55 AM</td>
                <td className="py-2">-</td>
                <td className="py-2"><span className="text-green-500">Present</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Jane Smith</td>
                <td className="py-2">09:05 AM</td>
                <td className="py-2">-</td>
                <td className="py-2"><span className="text-amber-500">Late</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
