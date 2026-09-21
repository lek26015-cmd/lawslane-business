import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['th', 'en', 'zh'],

    // Used when no locale matches
    defaultLocale: 'th'
});

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip internationalization for lawyer portal routes, icon, and system paths
    if (
        pathname.startsWith('/lawyer-') ||
        pathname.startsWith('/request') ||
        pathname.startsWith('/close-case') ||
        pathname.startsWith('/icon') ||
        pathname.startsWith('/api')
    ) {
        const response = NextResponse.next();
        response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
        return response;
    }

    // 1. Internationalization Middleware
    const response = intlMiddleware(request);

    // Add Security Headers
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');

    return response;
}

export const config = {
    // Match all pathnames except for:
    // - /api, /_next, /_vercel (system routes)
    // - Files with extensions (e.g. favicon.ico)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};
