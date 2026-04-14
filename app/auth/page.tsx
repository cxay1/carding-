"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { HeroSection } from "@/components/lib/hero-section";
import AuthTabs from "@/components/auth/AuthTabs";
import SecurityBadges from "@/components/security/SecurityBadges";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <HeroSection
        title="Secure Digital Gift Cards"
        description="Instant delivery, worldwide accepted"
      />
      <SecurityBadges />
      <div className="max-w-md mx-auto mt-8 p-6 bg-slate-800/50 backdrop-blur rounded-xl">
        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "signin" ? (
          <SignIn appearance={{ variables: { colorPrimary: "#0ea5e9" } }} />
        ) : (
          <SignUp appearance={{ variables: { colorPrimary: "#0ea5e9" } }} />
        )}
      </div>
    </main>
  );
}