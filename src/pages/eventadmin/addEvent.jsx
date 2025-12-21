import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function AddEventForm() {
  return (
    <div>
      <h1>Add Event Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nama Event *</label>
                <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
            </div>
        
            <div>
                <label className="block text-sm font-medium mb-1"> *</label>
                <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>
        
            <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Masukkan nomor telepon (opsional)"
                    className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
            </div>
        
            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    </select>
            </div>
        
            <div className="flex gap-3 justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                Batal
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
        </form>
    </div>
    );
};
