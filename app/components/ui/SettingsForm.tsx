"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

interface SettingsFormProps {
  initialData?: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    region: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [twoFactor, setTwoFactor] = useState(initialData?.twoFactorEnabled ?? false);
  const [notifications, setNotifications] = useState(initialData?.emailNotifications ?? true);
  const [region, setRegion] = useState(initialData?.region ?? "US");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twoFactorEnabled: twoFactor,
          emailNotifications: notifications,
          region,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-medium mb-2">Region</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
        >
          <option value="US">🇺🇸 United States</option>
          <option value="NG">🇳🇬 Nigeria</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
        <div>
          <p className="text-white font-medium">Two-Factor Authentication</p>
          <p className="text-slate-400 text-sm">Add an extra layer of security</p>
        </div>
        <button
          onClick={() => setTwoFactor(!twoFactor)}
          className={`w-12 h-6 rounded-full transition ${
            twoFactor ? "bg-green-600" : "bg-slate-600"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition transform ${
              twoFactor ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
        <div>
          <p className="text-white font-medium">Email Notifications</p>
          <p className="text-slate-400 text-sm">Receive updates about your account</p>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className={`w-12 h-6 rounded-full transition ${
            notifications ? "bg-green-600" : "bg-slate-600"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition transform ${
              notifications ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Saved!
          </>
        ) : saving ? (
          "Saving..."
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Settings
          </>
        )}
      </button>
    </div>
  );
}