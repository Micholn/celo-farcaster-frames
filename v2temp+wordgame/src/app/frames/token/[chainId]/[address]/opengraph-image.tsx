import { ImageResponse } from "next/og";

export const alt = "Farcaster Token Frame OG Image";
export const size = {
  width: 600,
  height: 400,
};
export const contentType = "image/png";

// Force static generation
export const dynamic = "force-static";

// Pre-render specific chainId and address combinations
export async function generateStaticParams() {
  // Example: Pre-render for Celo (chainId: 42220) and a few token addresses
  const chainIds = ["42220"]; // Celo mainnet chain ID
  const addresses = [
    "0x471EcE3750Da237f93B8E339c536989b8978a438", // CELO token
    "0x765DE816845861e75A25fCA122bb6898B8B1282a", // cUSD token
  ];

  return chainIds.flatMap((chainId) =>
    addresses.map((address) => ({
      chainId,
      address,
    }))
  );
}

export default async function Image({ params }: { params: { chainId: string; address: string } }) {
  const { chainId, address } = params;

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-white">
        <h1 tw="text-4xl">Token Frame</h1>
        <p tw="text-2xl">Chain ID: {chainId}</p>
        <p tw="text-2xl">Address: {address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>
    ),
    {
      ...size,
    }
  );
}