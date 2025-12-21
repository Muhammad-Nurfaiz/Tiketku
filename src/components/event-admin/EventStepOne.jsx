import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  });

  function toggleTicket(type) {
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.includes(type)
        ? prev.ticketTypes.filter((t) => t !== type)
        : [...prev.ticketTypes, type],
    }));
  }

  function handleNext() {
    if (!form.name || !form.venue || form.ticketTypes.length === 0) return;
    onNext(form);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Add Event – Step 1</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nama Event"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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

      {/* Ticket Type */}
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

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
