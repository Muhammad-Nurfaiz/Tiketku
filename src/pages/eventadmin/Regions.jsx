import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const initialRegions = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Wilayah ${i + 1}`,
  slug: `wilayah-${i + 1}`,
  events: Math.floor(Math.random() * 8),
  createdAt: `2025-11-${(i % 28) + 1}`,
}));

export default function Regions() {
  const [data, setData] = useState(initialRegions);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const columns = [
    { key: 'name', label: 'Nama Wilayah' },
    { key: 'slug', label: 'Slug' },
    { key: 'events', label: 'Jumlah Event' },
    { key: 'createdAt', label: 'Tanggal Dibuat' },
  ];

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [d.name, d.slug, d.events.toString(), d.createdAt].join(' ').toLowerCase().includes(q);
    return matchesSearch;
  });

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va || '').toLowerCase();
      const sb = String(vb || '').toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageData = sorted.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  }

  function handleAdd(e) {
    e.preventDefault();
    const item = { id: data.length + 1, name, slug, events: 0, createdAt: new Date().toISOString().slice(0, 10) };
    setData([item, ...data]);
    setOpen(false);
    setName(''); setSlug('');
    setPage(1);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Wilayah</h2>
        <Button onClick={() => setOpen(true)}>+ Add Wilayah</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <Input
              placeholder="Search regions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10"
            />
          </div>

          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1 text-sm focus:outline-none"
              aria-label="Rows per page"
            >
              <option value={6}>6 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm divide-y">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2">
                    <button
                      className="inline-flex items-center gap-2 text-left w-full"
                      onClick={() => toggleSort(c.key)}
                      aria-label={`Sort by ${c.label}`}
                    >
                      <span>{c.label}</span>
                      <span className="ml-1">
                        {sortKey === c.key ? (
                          sortDir === 'asc' ? (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path d="M5 12l5-5 5 5H5z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path d="M15 8l-5 5-5-5h10z" />
                            </svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-500">No regions found.</td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">{row.name}</td>
                    <td className="px-3 py-3">{row.slug}</td>
                    <td className="px-3 py-3">{row.events}</td>
                    <td className="px-3 py-3">{row.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, sorted.length)} of {sorted.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-slate-100 focus:outline-none"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.293 16.293L7.586 11.586 12.293 6.879 11.293 5.879 5.879 11.293 11.293 16.707z" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded text-sm ${page === i + 1 ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="p-2 rounded hover:bg-slate-100 focus:outline-none"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 3.707L12.414 8.414 7.707 13.121 8.707 14.121 14.121 8.707 8.707 3.293z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wilayah</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama Wilayah</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
