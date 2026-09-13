import { formatValue } from "@/lib/formatters";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
}

export function DataTable({ columns, rows }: DataTableProps) {
  if (!rows.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 font-medium text-slate-600 dark:text-slate-300"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 last:border-0 dark:border-slate-800"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="max-w-xs truncate px-3 py-2 text-slate-700 dark:text-slate-200"
                  title={formatValue(row[col.key])}
                >
                  {formatValue(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
