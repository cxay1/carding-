import { auth } from "@clerk/nextjs";
import { headers } from "next/headers";

export async function getUserRegion(): Promise<"US" | "NG"> {
  const headersList = headers();
  const regionHeader = headersList.get("x-user-region");
  return regionHeader === "nigeria" ? "NG" : "US";
}

export async function getUserContext() {
  const { userId } = auth();
  if (!userId) return null;

  return {
    userId,
    region: await getUserRegion(),
  };
}

export async function getUserBalance(): Promise<number> {
  return 0;
}

export async function getUserCards(): Promise<any[]> {
  return [];
}