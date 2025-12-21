import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Event ${i + 1}`,
  venue: `Venue ${((i % 3) + 1)}`,
  start: `2025-12-${(i % 28) + 1}`,
  end: `2026-01-${(i % 28) + 1}`,
  status: i % 2 === 0 ? "published" : "draft",
  totalTickets: 500 + i * 10,
  sold: Math.floor(Math.random() * 500),
}));

export default function EventList({ onAdd }) {
  const [data] = useState(initial);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((d) =>
      [d.name, d.venue].join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const normalizeStatus = (s) => (s === "published" ? "Active" : "Inactive");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button onClick={onAdd}>+ Add Event</Button>
      </div>

      {/* Card */}
      <div className="rounded-lg bg-white shadow-sm p-4">
        {/* Top controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="sm:w-1/2"
          />

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={6}>6 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm divide-y">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="px-3 py-2">Nama Event</th>
                <th className="px-3 py-2">Venue</th>
                <th className="px-3 py-2">Tanggal Mulai</th>
                <th className="px-3 py-2">Tanggal Selesai</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {pageData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3">{row.name}</td>
                  <td className="px-3 py-3">{row.venue}</td>
                  <td className="px-3 py-3">{row.start}</td>
                  <td className="px-3 py-3">{row.end}</td>
                  <td className="px-3 py-3">
                    {normalizeStatus(row.status) === "Active" ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button className="p-2 rounded hover:bg-slate-100">
                      ✏️
                    </button>
                    <button className="p-2 rounded hover:bg-slate-100 ml-1">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>
            Showing {(page - 1) * perPage + 1} –{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              ◀
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
