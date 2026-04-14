"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { User, Shield, Bell, Globe, Mail } from "lucide-react";

export default function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "region", label: "Region", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <nav className="lg:col-span-1 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Profile Picture</p>
                  <p className="text-slate-400 text-sm">Update your profile photo</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Email</label>
                <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-white">user@example.com</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Two-Factor Authentication</label>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-4 py-2 rounded-lg ${
                    twoFactor
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {twoFactor ? "Enabled" : "Enable 2FA"}
                </button>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Email Notifications</label>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`px-4 py-2 rounded-lg ${
                    notifications
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {notifications ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}