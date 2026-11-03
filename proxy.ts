import {NextResponse,type NextRequest} from 'next/server';
import {getZodiac,periodFromSuffix} from './lib/zodiac';
// Validate before streaming so invalid dynamic routes return a genuine HTTP 404.
// Next 16 names this request-boundary convention proxy.ts (formerly middleware.ts).
export function proxy(request:NextRequest){
 const parts=request.nextUrl.pathname.split('/').filter(Boolean);
 const valid=parts.length===1 || (parts.length===2&&!!getZodiac(parts[1])) || (parts.length===3&&!!getZodiac(parts[1])&&!!periodFromSuffix(parts[2]));
 if(!valid)return NextResponse.rewrite(new URL('/zodiac-not-found',request.url),{status:404});
 return NextResponse.next();
}
export const config={matcher:'/zodiak/:path*'};
