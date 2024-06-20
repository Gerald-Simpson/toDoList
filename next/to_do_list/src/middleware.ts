import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // if client has cookie id, do nothing, otherwise create universally unique identifier (UUID)
  if (!request.cookies.has('id')) {
    let uuid = self.crypto.randomUUID();
    response.cookies.set('id', uuid);
  }

  return response;
}
