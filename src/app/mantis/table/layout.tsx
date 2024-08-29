import "~/styles/globals.css";
import { SidebarTable } from "~/app/components/sidebar/sidebarTable";
import { TRPCReactProvider } from "~/trpc/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid-areas-tableLayout grid-cols-tableLayout relative flex min-h-screen flex-row font-sans antialiased">
      <div className="bg-mantis-green-500">
        <SidebarTable className="grid-in-sidebar" />
      </div>
      <main className="w-[calc(100%_-_4rem)] grid-in-main">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </main>
    </div>
  );
}
