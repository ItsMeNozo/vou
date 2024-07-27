declare module "shake.js" {
  interface ShakeOptions {
    threshold?: number;
    timeout?: number;
  }

  class Shake {
    constructor(options?: ShakeOptions);
    start(): void;
    stop(): void;
  }

  export default Shake;
}
