import "@testing-library/jest-dom";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn(() => Promise.resolve({ userId: "test-user-id" })),
  useUser: () => ({
    user: { id: "test-user-id", emailAddresses: [{ emailAddress: "test@example.com" }] },
    isLoaded: true,
  }),
  UserButton: () => <div>UserButton</div>,
  SignOutButton: ({ children }: any) => <button>{children}</button>,
  ClerkProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/test",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/test",
}));