export { default } from "next-auth/middleware";
//define the routes that should be protected else every route
export const config = { matcher: ["/protected"] };
