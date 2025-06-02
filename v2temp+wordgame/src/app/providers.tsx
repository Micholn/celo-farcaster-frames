"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { http } from "viem";
import { frameConnector } from "~/lib/connector";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({ 
  chains: [celo, celoAlfajores],
  connectors: [frameConnector()],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const WagmiProviderDynamic = dynamic(
  () => import("wagmi").then((mod) => mod.WagmiProvider),
  {
    ssr: false,
    loading: () => <div>Loading wallet provider...</div>,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> {/* Removed the `session` prop */}
      <WagmiProviderDynamic config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProviderDynamic>
    </SessionProvider>
  );
}
