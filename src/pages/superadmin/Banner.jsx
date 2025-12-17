import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/common/Toast';
import { Plus, Trash2, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock banner data
const mockBanners = [
  {
    id: '1',
    title: 'New Year Event 2025',
    imageUrl: 'https://via.placeholder.com/400x150?text=New+Year+2025',
    description: 'Celebrate the new year with amazing events',
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Summer Festival',
    imageUrl: 'https://via.placeholder.com/400x150?text=Summer+Festival',
    description: 'Experience the best summer events',
    isActive: true,
    createdAt: '2024-11-15T08:30:00Z',
  },
  {
    id: '3',
    title: 'Concert Night',
    imageUrl: 'https://via.placeholder.com/400x150?text=Concert+Night',
    description: 'Live music performances every weekend',
    isActive: false,
    createdAt: '2024-10-20T14:45:00Z',
  },
];

export default function Banner() {
  const [banners, setBanners] = useState(mockBanners);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { addToast } = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.imageUrl) {
      addToast('Semua field wajib diisi', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBanner = {
        id: String(banners.length + 1),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      setBanners([newBanner, ...banners]);
      addToast('Banner berhasil ditambahkan', 'success');
      setUploadDialogOpen(false);
      setFormData({ title: '', description: '', imageUrl: '' });
      setImagePreview(null);
    } catch (error) {
      console.error('Failed to upload banner:', error);
      addToast('Gagal menambahkan banner', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Hapus banner\n\nApakah Anda yakin ingin menghapus banner ini?');
    if (ok) {
      try {
        setBanners(banners.filter(b => b.id !== id));
        addToast('Banner berhasil dihapus', 'success');
      } catch (error) {
        console.error('Failed to delete banner:', error);
        addToast('Gagal menghapus banner', 'error');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div className="font-medium">{row.title}</div>
      ),
    },
    {
      key: 'imageUrl',
      label: 'Image',
      render: (row) => (
        <img src={row.imageUrl} alt={row.title} className="h-12 w-20 object-cover rounded" />
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <p className="text-sm text-muted-foreground truncate max-w-xs">{row.description}</p>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Management"
        description="Manage platform banners"
        action={
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Upload Banner
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={banners} loading={false} />
      )}

      {/* Upload Banner Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Banner</DialogTitle>
            <DialogDescription>Tambahkan banner baru untuk ditampilkan di platform</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nama banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Image *</label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded mx-auto" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ubah gambar
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk upload gambar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (maks 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
