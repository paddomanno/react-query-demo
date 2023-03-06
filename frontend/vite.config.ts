import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import http from 'https';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // add backend as proxy
    // use with frontend-URL.com/api/...
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
        },
      },
    },
  };
});
