import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const authObject = await auth();

  if ((pathname.startsWith('/create-post') || pathname.startsWith('/profile')) && !authObject.userId) {
    return NextResponse.redirect('/');
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/(.*)', // Apply middleware to all routes that need access to Clerk helpers
  ],
};