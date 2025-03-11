"use client";
import { Box } from "@chakra-ui/react";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <Box p="6">
        {children}
      </Box>
    </>
  );
}
