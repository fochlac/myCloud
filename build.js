const esbuild = require('esbuild');
const stylePlugin  = require( 'esbuild-style-plugin')
const copyStaticFiles = require('esbuild-copy-static-files');

const config = {
  entryPoints: ['web/index.js', 'web/sw.js'],
  bundle: true,
  minify: false,
  sourcemap: true,
  outdir: 'static',
  outbase: 'web',
  plugins: [
    stylePlugin({
      cssModulesMatch: /\.less$/
    }),
    copyStaticFiles({
      src: 'web/static',
      dest: 'static'
    }),
    copyStaticFiles({
      src: 'web/index.html',
      dest: 'static/index.html'
    })
  ],
  loader: {
    '.js': 'jsx',
    '.css': 'css',
    '.less': 'css',
    '.svg': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file'
  },
  resolveExtensions: ['.js', '.jsx', '.css', '.less'],
  define: {
    __SWVERSION__: `"version_${Date.now()}"`
  }
}

async function build() {
  const ctx = await esbuild.context(config);

  if (process.argv.includes('--serve')) {
    await ctx.watch();
    const { host, port } = await ctx.serve({
      servedir: 'static',
      port: 3000,
    });
    console.log(`Server is running at http://${host}:${port}`);
  } else {
    await ctx.rebuild();
    ctx.dispose();
  }
}

build().catch(() => process.exit(1));
