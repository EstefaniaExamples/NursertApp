import esbuild from 'esbuild';

async (infile) => 
    esbuild
        .build({
            entryPoints: [infile],
            outdir: 'build',
            bundle: true,
            sourcemap: true,
            minify: true,
            splitting: true,
            format: 'esm',
            platform: 'node',
            target: ['esnext'],
            outExtension: {'.js': '.mjs'}, 
            // define: { 'require.resolve': undefined}
        });
