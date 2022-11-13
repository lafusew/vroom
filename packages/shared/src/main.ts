export class Test {
    public a: number;
    public b: string;
    constructor() {
        this.a = 1;
        this.b = 'b';
    }
}

export const main = 'Hello from the shared package !';
export const test = new Test();
export { utility } from './utils/index.js';
