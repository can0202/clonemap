import {NextResponse} from 'next/server';

// const allowedOrigins = process.env.NODE_ENV === 'production'
//     ? ['https://www.yoursite.com', 'https://yoursite.com']
//     : ['http://localhost:3000']

export function middleware(request) {
  // const origin = request.headers.get('origin')
  // if (origin && !allowedOrigins.includes(origin)) {
  //     return new NextResponse(null, {
  //         status: 400,
  //         statusText: "Bad Request",
  //         headers: {
  //             'Content-Type': 'text/plain'
  //         }
  //     })
  // }
  // console.log(request.method)
  // console.log(request.url)

  // request.headers.set('Accept-Language', request.cookies.langServer);
  // console.log('Middleware!', request.headers);

  return NextResponse.next();
}

// export const config = {
//     matcher: '/*',
// }
