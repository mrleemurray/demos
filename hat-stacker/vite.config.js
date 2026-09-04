import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hat-stacker/',
  test: {
    environment: 'jsdom',
    restoreMocks: true,
  },
});
