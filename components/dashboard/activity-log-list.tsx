interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  // Add other relevant fields
}

export function ActivityLogList({ logs }: { logs: ActivityLog[] }) {
  return (
    <ul className="space-y-2">
      {logs.map((log) => (
        <li key={log.id} className="border-b pb-2">
          <p><strong>{log.action}</strong></p>
          <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
