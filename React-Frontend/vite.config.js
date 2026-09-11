import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스 허용
    port: 5173,      // 컨테이너 내부 포트 고정
    strictPort: true // 5173 포트 사용 불가시 차단 (포트 꼬임 방지)
  }
})