const { GasPlugin } = require('esbuild-gas-plugin');

require('esbuild').build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  plugins: [GasPlugin]
}).catch(() => process.exit(1))