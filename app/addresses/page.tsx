"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, MapPin, Phone, User } from "lucide-react";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      name: "John Doe",
      phone: "+1234567890",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "US",
      isDefault: true,
    },
    {
      id: "2",
      label: "Office",
      name: "John Doe",
      phone: "+1234567890",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "US",
      isDefault: false,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const handleSave = () => {
    if (editingId) {
      setAddresses(addresses.map(a => 
        a.id === editingId ? { ...a, ...formData, id: editingId } : a
      ));
      setEditingId(null);
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now().toString(), isDefault: false }]);
    }
    setShowForm(false);
    setFormData({ label: "", name: "", phone: "", address: "", city: "", state: "", zip: "", country: "US" });
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Address Book</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ label: "", name: "", phone: "", address: "", city: "", state: "", zip: "", country: "US" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Edit Address" : "New Address"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Label (Home, Office)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="US">United States</option>
                  <option value="NG">Nigeria</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Address
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{addr.label}</h3>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{addr.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(addr.id);
                      setFormData(addr);
                      setShowForm(true);
                    }}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  {addr.phone}
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {addr.address}, {addr.city}, {addr.state} {addr.zip}
                </p>
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="mt-4 text-primary-400 text-sm hover:text-primary-300"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12 text-slate-400">
            No addresses saved yet
          </div>
        )}
      </div>
    </div>
  );
}