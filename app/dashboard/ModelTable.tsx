'use client';

import { useEffect, useMemo, useState } from 'react';

type Row = Record<string, unknown>;

export default function ModelTable({ model }: { model: string }) {
  const [data, setData] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/${model.toLowerCase()}`)
      .then(res => res.json())
      .then(setData);
  }, [model]);

  const columns = useMemo(
    () => (data.length ? Object.keys(data[0]) : []),
    [data]
  );

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  if (!data.length) {
    return <p className="text-gray-500">No records</p>;
  }

  const renderCell = (value: unknown) => {
    if (value === null) return <span className="text-gray-400">null</span>;

    if (typeof value === 'string') {
      if (!isNaN(Date.parse(value))) {
        return (
          <span className="text-gray-700">
            {new Date(value).toLocaleString()}
          </span>
        );
      }

      if (value.length > 24) {
        return (
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {value.slice(0, 10)}…
          </code>
        );
      }
    }

    if (typeof value === 'object') {
      return (
        <span className="text-xs text-indigo-600 font-semibold">
          JSON
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-black">{model}</h2>
          <p className="text-xs text-gray-500">
            {filtered.length} record{filtered.length !== 1 && 's'}
          </p>
        </div>

        <input
          placeholder="Search rows…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm text-black px-3 py-2 border-2 border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-[#FFC627] focus:border-[#FFC627]"
        />
      </div>

      <div className="overflow-x-auto max-h-[70vh]">
        <table className="min-w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10 border-b">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-bold text-black
                             tracking-wide uppercase text-xs"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <>
                <tr
                  key={i}
                  onClick={() =>
                    setExpandedRow(expandedRow === i ? null : i)
                  }
                  className={`cursor-pointer transition
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-yellow-50`}
                >
                  {columns.map(col => (
                    <td key={col} className="px-4 py-2 text-black">
                      {renderCell(row[col])}
                    </td>
                  ))}
                </tr>

                {expandedRow === i && (
                  <tr className="bg-gray-900">
                    <td colSpan={columns.length} className="p-4">
                      <pre className="text-xs text-green-200 overflow-x-auto">
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
