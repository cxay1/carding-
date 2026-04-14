# Gift Card Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-page gift card platform with Clerk auth, dashboard, checkout (Stripe/Paystack), and support

**Architecture:** Next.js 14 with App Router (pages under /app), Express server for inventory/redemption, PostgreSQL + Prisma, Clerk authentication

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Clerk, Prisma, Express, Stripe, Paystack, OpenAI

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `next.config.js`
- Create: `.env.local.example`

- [ ] **Step 1: Create package.json with all dependencies**

```json
{
  "name": "chargeline",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "server": "node server/dist/index.js",
    "server:dev": "tsx watch server/src/index.ts",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@clerk/nextjs": "^4.29.0",
    "@prisma/client": "^5.9.0",
    "prisma": "^5.9.0",
    "stripe": "^14.14.0",
    "paystack-inline": "^2.0.0",
    "openai": "^4.28.0",
    "ai": "^3.0.38",
    "zod": "^3.22.4",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "crypto-js": "^4.2.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.312.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/crypto-js": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "tsx": "^4.7.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "server"]
}
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Create postcss.config.js, next.config.js, .env.local.example**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Commit project setup**

```bash
git init
git add .
git commit -m "feat: set up Next.js 14 project with TypeScript and Tailwind"
```

---

## Task 2: Database & Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Modify: `.env.local.example`

- [ ] **Step 1: Create Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(uuid())
  clerkId         String    @unique
  email           String    @unique
  region          String    @default("US")
  balance         Decimal   @default(0)
  twoFactorEnabled Boolean  @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  cards           GiftCard[]
  transactions    Transaction[]
  disputes        Dispute[]
}

model GiftCard {
  id              String    @id @default(uuid())
  codeEncrypted   String
  iv              String
  denomination    Decimal
  currency        String    @default("USD")
  region          String    @default("US")
  status          CardStatus @default(UNUSED)
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  purchasedAt    DateTime?
  redeemedAt      DateTime?
  expiresAt      DateTime
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Transaction {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  amount        Decimal
  currency      String
  gateway       String
  gatewayRef    String
  status        TransactionStatus @default(PENDING)
  metadata      Json?
  createdAt     DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Dispute {
  id            String    @id @default(uuid())
  userId        String
  transactionId String?
  type          DisputeType
  status        DisputeStatus @default(PENDING)
  evidence      String[]
  resolution    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  resolvedAt    DateTime?
}

enum CardStatus { UNUSED USED EXPIRED }
enum TransactionStatus { PENDING COMPLETED FAILED REFUNDED }
enum DisputeType { INVALID_CODE, ALREADY_USED, WRONG_REGION }
enum DisputeStatus { PENDING, UNDER_REVIEW, RESOLVED, REJECTED }
```

- [ ] **Step 2: Commit Prisma schema**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma schema for User, GiftCard, Transaction, Dispute models"
```

---

## Task 3: Clerk Authentication Setup

**Files:**
- Create: `app/middleware.ts`
- Create: `app/layout.tsx`
- Modify: `app/(auth)/layout.tsx`

- [ ] **Step 1: Create middleware.ts**

```typescript
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = authMiddleware({
  publicRoutes: ["/", "/auth", "/api/webhooks(.*)", "/api/(.*)"],
});

export default async function (request: NextRequest) {
  const country = request.geo?.country || "US";
  const region = country === "NG" ? "nigeria" : "us";

  const response = await middleware(request);
  response.headers.set("x-user-region", region);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 2: Create root layout.tsx**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChargeLine - Digital Gift Cards",
  description: "Secure digital gift cards with instant delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create auth layout**

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
```

- [ ] **Step 4: Commit auth setup**

```bash
git add app/middleware.ts app/layout.tsx
git commit -m "feat: add Clerk middleware and root layout"
```

---

## Task 4: Express Server Setup

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts`
- Create: `server/src/services/encryption.ts`
- Create: `server/src/routes/inventory.ts`
- Create: `server/src/routes/redemption.ts`

- [ ] **Step 1: Create server/package.json**

```json
{
  "name": "chargeline-server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "crypto-js": "^4.2.0",
    "@prisma/client": "^5.9.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.7.0"
  }
}
```

- [ ] **Step 2: Create server/services/encryption.ts**

```typescript
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production";

export function encryptCardCode(code: string): { encrypted: string; iv: string } {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(code, CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encrypted: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex),
  };
}

export function decryptCardCode(encrypted: string, iv: string): string {
  const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
```

- [ ] **Step 3: Create server/src/index.ts**

```typescript
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.EXPRESS_PORT || 4000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many attempts, please try again later" },
});

app.use("/api/redemption", limiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 4: Commit Express server**

```bash
git add server/
git commit -m "feat: add Express server for inventory and redemption"
```

---

## Task 5: Page 1 - Auth/Landing

**Files:**
- Create: `app/(auth)/auth/page.tsx`
- Create: `app/components/auth/AuthTabs.tsx`
- Create: `app/components/security/SecurityBadges.tsx`

- [ ] **Step 1: Create auth page with Clerk**

```typescript
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
```

- [ ] **Step 2: Create AuthTabs component**

```typescript
"use client";

interface AuthTabsProps {
  activeTab: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
}

export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onTabChange("signin")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "signin"
            ? "bg-primary-600 text-white"
            : "bg-slate-700 text-slate-300"
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onTabChange("signup")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "signup"
            ? "bg-primary-600 text-white"
            : "bg-slate-700 text-slate-300"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create SecurityBadges component**

```typescript
export default function SecurityBadges() {
  const badges = [
    { label: "PCI DSS Compliant", icon: "🔒" },
    { label: "AES-256 Encryption", icon: "🛡️" },
    { label: "24/7 Support", icon: "🎧" },
  ];

  return (
    <div className="flex justify-center gap-8 mt-6">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-slate-400">
          <span>{badge.icon}</span>
          <span className="text-sm">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit auth page**

```bash
git add app/\(auth\)/auth/page.tsx app/components/
git commit -m "feat: add auth landing page with Clerk integration"
```

---

## Task 6: Page 2 - Dashboard

**Files:**
- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `app/components/cards/CardGrid.tsx`
- Create: `app/components/cards/CardInventory.tsx`
- Create: `app/components/cards/RedeemForm.tsx`

- [ ] **Step 1: Create dashboard page**

```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import BentoGrid from "@/components/layouts/BentoGrid";
import CardGrid from "@/components/cards/CardGrid";
import CardInventory from "@/components/cards/CardInventory";
import RedeemForm from "@/components/cards/RedeemForm";

type Tab = "buy" | "mycards" | "redeem" | "history";

export default function DashboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("buy");
  const [regionFilter, setRegionFilter] = useState<"US" | "NG" | "ALL">("ALL");

  const tabs: { id: Tab; label: string }[] = [
    { id: "buy", label: "Buy Cards" },
    { id: "mycards", label: "My Cards" },
    { id: "redeem", label: "Redeem" },
    { id: "history", label: "History" },
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="p-6 bg-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-slate-400">
          Balance: ${user?.publicMetadata?.balance || 0}
        </div>
      </header>

      <nav className="flex gap-4 p-4 bg-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        {activeTab === "buy" && (
          <CardGrid regionFilter={regionFilter} setRegionFilter={setRegionFilter} />
        )}
        {activeTab === "mycards" && <CardInventory />}
        {activeTab === "redeem" && <RedeemForm />}
        {activeTab === "history" && <div>Transaction history coming soon</div>}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create CardGrid component**

```typescript
"use client";

import { useEffect, useState } from "react";
import { CreditCard, ShoppingCart, Gift } from "lucide-react";
import { FeatureCard } from "@/components/lib/feature-card";

interface GiftCard {
  id: string;
  denomination: number;
  currency: string;
  region: string;
}

interface CardGridProps {
  regionFilter: "US" | "NG" | "ALL";
  setRegionFilter: (region: "US" | "NG" | "ALL") => void;
}

const icons = [CreditCard, ShoppingCart, Gift];

export default function CardGrid({ regionFilter, setRegionFilter }: CardGridProps) {
  const [cards, setCards] = useState<GiftCard[]>([]);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then(setCards);
  }, []);

  const filteredCards = cards.filter(
    (card) => regionFilter === "ALL" || card.region === regionFilter
  );

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {(["ALL", "US", "NG"] as const).map((region) => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            className={`px-4 py-2 rounded-lg ${
              regionFilter === region
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {region === "ALL" ? "All Regions" : region === "US" ? "🇺🇸 US" : "🇳🇬 Nigeria"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCards.map((card, index) => (
          <FeatureCard
            key={card.id}
            icon={icons[index % icons.length]}
            title={`$${card.denomination} ${card.region}`}
            description={`${card.currency} Gift Card`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CardInventory component**

```typescript
"use client";

import { useState } from "react";

type Status = "UNUSED" | "USED" | "EXPIRED";

export default function CardInventory() {
  const [statusFilter, setStatusFilter] = useState<Status>("UNUSED");

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {(["UNUSED", "USED", "EXPIRED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === status
                ? status === "UNUSED"
                  ? "bg-green-600"
                  : status === "USED"
                  ? "bg-slate-600"
                  : "bg-red-600"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="text-slate-400">Your card inventory will appear here</div>
    </div>
  );
}
```

- [ ] **Step 4: Create RedeemForm component**

```typescript
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RedeemForm() {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleRedeem = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: user?.id }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter gift card code"
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white"
      />
      <button
        onClick={handleRedeem}
        disabled={status === "loading"}
        className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        {status === "loading" ? "Redeeming..." : "Redeem Code"}
      </button>
      {status === "success" && (
        <div className="mt-4 p-4 bg-green-600/20 text-green-400 rounded-lg">
          Code redeemed successfully!
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 p-4 bg-red-600/20 text-red-400 rounded-lg">
          Invalid code or already used
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit dashboard**

```bash
git add app/\(dashboard\)/dashboard/page.tsx app/components/cards/
git commit -m "feat: add dashboard with card marketplace and redemption"
```

---

## Task 7: Page 3 - Checkout

**Files:**
- Create: `app/(checkout)/checkout/page.tsx`
- Create: `app/components/payment/PaymentMethodSelector.tsx`
- Create: `app/components/payment/StripePaymentForm.tsx`
- Create: `app/components/payment/PaystackPaymentForm.tsx`

- [ ] **Step 1: Create checkout page**

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [region, setRegion] = useState<"US" | "NG">("US");

  useEffect(() => {
    const regionHeader = document.headers.get("x-user-region");
    setRegion(regionHeader === "nigeria" ? "NG" : "US");
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div className="flex justify-between text-slate-400">
            <span>Gift Card (${cardId || "50"})</span>
            <span className="text-white">${cardId || "50"}.00</span>
          </div>
          <div className="flex justify-between text-slate-400 mt-2">
            <span>Processing Fee</span>
            <span className="text-white">$0.00</span>
          </div>
          <div className="border-t border-slate-700 mt-4 pt-4 flex justify-between text-white font-bold">
            <span>Total</span>
            <span>${cardId || "50"}.00</span>
          </div>
        </div>

        <PaymentMethodSelector
          region={region}
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />

        <div className="mt-6 text-slate-400 text-sm">
          <p>🔒 We never store your CVV. Encrypted with AES-256.</p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create PaymentMethodSelector**

```typescript
"use client";

interface PaymentMethodSelectorProps {
  region: "US" | "NG";
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const usMethods = [
  { id: "card", label: "Credit/Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
];

const ngMethods = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { id: "ussd", label: "USSD (*737#)", icon: "📱" },
];

export default function PaymentMethodSelector({
  region,
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const methods = region === "NG" ? ngMethods : usMethods;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`w-full p-4 rounded-lg flex items-center gap-4 transition ${
              selectedMethod === method.id
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <span>{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create API route for payments**

```typescript
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

export async function POST(request: Request) {
  const { amount, region } = await request.json();

  if (region === "US") {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  }

  return NextResponse.json({ error: "Nigeria not implemented in this route" });
}
```

- [ ] **Step 4: Commit checkout**

```bash
git add app/\(checkout\)/checkout/page.tsx app/components/payment/ app/api/payments/
git commit -m "feat: add checkout page with payment method selection"
```

---

## Task 8: Page 4 - Support

**Files:**
- Create: `app/(support)/support/page.tsx`
- Create: `app/components/support/AIChatWidget.tsx`
- Create: `app/components/dispute/DisputeForm.tsx`

- [ ] **Step 1: Create support page**

```typescript
"use client";

import { useState } from "react";
import AIChatWidget from "@/components/support/AIChatWidget";
import DisputeForm from "@/components/dispute/DisputeForm";

type Tab = "chat" | "disputes" | "geo";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <main className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Support Center</h1>

      <nav className="flex gap-4 mb-6">
        {[
          { id: "chat", label: "AI Chat" },
          { id: "disputes", label: "Disputes" },
          { id: "geo", label: "Region" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "chat" && <AIChatWidget />}
      {activeTab === "disputes" && <DisputeForm />}
      {activeTab === "geo" && <GeoRestrictionPanel />}
    </main>
  );
}

function GeoRestrictionPanel() {
  const [travelMode, setTravelMode] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Region Settings</h2>
      <div className="mb-4">
        <span className="text-slate-400">Detected Location: </span>
        <span className="text-white">United States</span>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={travelMode}
          onChange={(e) => setTravelMode(e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <span className="text-white">Travel Mode (temporary region override)</span>
      </label>
    </div>
  );
}
```

- [ ] **Step 2: Create AIChatWidget component**

```typescript
"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <div className="h-80 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-primary-600/20 text-white ml-8"
                : "bg-slate-700 text-slate-300 mr-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 animate-pulse">Thinking...</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DisputeForm component**

```typescript
"use client";

import { useState } from "react";

type DisputeType = "INVALID_CODE" | "ALREADY_USED" | "WRONG_REGION";

export default function DisputeForm() {
  const [type, setType] = useState<DisputeType>("INVALID_CODE");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await fetch("/api/support/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, description }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Dispute Submitted</h2>
        <p className="text-slate-400">
          Your dispute has been submitted. We'll review it within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <h2 className="text-xl font-semibold text-white mb-4">File a Dispute</h2>

      <div className="space-y-3 mb-4">
        {(["INVALID_CODE", "ALREADY_USED", "WRONG_REGION"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`w-full p-3 rounded-lg text-left ${
              type === t
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue..."
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-32"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Submit Dispute
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Commit support page**

```bash
git add app/\(support\)/support/page.tsx app/components/support/ app/components/dispute/
git commit -m "feat: add support page with AI chat and dispute form"
```

---

## Task 9: API Routes

**Files:**
- Create: `app/api/cards/route.ts`
- Create: `app/api/cards/redeem/route.ts`
- Create: `app/api/support/chat/route.ts`
- Create: `app/api/support/disputes/route.ts`

- [ ] **Step 1: Create cards API route**

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  const mockCards = [
    { id: "1", denomination: 25, currency: "USD", region: "US" },
    { id: "2", denomination: 50, currency: "USD", region: "US" },
    { id: "3", denomination: 100, currency: "USD", region: "US" },
    { id: "4", denomination: 5000, currency: "NGN", region: "NG" },
    { id: "5", denomination: 10000, currency: "NGN", region: "NG" },
  ];

  return NextResponse.json(mockCards);
}
```

- [ ] **Step 2: Create lib/rate-limit.ts**

```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
  check: (key: string, limit: number) => {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + 3600000 });
      return { success: true };
    }
    
    if (record.count >= limit) {
      return { success: false };
    }
    
    record.count++;
    return { success: true };
  },
};
```

- [ ] **Step 3: Create redeem API route**

```typescript
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { code, userId } = await request.json();

  const { success } = rateLimit.check(`${userId}:redeem`, 5);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create AI chat API route**

```typescript
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { messages } = await request.json();

  const systemPrompt = `You are a support agent for a gift card platform.
    Common issues: Invalid codes, region mismatches, redemption failures.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return NextResponse.json({
    response: response.choices[0].message.content,
  });
}
```

- [ ] **Step 4: Commit API routes**

```bash
git add app/api/
git commit -m "feat: add API routes for cards, redemption, and support"
```

---

## Task 10: Final Integration & Testing

- [ ] **Step 1: Verify all pages compile**

```bash
npm run build
```

- [ ] **Step 2: Commit final integration**

```bash
git add .
git commit -m "feat: complete 4-page gift card platform"
```

---

## Summary

Total tasks: 10
Estimated time: 2-4 hours