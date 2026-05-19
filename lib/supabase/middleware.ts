import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Auth protection disabled — direct access to all routes
  return NextResponse.next({ request })
}
