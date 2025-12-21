import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventStepTwo({ eventData, onBack, onSubmit }) {
  const [tickets, setTickets] = useState(
    eventData.ticketTypes.map((t) => ({
      type: t,
      qty: "",
      price: "",
      maxOrder: "",
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

      <div className="space-y-4">
        {tickets.map((t, i) => (
          <div key={i} className="border rounded p-4">
            <p className="font-medium mb-2">{t.type}</p>

            <div className="grid grid-cols-3 gap-3">
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
          </div>
        ))}
      </div>

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
