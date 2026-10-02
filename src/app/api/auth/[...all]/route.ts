import { toNextJsHandler } from "better-auth/next-js";
import { userAuth } from "@/lib/user-auth";

export const { GET, POST } = toNextJsHandler(userAuth);