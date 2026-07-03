import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.redirect(
    `${API_URL}/settings/company-profile/download`,
    302
  )
}
