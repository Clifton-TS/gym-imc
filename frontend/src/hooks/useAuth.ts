import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth, router]);

  return auth;
}
