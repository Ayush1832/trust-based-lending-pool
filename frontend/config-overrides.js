module.exports = function override(config) {
    // Modify Webpack configuration to ignore source maps for web3
    config.module.rules.push({
      test: /\.js/,
      enforce: 'pre',
      include: /node_modules[\\/]web3/,
      use: [
        {
          loader: 'source-map-loader',
          options: {
            filterSourceMappingUrl: () => false, // Skip source map processing for web3
          },
        },
      ],
    });
  
    return config;
  };