// EventStepTwo.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function EventStepTwo({ eventData, onBack, onSubmit }) {
  const [tickets, setTickets] = useState(
    eventData.ticketTypes.map((t) => ({
      type: t,
      qty: "",
      price: "",
      maxOrder: "",
      description: "", // ⬅️ deskripsi per ticket
    }))
  );

  function update(index, key, value) {
    const copy = [...tickets];
    copy[index][key] = value;
    setTickets(copy);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Add Event – Step 2</h2>

      <div className="space-y-6">
        {tickets.map((t, i) => (
          <div
            key={i}
            className="border rounded-xl p-5 bg-white shadow-sm"
          >
            {/* Ticket Title */}
            <p className="font-semibold mb-4">
              {t.type} Ticket
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input
                type="number"
                placeholder="Jumlah Ticket"
                value={t.qty}
                onChange={(e) => update(i, "qty", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Harga Ticket"
                value={t.price}
                onChange={(e) => update(i, "price", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Order"
                value={t.maxOrder}
                onChange={(e) => update(i, "maxOrder", e.target.value)}
              />
            </div>

            {/* Rich Text Editor (PALING BAWAH) */}
            <div className="mt-5">
              <label className="text-sm font-medium mb-2 block">
                Deskripsi Ticket
              </label>

              <RichTextEditor
                value={t.description}
                onChange={(html) =>
                  update(i, "description", html)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onSubmit({ ...eventData, tickets })}>
          Save Event
        </Button>
      </div>
    </div>
  );
}
