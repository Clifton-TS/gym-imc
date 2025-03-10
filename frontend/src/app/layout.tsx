import { ReactNode } from "react";
import ClientProviders from "./clientProviders";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Gym IMC",
  description: "Bem-vindo ao Gym IMC!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}