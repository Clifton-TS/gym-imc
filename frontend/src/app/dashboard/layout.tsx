"use client";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/NavBar";
import { AuthContext } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth, auth?.isAuthenticated, router]);

  if (!auth || !auth.isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <NavBar />
      <Box p="6">{children}</Box>
    </>
  );
}
