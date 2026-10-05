# Portfolio 改版实施与验收记录

日期：2026-10-02（America/Chicago）。本记录为本地交付文档；截图和基线哈希也保留在本地，不进入发布包。

## 阶段状态

| 阶段 | 状态 | 结果 |
| --- | --- | --- |
| A：核实基线 | 完成；Pages 详细设置未直接读取 | 最新简历核实、三个项目仓库核实、main 与远端一致；公开记录为 GitHub Pages 动态构建 |
| B：静态页面 | 完成 | 单页六个区域、系统字体、统一 CSS、原生项目详情、最新经历与联系方式 |
| C：交互与动效 | 完成 | 九段问候含「你好」、弧形退出、约 2.94 秒开场、四秒兜底、姓名循环及方向切换、菜单、逐段显现、联系区弧形与轻微按钮反馈 |
| D：旧链接与资源 | 完成 | 四个兼容跳转、35 个照片取消跟踪且精确忽略、发布白名单和 Jekyll 排除内部资料 |
| E：验收与交付 | 完成，已部署并线上核验 | 下列检查通过；独立 Chrome/Safari 和真实系统偏好切换保留为验证限制 |

## 基线与事实

- 实施起点：`9aa83899aa647f60acc7721390caf52ab0ee51d4`，分支 `main`，远端 `origin`。
- 起始未跟踪内容：`Yifan_Wang_Resume.pdf`、`styles.css`、`dist/styles.css`、`outputs/`；三个已有用户文件的 SHA-256 未改变。
- 读取原始最新简历 `/Users/frank/Desktop/Yifan Wang Resume.pdf`，核实项目名称、工作地点、日期、技术栈、邮箱和所有使用的工作指标。没有使用仓库内旧简历作为事实来源，也没有新增简历下载入口。
- 参考站在浏览器实际查看：[Dennis Snellenberg](https://dennissnellenberg.com/)。当前项目区已变化，本实施遵循计划所指定的白色大字列表版本。
- [Workforce 原仓库](https://github.com/YifanWang3744/HR-Management-and-Employee-Onboarding-System)：README 明确 Spring Boot、Spring Cloud、JWT、MySQL、MongoDB，与简历项目对应；文案以最新简历为准。
- [Cloud Bookstore 原仓库](https://github.com/YifanWang3744/book-subscription-system)：README 明确四个服务、FastAPI、React、Google 登录、AWS RDS/API Gateway/S3/CloudFront；与新名称对应。
- [ORB-SLAM2 仓库](https://github.com/YifanWang3744/My-Improved-ORB-SLAM2)：README 明确 image pyramid 方法和约 5% 改善。
- Pages 公开动作 `pages build and deployment` 的 `head_branch` 为 `main`、路径为 `dynamic/pages/pages-build-deployment`；没有新增 Actions 工作流或修改 Pages 后台设置。未登录浏览器不能读取 `/settings/pages`，详细来源设置不冒充已确认。

## 实现决策

保留原生静态架构，使用 CSS、IntersectionObserver、requestAnimationFrame 和原生 dialog/details，实现计划中的动效，无需 GSAP、Lenis、Tailwind CDN、Alpine、Fancybox 或 jQuery。页面不再引用旧依赖和旧脚本。系统字体不依赖网络字体；中文使用系统中文回退。保留旧未使用源码和已有用户文件。

Hero 使用中性灰，不引用旧海边照片，也未生成或借用他人人像。这与参考站的半身人像首屏仍有明确视觉差距。

## 浏览器与容错检查

浏览器为唯一已连接的 Codex In-app Browser。下列真实视口均通过 DOM 尺寸检查及截图复查：

| 视口 | 检查 | 结果 |
| --- | --- | --- |
| 1440×900 | 首屏、项目列表与详情、菜单、联系区 | 页面 scrollWidth 为 1440；职业说明与姓名无重叠 |
| 768×1024 | 技能、直达锚点、Escape 跳过开场 | 页面 scrollWidth 为 768；锚点在预留导航间距处 |
| 390×844 | 首屏、完整菜单、项目详情、联系区 | 页面 scrollWidth 为 390；正文换行正常，无横向滚动 |
| 1920×680 | 宽而矮窗口的首屏 | scrollWidth 为 1920；职业说明底部约 355px，姓名区域顶部约 366px，无重叠 |
| 1280×720（线上） | 开场、首屏与项目交互 | scrollWidth 为 1280；职业说明与姓名无重叠 |

- 完整开场播放，捕获「你好」截图；结束后 intro.hidden 为 true、页面非 inert、滚动锁释放。
- Escape 与 Skip intro 均可跳过；项目展开、页内导航、前进/后退不重播开场。
- 项目用 Enter 和 Space 展开；切换后只有一个项目展开。GitHub 链接不嵌套在 summary 内。
- 菜单打开后背景不可交互，关闭按钮得到焦点；Escape 或点击遮罩关闭后焦点回到 menu-toggle，dialog.open 为 false，滚动锁释放。手机菜单选择目标后焦点移到目标 section。
- Pause motion / Resume motion 状态切换正常；暂停时姓名和滚动反馈停止。页面不可见时停止动画调度。
- `#projects`、`#experience`、`#skills` 直达和刷新后正确定位，未强制回到首页顶部。
- 旧 `dist/projects.html` → `index.html#projects`；experience → `#experience`；skills → `#skills`；photography → 首页。兼容页同时有普通备用链接。
- 生产页面控制台无 error/warn。
- 临时测试服务从响应中移除 script，确认遮罩不出现、正文可读、原生项目详情可用、无 pending 显现类。
- 临时测试服务返回 JavaScript 404，确认页面非 inert、不锁滚动、正文和普通导航可用。
- 减少动态效果通过临时响应夹具模拟：matchMedia 分支为 true，并启用相应 CSS；确认 `Hello · 你好` 短暂显示后退出、姓名无 JS transform、运动按钮隐藏、没有 pending 隐藏内容，菜单可以立即关闭。未改变用户系统偏好，此项不是独立 OS/浏览器媒体查询集成测试。
- 正式页面没有外部字体、动画库、图片预览、光标追踪图像或摄影资源请求依赖；相应网络失效风险通过移除依赖解决。

## 静态与资源验证

通过 `node --check dist/portfolio.js`、`git diff --check`，以及 HTML 解析检查：本地资源全部存在、页面 ID 唯一、页内锚点全部有效。

逐个核对计划中的 35 个照片：磁盘文件存在且 SHA-256 与实施前相同；不在 `git ls-files` 中；全部通过 `git check-ignore`。三张项目截图与 favicon 仍被跟踪。没有历史重写或强推。

`python3 scripts/package_site.py` 生成 11 个白名单公开文件和 `.nojekyll`；35 个摄影文件、旧简历、内部文档和旧 CSS 不在产物中。脚本仅替换自己的 `outputs/site/` 目录。Pages 分支构建读取 Git checkout，照片取消跟踪后不会进入新的 checkout；`_config.yml` 排除内部文档与废弃源码。

## 本地预览和证据

正式预览命令：`python3 -m http.server 8765 --bind 127.0.0.1`。

临时容错服务位于 `/private/tmp/portfolio-validation-server.py`，使用端口 8766，只在响应中调整脚本/媒体分支，不更改正式源码。

截图保存在 `outputs/screenshots/`：

- `intro-chinese.png`
- `desktop-hero.png`
- `desktop-projects.png`
- `desktop-menu.png`
- `desktop-contact.png`
- `mobile-hero.png`
- `mobile-projects.png`
- `mobile-contact.png`
- `tablet-skills.png`
- `live-hero.png`（最终线上版本）

## 发布状态

已完成两个提交并推送 `origin/main`：

- `79b325cf7325283d3c4a1cc3553fe53349f8716a`：单页改版、最新文案、交互和照片取消跟踪。
- `6798c72036288d44d4939a2f498f4b1eea87fddf`：限制姓名字号同时适配视口高度，并调整职业文字视差方向，避免宽而矮窗口的重叠。

[最终 GitHub Pages 部署](https://github.com/YifanWang3744/YifanWang3744.github.io/actions/runs/37028004514) 的 head_sha 为 `6798c72036288d44d4939a2f498f4b1eea87fddf`，状态 completed，结论 success。

[线上作品集](https://yifanwang3744.github.io/) 已实际打开：首屏、开场结束后的滚动恢复、项目导航和键盘展开正常，控制台无 error/warn。下载线上 CSS/JavaScript 后逐个比较 SHA-256，与本地最终提交一致。

公开 Git tree 核验全部 35 个摄影文件已从 GitHub 当前提交移除，四个项目/favicon 资源仍存在。线上 `dist/assets/Avatar.png` 和 `dist/assets/thumbs/hawaii-lighthouse.jpg` 抽查返回 HTTP 404。全部本地摄影文件以及原有用户样式和简历的哈希再次核对保持不变。

本地验收报告、计划、基线和截图没有夹带进网站发布提交；当前仅剩原有用户文件及 outputs 文档处于未跟踪状态。

## 验证范围的限制

独立 Chrome/Safari、真实系统减少动态效果切换、读屏软件完整朗读和不同设备的触控行为尚未验证。此环境只连接一个内置浏览器；视口测试不等同于真实设备测试。实际 Pages 设置需要有仓库权限的登录会话才能直接检查。
