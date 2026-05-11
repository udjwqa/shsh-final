import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/:path*",
    "/settings/:path*",
    "/chat/:path*",
    "/api/listings/:path*",
    "/api/settings/:path*",
    "/api/seller-templates/:path*",
    "/api/chat-templates/:path*",
    "/api/upload/:path*",
    "/api/scrape/:path*",
  ],
};
