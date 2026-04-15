"use client";

import { useState } from "react";
import { User, Mail, Shield, Bell, Globe, Camera, Save, Check } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    twoFactor: false,
    emailNotifications: true,
    pushNotifications: false,
    region: "US",
    timezone: "America/New_York",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "region", label: "Region", icon: Globe },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <nav className="lg:col-span-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-slate-400 text-sm">Add extra security to your account</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, twoFactor: !formData.twoFactor })}
                      className={`w-12 h-6 rounded-full transition ${
                        formData.twoFactor ? "bg-green-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition transform ${
                          formData.twoFactor ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Password</p>
                      <p className="text-slate-400 text-sm">Last changed 30 days ago</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500">
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Active Sessions</p>
                      <p className="text-slate-400 text-sm">Manage your active sessions</p>
                    </div>
                    <button className="text-primary-400 hover:text-primary-300">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-slate-400 text-sm">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                      className={`w-12 h-6 rounded-full transition ${
                        formData.emailNotifications ? "bg-green-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition transform ${
                          formData.emailNotifications ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-slate-400 text-sm">Receive push notifications</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, pushNotifications: !formData.pushNotifications })}
                      className={`w-12 h-6 rounded-full transition ${
                        formData.pushNotifications ? "bg-green-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition transform ${
                          formData.pushNotifications ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "region" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Region & Language</h2>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="US">🇺🇸 United States</option>
                    <option value="NG">🇳🇬 Nigeria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Africa/Lagos">West Africa (WAT)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}