import { NextResponse } from "next/server";

const categories = [
  { id: "shopping", name: "Shopping", icon: "🛒", popular: true },
  { id: "gaming", name: "Gaming", icon: "🎮", popular: true },
  { id: "streaming", name: "Streaming", icon: "🎬", popular: true },
  { id: "music", name: "Music", icon: "🎵", popular: false },
  { id: "food", name: "Food & Drink", icon: "🍔", popular: false },
  { id: "utilities", name: "Utilities", icon: "💡", popular: false },
  { id: "entertainment", name: "Entertainment", icon: "🎭", popular: false },
  { id: "software", name: "Software", icon: "💻", popular: false },
];

export async function GET() {
  return NextResponse.json({ categories });
}