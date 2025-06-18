import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const authObject = await auth();

  if ((pathname.startsWith('/create-post') || pathname.startsWith('/profile')) && !authObject.userId) {
    const url = process.env.URL;
    if (!url) {
      throw new Error('URL environment variable is not set');
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/(.*)',
  ],
};