// 纯对象配置，避免解析宿主依赖（便于离线/任意环境构建）
export default {
  // 相对路径，构建产物可部署到根路径或任意子路径
  base: './',
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
};
