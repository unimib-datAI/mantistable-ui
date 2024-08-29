import "~/styles/globals.css";
import { Header } from "~/app/components/headers/header";
import { Sidebar } from "~/app/components/sidebar/sidebar";
import { TRPCReactProvider } from "~/trpc/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-layout grid-rows-layout font-sans antialiased grid-areas-layout">
      <div className="flex bg-mantis-green-400 grid-in-header">
        <Header />
      </div>
      <div className="bg-mantis-green-500 grid-in-sidebar">
        <Sidebar />
      </div>
      <main className="grid-in-main">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </main>
    </div>
  );
}
