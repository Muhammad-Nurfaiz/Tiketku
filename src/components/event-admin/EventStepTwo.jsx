import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/common/RichTextEditor";
import TagInput from "../ui/tagsinput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EventStepTwo({ data, onChange, onNext, onBack }) {
  const [showError, setShowError] = useState(false);
  const [tags, setTags] = useState([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");


  const [organizers, setOrganizers] = useState([
    { id: "1", name: "Live Nation", description: "" },
    { id: "2", name: "Promotor Lokal", description: "" },
  ]);

  const refs = {
    flyer: useRef(null),
    name: useRef(null),
    organizerId: useRef(null),
    location: useRef(null),
    region: useRef(null),
    category: useRef(null),
    isActive: useRef(null),
    status: useRef(null),
    startDate: useRef(null),
    endDate: useRef(null),
    startTime: useRef(null),
    endTime: useRef(null),
    description: useRef(null),
    terms: useRef(null),
    keywords: useRef(null),
  };

  function upload(file, key) {
    if (!file) return;
    onChange({ ...data, [key]: URL.createObjectURL(file) });
  }

  function handleNext() {
    const requiredFields = [
      "flyer",
      "name",
      "organizerId", // Pastikan ini sama dengan key di state/data
      "location",
      "region",
      "category",
      "isActive",
      "status",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "description",
      "terms",
    ];

  for (const key of requiredFields) {
    if (!data[key]) {
      setShowError(true);
      refs[key]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
  }

  // Tambahan: Pastikan keywords juga tersimpan sebelum lanjut
  onChange({ ...data, keywords: tags });
  onNext();
}

  const errorClass = (key) =>
    showError && !data[key] ? "border-red-400" : "";
  

  return (
    <div className="space-y-6">
      {showError && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-700 rounded">
          Lengkapi semua field yang wajib diisi
        </div>
      )}

      <h2 className="text-lg font-semibold">Step 2 – Event</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Flyer */}
        <div ref={refs.flyer} className="w-full">
          <label className="text-sm font-medium">Flyer Event <span className="text-red-500">*</span></label>
          <label className={`flex h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer
            ${errorClass("flyer") || "border-slate-300"}`}>
            {data.flyer ? (
              <img src={data.flyer} className="max-h-full object-contain" />
            ) : (
              <span className="text-sm text-slate-500">Upload flyer</span>
            )}
            <Input type="file" className="hidden" onChange={e => upload(e.target.files[0], "flyer")} />
          </label>
        </div>

        {/* Layout */}
        <div className="w-full">
          <label className="text-sm font-medium">Layout Event</label>
          <label className={`flex h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer`}>
            {data.layout ? (
              <img src={data.layout} className="max-h-full object-contain" />
            ) : (
              <span className="text-sm text-slate-500">Upload layout</span>
            )}
            <Input type="file" className="hidden" onChange={e => upload(e.target.files[0], "layout")} />
          </label>
        </div>
      </div>

      <div ref={refs.name}>
        <label className="text-sm font-medium">Nama Event <span className="text-red-500">*</span></label>
        <Input
          value={data.name||""}
          placeholder="Nama Event"
          className={errorClass("name") || ""}
          onChange={e => onChange({ ...data, name: e.target.value })}
        />
      </div>
      
      <div ref={refs.organizerId} className="flex gap-3 items-end">
        <div className="flex-grow">
          <label className="text-sm font-medium">Organizer <span className="text-red-500">*</span></label>
            <select
              className={`border rounded px-3 py-2 w-full ${
                showError && !data.organizerId ? "border-red-500" : ""
              }`}
              // Gunakan data.organizerId, bukan eventData.organizerId
              value={data.organizerId || ""} 
              onChange={(e) =>
                // Gunakan fungsi onChange dari props untuk mengupdate data di parent
                onChange({ ...data, organizerId: e.target.value })
              }
            >
              <option value="">Pilih Organizer</option>
              {organizers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
        </div>
        <div className="flex-none">
          <Button 
            onClick={() => setOpen(true)} 
            type="button">
            Add Organizer
          </Button>
        </div>
      </div>

      <div ref={refs.location}>
        <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
        <Input
          value={data.location}
          className={showError && !data.location ? "border-red-400" : ""}
          onChange={e => onChange({ ...data, location: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Map(URL)</label>
        <Input
          value={data.mapUrl || ""}
          placeholder="Link Google Maps"
          onChange={e => onChange({ ...data, mapUrl: e.target.value })}
        />
      </div>

      {/* ACTIVE */}
      <div ref={refs.isActive}>
        <label className="text-sm font-medium">
          Is Active <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6 mt-2">
          {["active", "inactive"].map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.isActive === v}
                onChange={() => onChange({ ...data, isActive: v })}
              />
              {v === "active" ? "Active" : "Inactive"}
            </label>
          ))}
        </div>
        {showError && !data.isActive && (
          <p className="text-xs text-red-500 mt-1">Wajib dipilih</p>
        )}
      </div>

      {/* STATUS */}
      <div ref={refs.status}>
          <label className="text-sm font-medium">Status <span className="text-red-500">*</span></label>
          <select
            className={`w-full border rounded p-2 ${errorClass("status") || ""}`}
            value={data.status || ""}
            onChange={e => onChange({ ...data, status: e.target.value })}
          >
            <option value="">Pilih Status</option>
            <option>Draf</option>
            <option>Publish</option>
            <option>Archive</option>
          </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div ref={refs.region}>
          <label className="text-sm font-medium">Region <span className="text-red-500">*</span></label>
          <select
            className={`w-full border rounded p-2 ${errorClass("region") || ""}`}
            value={data.region || ""}
            onChange={e => onChange({ ...data, region: e.target.value })}
          >
            <option value="">Pilih Region</option>
            <option>Jakarta</option>
            <option>Bandung</option>
          </select>
        </div>

        <div ref={refs.category}>
          <label className="text-sm font-medium">Kategori <span className="text-red-500">*</span></label>
          <select
            className={`w-full border rounded p-2 ${errorClass("category") || ""}`}
            value={data.category || ""}
            onChange={e => onChange({ ...data, category: e.target.value })}
          >
            <option value="">Pilih Kategori</option>
            <option>Music</option>
            <option>Sport</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div ref={refs.startRef}>
          <label className="text-sm font-medium">Tanggal Mulai <span className="text-red-500">*</span></label>
          <Input
            type="date"
            value={data.startDate || ""}
            className={errorClass("startDate") || ""}
            onChange={e => onChange({ ...data, startDate: e.target.value })}
          />
        </div>

        <div ref={refs.endRef}>
          <label className="text-sm font-medium">Tanggal Berakhir <span className="text-red-500">*</span></label>
          <Input
            type="date"
            value={data.endDate || ""}
            className={errorClass("endDate") || ""}
            onChange={e => onChange({ ...data, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div ref={refs.startTime}>
          <label className="text-sm font-medium">Jam Mulai <span className="text-red-500">*</span></label>
          <Input
            type="time"
            value={data.startTime || ""}
            className={errorClass("startTime") || ""}
            onChange={e => onChange({ ...data, startTime: e.target.value })}
          />
        </div>

        <div ref={refs.endTime}>
          <label className="text-sm font-medium">Jam Berakhir <span className="text-red-500">*</span></label>
          <Input
            type="time"
            value={data.endTime || ""}
            className={errorClass("endTime") || ""}
            onChange={e => onChange({ ...data, endTime: e.target.value })}
          />
        </div>
      </div>

      <div ref={refs.description}>
        <label className="text-sm font-medium">Deskripsi Event <span className="text-red-500">*</span></label>
        <div className={errorClass("description") || ""}>
          <RichTextEditor
            value={data.description || ""}
            onChange={v => onChange({ ...data, description: v })}
          />
        </div>
      </div>

      <div ref={refs.terms}>
        <label className="text-sm font-medium">Syarat & Ketentuan Event <span className="text-red-500">*</span></label>
        <div className={errorClass("terms") || ""}>
          <RichTextEditor
            value={data.terms || ""}
            onChange={v => onChange({ ...data, terms: v })}
          />
        </div>
      </div>

      <div ref={refs.keywords}>
        <label className="text-sm font-medium">Keywords <span className="text-red-500">*</span></label>
        <TagInput
          value={data.keywords || ""}
          onChange={v => onChange({ ...data, keywords: v })}
          className={errorClass("keywords") || ""}
          keywords={tags}
          setKeywords={setTags}
          maxKeywords={20}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>Kembali</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Organizer</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const newOrg = { id: Date.now().toString(), name: name.trim(), description: desc.trim() };
              setOrganizers(prev => [...prev, newOrg]);
              onChange({ ...data, organizerId: newOrg.id }); // Langsung simpan ke data utama
              setName(""); setDesc(""); setOpen(false);
          }}>
            <div>
              <label className="block text-sm mb-1">Nama Organizer <span className="text-red-500">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="block text-sm mb-1">Deskripsi</label>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
