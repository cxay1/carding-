# Gift Card Platform - Technical Specification

## Project Overview

**Project Name:** ChargeLine - Digital Gift Card Platform  
**Type:** Full-stack web application (4 pages)  
**Core Functionality:** Secure gift card marketplace with multi-region payment processing, card redemption, and AI-powered support  
**Target Users:** US and Nigerian consumers purchasing digital gift cards

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Authentication | Clerk (@clerk/nextjs) with 2FA |
| Database | PostgreSQL with Prisma ORM |
| Backend | Express + TypeScript (separate server) |
| Payments | Stripe (US) + Paystack (Nigeria) |
| Components | Existing library in `/components` folder |

---

## Page Structure

### Page 1: Landing & Authentication (`/auth`)

**Route:** `/app/auth/page.tsx`  
**Purpose:** First impression + secure entry

**Components:**
- `HeroSection` - Trust signals, security badges
- `AuthTabs` - Login / Register toggle
- `ClerkSignIn` - @clerk/nextjs component
- `ClerkSignUp` - With 2FA setup flow
- `SecurityBadges` - PCI DSS, encryption icons
- `GeoRedirect` - Auto-detect US vs Nigeria

**Technical:**
- Middleware for route protection & geo-detection
- Headers: `x-user-region` set based on geo

**Content Sections:**
- Hero Banner: "Secure Digital Gift Cards - Instant Delivery"
- Trust Indicators: PCI DSS badge, AES-256 encryption lock, 24/7 support
- Auth Forms: Clerk-powered with mandatory 2FA via authenticator app
- Regional Detection: Auto-detect location to show relevant payment methods

---

### Page 2: Dashboard (`/dashboard`)

**Route:** `/app/dashboard/page.tsx`  
**Purpose:** Primary user interface for buying, viewing, and redeeming gift cards

**Components:**
- `Header` - User balance, notifications
- `TabNavigation` - Buy | My Cards | Redeem | History
- `BuySection` - Card grid, filter bar, quick buy modal
- `MyCardsSection` - Card inventory with status tabs
- `RedeemSection` - Code input with validation
- `TransactionHistory` - Pagination, export CSV

**Technical:**
- GiftCard interface with AES-256 encrypted codes
- Status: UNUSED | USED | EXPIRED
- API: `/api/cards/redeem` with rate limiting (5 attempts/hour)

**Content Sections:**
- Card Marketplace: Grid of available cards (Amazon, Steam, Netflix, etc.)
- Region Filtering: Toggle US/NG cards based on user location
- Inventory Management: Visual status indicators
- Redemption Interface: Secure code input with rate limiting

---

### Page 3: Checkout & Payment (`/checkout`)

**Route:** `/app/checkout/page.tsx`  
**Purpose:** Payment processing with region-specific gateways

**Components:**
- `OrderSummary` - Card details, total calculation
- `PaymentMethodSelector` - Dynamic based on region
- `USMethods` - Stripe: Card, PayPal, Apple Pay, Google Pay
- `NGMethods` - Paystack: Card, Bank Transfer, USSD, QR
- `PaymentForm` - Stripe Elements / Paystack Popup
- `SecurityOverlay` - Encryption indicators
- `ConfirmationModal` - Success + email receipt

**Technical:**
- Region-specific payment routing
- Server-side only payment initiation (never expose secrets)
- API: `/api/payments/initiate`

**Content Sections:**
- Order Review: Card image, denomination, fees breakdown
- Payment Methods (US): Credit/Debit cards, PayPal, Apple Pay, Google Pay
- Payment Methods (Nigeria): Bank transfer, USSD (*737#), QR scan, OPay
- Security Notices: "We never store your CVV", "Encrypted with AES-256"

---

### Page 4: Support & Dispute Center (`/support`)

**Route:** `/app/support/page.tsx`  
**Purpose:** AI-powered customer service, dispute resolution

**Components:**
- `SupportHub` - AI chat widget, quick actions, knowledge base
- `DisputeCenter` - File dispute form, status tracking
- `GeoRestrictionPanel` - User region settings
- `AdminEscalation` - Human support ticket creation

**Technical:**
- OpenAI integration for AI-chat
- Dispute workflow with evidence upload
- Prisma schema for Dispute model
- API: `/api/support/chat`

**Content Sections:**
- AI Chat Interface: Floating widget with context-aware responses
- Dispute Forms: Invalid codes, region mismatches, redemption failures
- Region Management: Current location, travel mode override
- Escalation Path: AI → Human agent (24hr SLA)

---

## Component Library Integration

### Reusable Components from `/components`

| Component | Usage |
|-----------|-------|
| `HeroSection` | Landing page hero |
| `FeatureCard` | Gift card display in marketplace |
| `ParallaxReveal` | Page transition animations |
| `BentoGrid` | Dashboard card layout |
| `MasonryStagger` | Card inventory layout |
| `ErrorBoundary` | App-wide error handling |
| `useScroll` | Scroll-based animations |
| `useAnimationStore` | Animation state management |

### New Components to Create

| Component | Location |
|-----------|----------|
| `AuthTabs` | `/app/components/auth/` |
| `SecurityBadges` | `/app/components/security/` |
| `PaymentMethodSelector` | `/app/components/payment/` |
| `CardInventory` | `/app/components/cards/` |
| `AIChatWidget` | `/app/components/support/` |
| `DisputeForm` | `/app/components/dispute/` |

---

## Data Models (Prisma Schema)

```prisma
model User {
  id              String    @id @default(uuid())
  clerkId          String    @unique
  email           String    @unique
  region          String    // US or NG
  balance         Decimal   @default(0)
  twoFactorEnabled Boolean  @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  cards           GiftCard[]
  transactions   Transaction[]
  disputes       Dispute[]
}

model GiftCard {
  id              String    @id @default(uuid())
  codeEncrypted   String    // AES-256-GCM
  iv              String
  denomination    Decimal
  currency        String    // USD or NGN
  region          String    // US or NG
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
  gateway       String    // stripe or paystack
  gatewayRef    String
  status        TransactionStatus
  metadata      Json
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Dispute {
  id            String    @id @default(uuid())
  userId        String
  transactionId String
  type          DisputeType
  status        DisputeStatus
  evidence      String[]
  resolution   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  resolvedAt    DateTime?
}

enum CardStatus { UNUSED USED EXPIRED }
enum TransactionStatus { PENDING COMPLETED FAILED REFUNDED }
enum DisputeType { INVALID_CODE, ALREADY_USED, WRONG_REGION }
enum DisputeStatus { PENDING, UNDER_REVIEW, RESOLVED, REJECTED }
```

---

## Backend Architecture (Express Server)

### Server Structure

```
/server
├── src/
│   ├── index.ts          # Express server entry
│   ├── routes/
│   │   ├── inventory.ts   # Card code CRUD
│   │   ├── redemption.ts # Validation engine
│   │   └── audit.ts      # Security logging
│   ├── services/
│   │   ├── encryption.ts  # AES-256 utilities
│   │   └── geo.ts         # Region detection
│   └── middleware/
│       └── rateLimit.ts  # Rate limiting
├── package.json
└── tsconfig.json
```

### API Endpoints

| Route | Method | Purpose |
|------|--------|---------|
| `/api/inventory` | GET | List available cards |
| `/api/inventory` | POST | Bulk upload card codes |
| `/api/redemption` | POST | Validate and redeem code |
| `/api/audit` | GET | Query audit logs |

---

## Security Implementation

| Requirement | Implementation |
|--------------|-----------------|
| HTTPS/HSTS | next.config.js headers |
| CSP Headers | middleware.ts |
| AES-256 Encryption | `/server/services/encryption.ts` |
| PCI DSS | Stripe Elements / Paystack Popup |
| Rate Limiting | Redis + express-rate-limit |
| Audit Logging | `/server/routes/audit.ts` |

---

## Middleware (`/app/middleware.ts`)

```typescript
import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/auth"],
});

export function middleware(request: NextRequest) {
  const country = request.geo?.country || "US";
  const region = country === "NG" ? "nigeria" : "us";
  
  const response = NextResponse.next();
  response.headers.set("x-user-region", region);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
```

**Note:** 2FA enforcement must be configured in Clerk Dashboard - enable "Second Factor" in Clerk settings.

**Note:** Rate limiting uses in-memory storage for development. For production, add `REDIS_URL` to environment variables.

---

## Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## Environment Variables

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Payments (US)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Payments (Nigeria)
PAYSTACK_SECRET_KEY=

# AI Support
OPENAI_API_KEY=

# Encryption (AES-256)
ENCRYPTION_KEY=32-character-encryption-key

# Rate Limiting (optional - defaults to in-memory)
REDIS_URL=

# Express Server
EXPRESS_PORT=4000
```

---

## Acceptance Criteria

1. **Authentication:**
   - [ ] User can sign up with email/password
   - [ ] User can sign in via Clerk
   - [ ] 2FA is enforced after sign up
   - [ ] Geo-detection sets correct region header

2. **Dashboard:**
   - [ ] Gift cards display in grid layout
   - [ ] Region filter works correctly
   - [ ] User can view their purchased cards
   - [ ] Redemption form validates codes with rate limiting

3. **Checkout:**
   - [ ] Order summary displays correctly
   - [ ] US users see Stripe payment options
   - [ ] Nigeria users see Paystack options
   - [ ] Payment processes successfully

4. **Support:**
   - [ ] AI chat widget responds to queries
   - [ ] Dispute form submits correctly
   - [ ] Geo-restriction panel shows current region
   - [ ] Travel mode allows region override

5. **Security:**
   - [ ] Card codes encrypted at rest
   - [ ] CSP headers configured
   - [ ] Rate limiting active (5 attempts/hour)
   - [ ] Audit logs recorded

6. **Additional Features:**
   - [ ] CSV export from transaction history
   - [ ] Email receipt on successful payment
   - [ ] Travel mode region override works
   - [ ] Admin escalation creates support ticket