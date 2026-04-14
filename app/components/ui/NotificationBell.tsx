"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Payment Successful", message: "Your payment of $50 was successful", time: "2 min ago", read: false },
  { id: "2", title: "New Card", message: "Your gift card is ready to use", time: "1 hour ago", read: true },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-white relative"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50">
          <div className="p-3 border-b border-slate-700">
            <h3 className="font-medium text-white">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {mockNotifications.map(n => (
              <div
                key={n.id}
                className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer ${
                  !n.read ? "bg-slate-700/30" : ""
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-white text-sm font-medium">{n.title}</span>
                  <span className="text-slate-500 text-xs">{n.time}</span>
                </div>
                <p className="text-slate-400 text-sm">{n.message}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-700">
            <button className="text-primary-400 text-sm hover:text-primary-300">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}