import { rm } from 'fs/promises';

const rmDistDir = async ({ path }) => {
    try {
        await rm(path, { recursive: true });
    } catch (error) { }
}

export const rmDistDirPlugin = () => ({
    name: 'rm dist dir',
    setup({ onStart }) {
        onStart(async () => {
            await rmDistDir({ path: './dist' });
        })
    }
});