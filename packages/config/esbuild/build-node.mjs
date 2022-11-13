import { build } from 'esbuild';
import fg from 'fast-glob';
import { rmDistDirPlugin } from './rm-dist-dir.mjs';

export const buildNode = async ({ ...args }) => {
    await build({
        entryPoints: await fg('src/**/*.ts'),
        platform: 'node',
        target: 'node16',
        format: 'esm',
        outdir: './dist',
        sourcemap: false,
        logLevel: 'info',
        minify: true,
        plugins: [rmDistDirPlugin()],
        ...args
    })
};
