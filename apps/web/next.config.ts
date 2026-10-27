import type { NextConfig } from "next"
import path from "node:path"
import { fileURLToPath } from "node:url"

const appDir = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(appDir, "../.."),
  allowedDevOrigins: ["127.0.0.1"],
  agentRules: false,
}

export default nextConfig
