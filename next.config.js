module.exports = {
  experimental: {
    reactRoot: true,
    concurrentFeatures: true,
    serverComponents: true,
  },
  webpack(config) {
    config.optimization.realContentHash = false
    return config
  }
}
