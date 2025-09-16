
import { NextResponse, type NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Just a placeholder, no auth logic here yet
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}
