# 北疆11日游 · 交互地图站（Vite 工程）

面向贵宾【瞌睡涵】的北疆定制 11 日游交互展示站。深色驾驶舱风格，左侧行程列表 + 高德地图 + 详情卡 + 播放/翻站/重置 + 键盘 + 悬停。

## 目录结构
```
site/
├─ index.html          # 页面骨架，含高德 Key 脚本
├─ package.json        # dev/build/preview 脚本，依赖 vite
├─ vite.config.js      # base:'./'、dev 端口、构建输出 dist
├─ README.md
└─ src/
   ├─ main.js          # 交互逻辑（状态、选中、播放、翻站、键盘、地图联动）
   ├─ data.js          # 11 天行程数据（改行程只改这里）
   └─ style.css        # 全部样式与响应式
```

## 本地开发
```bash
cd site
npm install
npm run dev            # http://127.0.0.1:5173（vite 热更新）
```
> 若机器无外网装不了依赖，可复用本仓库 `xinjiang-map/node_modules` 里的 vite：
> ```
> node ..\xinjiang-map\node_modules\vite\bin\vite.js dev
> node ..\xinjiang-map\node_modules\vite\bin\vite.js build
> ```

## 生产构建
```bash
cd site
npm run build          # 输出到 site/dist/
```
构建产物为纯静态站（`index.html` + `assets/*`，相对路径 `base:'./'`），可直接部署。

## 预览构建产物
```bash
cd site
npm run preview        # 或 node ..\server.mjs（仓库根自带的静态服务器，指向 site/dist）
```
> ⚠️ 不要用 `file://` 双击打开 `dist/index.html`：Vite 产物带 `crossorigin`，本地文件会被浏览器拦截而无样式。请通过 HTTP 访问（dev / preview / 部署后的域名）。

## 部署到公网域名（免费静态托管）
1. **Netlify Drop**（最快）：把 `site/dist` 文件夹拖到 https://app.netlify.com/drop → 得到 `https://xxx.netlify.app`。
2. **Netlify / Vercel / Cloudflare Pages**（正式）：把 `site/` 仓库连上平台，Build command 填 `npm run build`，Publish directory 填 `dist`。
3. 绑定自己的域名：平台 Settings → Domain → Add custom domain，再按提示配置 DNS。

## ⚠️ 高德 Key 域名白名单（必做，否则地图不显示）
因地图用高德 JS API，最终上线域名（`xxx.netlify.app` 或你的域名）必须加进高德 Key 的**授权域名/域名白名单**：
- 登录高德开放平台 → 应用管理 → 找到该 Key → 白名单填入你的线上域名。
- 地图不显示时左侧交互仍可用，地图区会给出提示，即为白名单未生效。

## 修改指南
- 改行程：编辑 `src/data.js`（date/name/coord/waypoints/hotel/room/miles/summary/type）。
- 改样式：编辑 `src/style.css`（顶部为颜色 token）。
- 改交互：编辑 `src/main.js`（`activate / deselect / 播放 / 翻站 / 键盘`）。
