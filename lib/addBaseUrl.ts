// export function addBaseURL(url: string): string {
//     const env = process.env.NODE_ENV;

//     if (env === 'development') {
//         return `http://localhost:3000/${url}`;
//     } else {
//         // if (process.env.VERCEL_URL) {
//         return `/${url}`;
//         // }
//     }
// }

export function addBaseURL(url: string): string {
  const env = process.env.NODE_ENV;

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (env === "development") {
    return `http://localhost:3000/${url}`;
  } else {
    if (vercelUrl) {
      return `${vercelUrl}/${url}`;
    } else {
      throw new Error(
        "VERCEL_URL or NEXT_PUBLIC_VERCEL_URL environment variable is not set"
      );
    }
  }
}

export function getBaseUrl(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (!vercelUrl) {
      throw new Error(
        "NEXT_PUBLIC_VERCEL_URL environment variable is not defined"
      );
    }
    return vercelUrl;
  }
}
