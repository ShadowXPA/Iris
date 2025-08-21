import { Constants } from '@/lib/constants'
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: Constants.MAX_FILE_SIZE,
    },
  },
}

export default nextConfig
