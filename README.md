# 米奇生日惊喜 · 专属纪念网页

本目录为纯静态播放版部署包（彻底隐藏配置台，内含 `.nojekyll` 与全量素材资源）。

## 部署到 Cloudflare Pages（推荐，国内访问更快）
1. 方式 A（自动同步）：在 Cloudflare 控制台进入 `Workers & Pages -> Create -> Pages -> Connect to Git`，选择本仓库，Framework preset 选 `None`，Build command 与 Output directory 均留空（或填 `/`），点 `Save and Deploy`。
2. 方式 B（直接上传）：在 Cloudflare Pages 选 `Direct Upload`，直接拖入本目录或压缩包 `.zip` 即可上线。

## 部署到 GitHub Pages
1. 在仓库 `Settings -> Pages` 中将 Source 设为 `Deploy from a branch`，分支选 `main` / `/ (root)` 并保存。
