// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };


//--------------

import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// Middleware to protect pages
export default function middleware(req: NextRequest) {
  // Get the user authentication details
  const { userId } = getAuth(req);

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = '/sign-in';  // Redirect to sign-in page
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated, allow the request to continue
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/details/:path*', '/appointments', '/profile'], // Protected routes
};



//-----------
//import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
 
// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }
 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }






