Page Structure Overview
Table
Page	Purpose	Key Features
1. Landing & Auth	Entry point, authentication, trust signals	Clerk auth, 2FA setup, security badges
2. Dashboard	Core user operations	Redeem cards, view inventory, redeem codes
3. Checkout & Payments	Payment processing	Multi-gateway support (Stripe/Paystack), PCI compliance
4. Support & Admin	Customer service & disputes	AI chat, dispute resolution, geo-restrictions
Page 1: Landing & Authentication (/auth or /)
Purpose
First impression + secure entry with Clerk authentication and 2FA enforcement.
Components Structure
plain
Copy

/app/auth/page.tsx
├── HeroSection          # Trust signals, security badges
├── AuthTabs             # Login / Register toggle
│   ├── ClerkSignIn      # @clerk/nextjs component
│   └── ClerkSignUp      # With 2FA setup flow
├── SecurityBadges       # PCI DSS, encryption icons
└── GeoRedirect          # Auto-detect US vs Nigeria

Key Technical Implementation
TypeScript
Copy

// middleware.ts - Route protection & geo-detection
import { authMiddleware } from "@clerk/nextjs";
import { geolocation } from "@vercel/functions";

export default authMiddleware({
  publicRoutes: ["/", "/auth"],
  afterAuth(auth, req) {
    // Detect user region for payment routing
    const geo = geolocation(req);
    const region = geo.country === "NG" ? "nigeria" : "us";
    req.headers.set("x-user-region", region);
  }
});

Content Sections

    Hero Banner: "Secure Digital Gift Cards - Instant Delivery"
    Trust Indicators: PCI DSS badge, AES-256 encryption lock, 24/7 support
    Auth Forms: Clerk-powered with mandatory 2FA via authenticator app
    Regional Detection: Auto-detect location to show relevant payment methods

Page 2: Dashboard (/dashboard)
Purpose
Primary user interface for buying, viewing, and redeeming gift cards.
Components Structure
plain
Copy

/app/dashboard/page.tsx
├── Header               # User balance, notifications
├── TabNavigation        # Buy | My Cards | Redeem | History
├── BuySection
│   ├── CardGrid         # Available gift cards
│   ├── FilterBar        # Category, price range, region
│   └── QuickBuyModal    # Express checkout
├── MyCardsSection
│   ├── CardInventory    # Unused/Used/Expired tabs
│   └── CardDetails      # QR code, code reveal (masked)
├── RedeemSection
│   ├── RedeemForm       # Code input with validation
│   └── RedemptionStatus # Success/failure feedback
└── TransactionHistory   # Pagination, export CSV

Key Technical Implementation
TypeScript
Copy

// Card inventory with Prisma types
interface GiftCard {
  id: string;
  code: string;           // AES-256 encrypted
  status: "UNUSED" | "USED" | "EXPIRED";
  denomination: number;
  currency: "USD" | "NGN";
  region: "US" | "NG";
  expiresAt: Date;
  userId?: string;        // Null until purchased
}

// Redemption logic (API route)
// POST /api/cards/redeem
async function redeemCard(code: string, userId: string) {
  const decryptedCode = decrypt(code); // AES-256-GCM
  const card = await prisma.giftCard.findUnique({
    where: { code: decryptedCode, status: "UNUSED" }
  });
  
  if (!card) throw new Error("Invalid or used code");
  if (card.region !== user.region) throw new Error("Geo-restricted");
  
  await prisma.$transaction([
    prisma.giftCard.update({
      where: { id: card.id },
      data: { status: "USED", userId, redeemedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: card.denomination } }
    })
  ]);
}

Content Sections

    Card Marketplace: Grid of available cards (Amazon, Steam, Netflix, etc.)
    Region Filtering: Toggle US/NG cards based on user location
    Inventory Management: Visual status indicators (green=unused, gray=used, red=expired)
    Redemption Interface: Secure code input with rate limiting (5 attempts/hour)

Page 3: Checkout & Payment Processing (/checkout)
Purpose
Handle payments securely with region-specific gateways and PCI compliance.
Components Structure
plain
Copy

/app/checkout/page.tsx
├── OrderSummary         # Card details, total calculation
├── PaymentMethodSelector # Dynamic based on region
│   ├── USMethods        # Stripe: Card, PayPal, Apple Pay, Google Pay
│   └── NGMethods        # Paystack: Card, Bank Transfer, USSD, QR
├── PaymentForm
│   ├── StripeElements   # PCI-compliant card form
│   ├── PaystackPopup    # Nigerian local methods
│   └── CryptoOption     # Future expansion
├── SecurityOverlay      # Encryption indicators, CVV never stored
└── ConfirmationModal    # Success + email receipt

Key Technical Implementation
TypeScript
Copy

// Region-specific payment routing
// lib/payments.ts
export const getPaymentProvider = (region: "US" | "NG") => {
  if (region === "NG") {
    return {
      gateway: "paystack",
      methods: ["card", "bank_transfer", "ussd", "qr", "mobile_money"],
      currency: "NGN"
    };
  }
  return {
    gateway: "stripe",
    methods: ["card", "paypal", "apple_pay", "google_pay"],
    currency: "USD"
  };
};

// API Route: /api/payments/initiate
// Server-side only - never expose secrets to client
import Stripe from "stripe";
import paystack from "paystack-api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true
});

export async function POST(req: Request) {
  const { region, amount, method } = await req.json();
  
  if (region === "US") {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    });
    return { clientSecret: paymentIntent.client_secret };
  }
  
  // Nigeria - Paystack
  const transaction = await paystack(process.env.PAYSTACK_SECRET)
    .transaction.initialize({
      email: user.email,
      amount: amount * 100, // kobo
      channels: ["card", "bank", "ussd", "qr"]
    });
  return { authorizationUrl: transaction.data.authorization_url };
}

Content Sections

    Order Review: Card image, denomination, fees breakdown
    Payment Methods:
        US Users: Credit/Debit cards, PayPal, Apple Pay, Google Pay (Stripe)
        Nigeria Users: Bank transfer, USSD (*737#), QR scan, OPay/Paga wallets (Paystack)
    Security Notices: "We never store your CVV", "Encrypted with AES-256"
    Rate Limiting: Visual countdown for retry attempts

Page 4: Support & Dispute Center (/support)
Purpose
AI-powered customer service, dispute resolution, and geo-restriction management.
Components Structure
plain
Copy

/app/support/page.tsx
├── SupportHub
│   ├── AIChatWidget     # OpenAI/Claude integration
│   ├── QuickActions     # "Card not working", "Wrong region", etc.
│   └── KnowledgeBase    # Searchable FAQ
├── DisputeCenter
│   ├── FileDisputeForm  # Transaction ID, issue type, evidence upload
│   ├── DisputeStatus    # Track resolution progress
│   └── ResolutionHistory # Past disputes
├── GeoRestrictionPanel  # User-side region settings
│   ├── CurrentRegion    # Detected IP location
│   ├── TravelMode       # Temporary region override
│   └── WarningBanners   # "This card only works in Nigeria"
└── AdminEscalation      # Human support ticket creation

Key Technical Implementation
TypeScript
Copy

// AI Customer Support integration
// app/api/support/chat/route.ts
import { OpenAIStream } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, userId } = await req.json();
  
  // Context-aware system prompt
  const systemPrompt = `
    You are a support agent for a gift card platform.
    User context: ${await getUserContext(userId)}
    Common issues: Invalid codes, region mismatches, redemption failures.
    If unable to resolve, escalate to human with summary.
  `;
  
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true
  });
  
  return new Response(OpenAIStream(stream));
}

// Dispute resolution workflow
// prisma/schema.prisma
model Dispute {
  id          String   @id @default(uuid())
  userId      String
  transactionId String
  type        DisputeType  // INVALID_CODE, ALREADY_USED, WRONG_REGION
  status      DisputeStatus // PENDING, UNDER_REVIEW, RESOLVED, REJECTED
  evidence    String[]     // S3 URLs
  resolution  String?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
}

Content Sections

    AI Chat Interface: Floating widget with context-aware responses
    Dispute Forms:
        "My code says already used" → Automated check against blockchain-style audit log
        "Wrong region" → Geo-IP verification with manual override request
        "Invalid code" → Bulk upload verification against issuer API
    Region Management:
        Current location display with VPN detection warning
        Travel mode: "I'll be in Nigeria next week, unlock NGN cards"
    Escalation Path: AI → Human agent (24hr SLA) → Arbitration for high-value disputes

Project Structure
plain
Copy

/giftcard-platform
├── /app
│   ├── /auth              # Page 1: Landing + Clerk auth
│   ├── /dashboard         # Page 2: Card management
│   ├── /checkout          # Page 3: Payment processing
│   ├── /support           # Page 4: AI support + disputes
│   ├── /api
│   │   ├── /auth          # Clerk webhooks
│   │   ├── /cards         # CRUD + redemption
│   │   ├── /payments      # Stripe/Paystack handlers
│   │   ├── /support       # AI chat + disputes
│   │   └── /webhooks      # Payment confirmations
│   ├── layout.tsx         # Root with CSP headers
│   └── middleware.ts      # Auth + geo-detection
├── /server                # Express microservices
│   ├── /inventory         # Card code generation/bulk upload
│   ├── /redemption        # Validation engine
│   └── /audit             # Security logging
├── /lib
│   ├── /prisma            # Database schema & client
│   ├── /payments          # Gateway abstractions
│   ├── /encryption        # AES-256 utilities
│   └── /geo               # Region detection
├── /components
│   ├── /ui                # Shadcn/Tailwind components
│   ├── /auth              # Clerk wrappers
│   ├── /payment           # Stripe Elements, Paystack
│   └── /security          # Badges, indicators
├── docker-compose.yml     # Postgres + Redis
└── package.json           # Bun workspace

Security Checklist Implementation
Table
Requirement	Implementation Location
HTTPS/HSTS	next.config.js headers + Vercel/NGINX
CSP Headers	middleware.ts
AES-256 Encryption	/lib/encryption.ts - Card codes at rest
PCI DSS	Stripe Elements/Paystack Popup - Never touch PAN
Rate Limiting	Redis + express-rate-limit on API routes
CAPTCHA	react-google-recaptcha on auth + redemption
Audit Logging	/server/audit - All transactions immutable
Database Schema (Prisma)
prisma
Copy

// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  clerkId       String    @unique
  email         String    @unique
  region        String    // US or NG
  balance       Decimal   @default(0)
  twoFactorEnabled Boolean @default(false)
  createdAt     DateTime  @default(now())
  cards         GiftCard[]
  transactions  Transaction[]
  disputes      Dispute[]
}

model GiftCard {
  id            String    @id @default(uuid())
  codeEncrypted String    // AES-256-GCM
  iv            String    // Initialization vector
  denomination  Decimal
  currency      String    // USD or NGN
  region        String    // US or NG
  status        CardStatus @default(UNUSED)
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  purchasedAt   DateTime?
  redeemedAt    DateTime?
  expiresAt     DateTime
}

model Transaction {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  amount        Decimal
  currency      String
  gateway       String    // stripe or paystack
  gatewayRef    String    // External transaction ID
  status        TransactionStatus
  metadata      Json      // Payment method details
  createdAt     DateTime  @default(now())
}

enum CardStatus { UNUSED USED EXPIRED }
enum TransactionStatus { PENDING COMPLETED FAILED REFUNDED }

Next Steps

    Initialize Project: bun create next-app with TypeScript + Tailwind
    Install Core Dependencies:
    bash

Copy

bun add @clerk/nextjs @prisma/client @stripe/stripe-js paystack-api
bun add -d prisma @types/node

Set Up Express Server: Separate /server directory for redemption logic
Configure Environment: .env.local with Clerk, Stripe, Paystack, OpenAI keys
Deploy Strategy:

    Frontend: Vercel (Edge for geo-detection)
    Database: Supabase Postgres or Railway
    Express Server: Railway/Render for redemption microservice
