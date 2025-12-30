import {
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/common/RichTextEditor";
import {
  confirmAlert,
  successAlert,
  errorAlert,
} from "@/lib/alert";
import { formatRupiah, parseRupiah } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "Pilih Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
];

export default function EventStepThree({
  tickets,
  setTickets,
  activeTicketId,
  setActiveTicketId,
  onBackStep,
  onFinish,
}) {
  const activeTicket = tickets.find((t) => t.id === activeTicketId);
  const topRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  if (!activeTicket) return null;

  /* ================= VALIDATION ================= */
  function isEmptyHTML(html) {
    return !html || html.replace(/<[^>]*>/g, "").trim() === "";
  }

  function validateTicket(t) {
    const e = {};

    if (!t.name?.trim()) e.name = true;
    if (isEmptyHTML(t.description)) e.description = true;

    if (Number(t.price) <= 0) e.price = true;
    if (t.qty === "" || Number(t.qty) <= 0) e.qty = true;
    if (t.maxOrder === "" || Number(t.maxOrder) <= 0) e.maxOrder = true;

    if (t.isActive === undefined) e.isActive = true;
    if (t.status === "") e.status = true;

    if (!t.deliverDate) e.deliverDate = true;
    if (!t.startDate) e.startDate = true;
    if (!t.startTime) e.startTime = true;
    if (!t.endDate) e.endDate = true;
    if (!t.endTime) e.endTime = true;

    return e;
  }

  function hasError(field) {
    return showError && errors[field];
  }

  /* ================= UPDATE ================= */
  function update(key, value) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicketId ? { ...t, [key]: value } : t
      )
    );

    if (errors[key]) {
      setErrors((prev) => {
        const c = { ...prev };
        delete c[key];
        return c;
      });
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setShowError(false);
    }
  }, [errors]);

  /* ================= ADD ================= */
  async function addTicket() {
    const e = validateTicket(activeTicket);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setShowError(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: "",
      qty: "",
      sold: 0,
      maxOrder: "",
      isActive: true,
      status: "",
      deliverDate: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    };

    setTickets([...tickets, newTicket]);
    setActiveTicketId(newTicket.id);
    setErrors({});
    setShowError(false);
  }

  /* ================= DELETE ================= */
  async function deleteTicket() {
    if (tickets.length === 1) return;

    const res = await confirmAlert({
      title: "Hapus Ticket?",
      text: "Ticket yang dihapus tidak dapat dikembalikan.",
      confirmText: "Hapus",
    });

    if (!res.isConfirmed) return;

    const index = tickets.findIndex((t) => t.id === activeTicketId);
    const newTickets = tickets.filter((t) => t.id !== activeTicketId);

    setTickets(newTickets);
    setActiveTicketId(newTickets[index - 1]?.id || newTickets[0].id);
  }

  /* ================= FINISH ================= */
  async function finish() {
    const invalid = tickets.find((t) => {
      const e = validateTicket(t);
      return Object.keys(e).length > 0;
    });

    if (invalid) {
      setActiveTicketId(invalid.id);
      setErrors(validateTicket(invalid));
      setShowError(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const res = await confirmAlert({
      title: "Simpan Event?",
      text: "Event dan semua ticket akan disimpan.",
      confirmText: "Simpan",
    });

    if (!res.isConfirmed) return;

    await successAlert("Berhasil 🎉", "Event berhasil disimpan.");
    onFinish();
  }

  return (
    <div ref={topRef} className="space-y-6">
      <h2 className="text-lg font-semibold">
        Add Event – Step 3 (Ticket)
      </h2>

      {/* ERROR SUMMARY */}
      {showError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Lengkapi semua field yang wajib diisi
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LIST */}
        <div className="md:col-span-4 border rounded-lg divide-y">
          <div className="p-3 bg-slate-50 text-sm font-medium">
            List Ticket
          </div>

          {tickets.map((t, i) => {
            const valid =
              Object.keys(validateTicket(t)).length === 0;
            const active = t.id === activeTicketId;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`w-full px-4 py-3 flex justify-between text-left
                  ${active ? "bg-slate-100" : "hover:bg-slate-50"}`}
              >
                <div>
                  <div className="font-medium">Ticket {i + 1}</div>
                  <div className="text-xs text-slate-500">
                    {t.name || "Belum diisi"}
                  </div>
                </div>

                {valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
              </button>
            );
          })}

          <div className="p-3">
            <Button className="w-full gap-2" onClick={addTicket}>
              <Plus className="w-4 h-4" />
              Tambah Ticket
            </Button>
          </div>
        </div>

        {/* FORM */}
        <div className="md:col-span-8 border rounded-lg p-4 space-y-4">
          {/* IDENTITAS */}
          <div>
            <label className="text-sm font-medium">
              Nama Ticket *
            </label>
            <Input
              value={activeTicket.name}
              onChange={(e) => update("name", e.target.value)}
              className={hasError("name") ? "border-red-500" : ""}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Deskripsi *
            </label>
            <RichTextEditor
              key={activeTicket.id}
              value={activeTicket.description}
              onChange={(v) => update("description", v)}
              compact
            />
          </div>

          {/* HARGA & STOK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">
                Harga *
              </label>
              <Input
                value={formatRupiah(activeTicket.price)}
                onChange={(e) =>
                  update("price", parseRupiah(e.target.value))
                }
                className={hasError("price") ? "border-red-500" : ""}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Total Stock *
              </label>
              <Input
                type="number"
                value={activeTicket.qty}
                onChange={(e) => update("qty", e.target.value)}
                className={hasError("qty") ? "border-red-500" : ""}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Max / Order *
              </label>
              <Input
                type="number"
                value={activeTicket.maxOrder}
                onChange={(e) => update("maxOrder", e.target.value)}
                className={
                  hasError("maxOrder") ? "border-red-500" : ""
                }
              />
            </div>
          </div>

          {/* WAKTU */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tanggal Mulai */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={activeTicket.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
              </div>

              {/* Tanggal Selesai */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={activeTicket.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                />
              </div>

              {/* Tanggal Kirim */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">
                  Tanggal Kirim Ticket <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={activeTicket.deliverDate}
                  onChange={(e) => update("deliverDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jam Mulai */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Jam Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={activeTicket.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                />
              </div>

              {/* Jam Selesai */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Jam Selesai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={activeTicket.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                />
              </div>
            </div>
          </div>


          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">
              Status Ticket *
            </label>
            <select
              className={`w-full h-10 rounded-md border px-3
                ${hasError("status") ? "border-red-500" : ""}`}
              value={activeTicket.status}
              onChange={(e) =>
                update("status", e.target.value)
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIVE */}
          <div>
            <label className="text-sm font-medium">
              Status Aktif *
            </label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={activeTicket.isActive === true}
                  onChange={() => update("isActive", true)}
                />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={activeTicket.isActive === false}
                  onChange={() => update("isActive", false)}
                />
                Inactive
              </label>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBackStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>

            <div className="flex gap-2">
              {tickets.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={deleteTicket}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              )}

              <Button onClick={finish}>
                <Check className="w-4 h-4 mr-2" />
                Selesai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
