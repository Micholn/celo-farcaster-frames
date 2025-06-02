import { render, screen } from "@testing-library/react";
import GamePage from "../page";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { http } from "viem";
import { frameConnector } from "~/lib/connector";

// Mocks
jest.mock("wagmi", () => ({
  ...jest.requireActual("wagmi"),
  useAccount: () => ({ isConnected: true, address: "0xTestAddress" }),
  useReadContract: () => ({ data: 100 }),
  useWriteContract: () => ({ writeContract: jest.fn() })
}));

// Setup providers
const queryClient = new QueryClient();
const wagmiConfig = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [frameConnector()],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

describe("GamePage", () => {
  it("displays Celo score", () => {
    render(
      <SessionProvider session={null}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <GamePage />
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    );
    
    expect(screen.getByText("Your High Score on Celo")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
