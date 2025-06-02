// src/app/frames/hello/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Farcaster Frames Hello";
export const size = {
  width: 600,
  height: 400,
};
export const contentType = "image/png";

// Force static generation for next export
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-white">
        <h1 tw="text-6xl">Hello Frame</h1>
      </div>
    ),
    {
      ...size,
    }
  );
}