import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function EventStepOne({ onNext, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    region: "",
    venue: "",
    start: "",
    end: "",
    totalTicket: "",
    ticketTypes: [],
    desc: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  function toggleTicket(type) {
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.includes(type)
        ? prev.ticketTypes.filter((t) => t !== type)
        : [...prev.ticketTypes, type],
    }));
  }

  function handleImage(file) {
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  }

  function handleNext() {
    const isDescValid =
      form.desc.replace(/<[^>]*>/g, "").trim().length > 0;

    if (
      !form.image ||
      !form.name ||
      !form.category ||
      !form.region ||
      !form.venue ||
      !form.start ||
      !form.end ||
      !form.totalTicket ||
      form.ticketTypes.length === 0 ||
      !isDescValid
    ) {
      return;
    }

    onNext(form);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Add Event – Step 1</h2>

      {/* 🔥 DROPZONE IMAGE (FLOWBITE STYLE) */}
      <div className="mb-6">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-56 w-full object-contain rounded-lg bg-slate-100 p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V12M7 12V8M7 12H3M7 12H11M15 8h4m-2-2v4M12 12v8m0 0l-3-3m3 3l3-3"
                />
              </svg>
              <p className="mb-2 text-sm text-slate-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG, JPEG (max 2MB)
              </p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </label>
      </div>

      {/* FORM UTAMA */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nama Event"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="border rounded px-3 py-2 text-sm"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Pilih Kategori</option>
          <option value="Music">Music</option>
          <option value="Sport">Sport</option>
          <option value="Tech">Tech</option>
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
        >
          <option value="">Pilih Region</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Surabaya">Surabaya</option>
        </select>

        <Input
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />

        <Input type="date" onChange={(e) => setForm({ ...form, start: e.target.value })} />
        <Input type="date" onChange={(e) => setForm({ ...form, end: e.target.value })} />

        <Input
          type="number"
          placeholder="Jumlah Ticket"
          value={form.totalTicket}
          onChange={(e) => setForm({ ...form, totalTicket: e.target.value })}
        />
      </div>

      {/* TICKET TYPE */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-2">Pilih Tipe Ticket</p>
        <div className="flex gap-4">
          {["Regular", "VIP", "Presale"].map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.ticketTypes.includes(t)}
                onChange={() => toggleTicket(t)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* DESKRIPSI */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">
          Deskripsi Event
        </label>
        <RichTextEditor
          value={form.desc}
          onChange={(html) =>
            setForm((prev) => ({ ...prev, desc: html }))
          }
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
