import { ReactNode } from "react";
import ClientProviders from "./clientProviders";

export const metadata = {
  title: "Gym IMC",
  description: "Bem-vindo ao Gym IMC!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}