# Yifan Wang Portfolio — Dennis 风格实施计划

更新日期：2026-10-02。本文最初作为改版交接计划；用户随后指令「开始按照计划分阶段实行」，当前 session 已完成实施并发布。最终提交为 `6798c72`，GitHub Pages 部署成功。实施与验证证据见同目录 `portfolio-redesign-validation.md`；下文仓库概况保留规划时的基线。独立 Chrome/Safari 和真实系统减少动态效果切换仍未验证。

## 1. 目标与已确认要求

尽可能还原 Dennis Snellenberg 网站的布局比例、字体尺度、留白、滚动节奏及过渡效果，用 Yifan 的真实内容替换。参考：https://dennissnellenberg.com/ 。实施前在浏览器实际查看参考站；若站点已改版，以本计划描述的灰色人像首屏、移动姓名、白色大字项目列表、深色联系区版本为准。

用户明确要求：

- 首次打开网站时出现多种语言的 Hello 开场，必须加入简体中文「你好」。
- 不要项目列表悬停弹出图片，不要图片跟随鼠标，不要跟随鼠标的巨大 View 圆圈。
- Projects 根据新简历更新，同时保留 Improved ORB-SLAM2 System。
- 删除 Gallery section、Gallery 导航和网站上的摄影作品展示。取消此前双排横向摄影画廊方案。
- 摄影文件保留在本地；已被 Git 跟踪的摄影文件应从 GitHub 当前版本移除，并避免再次提交。
- 原计划准备交由另一个 session 实施；按用户后续指令已在当前 session 完成。

主要结构：开场 → Hero → About → Projects → Experience & Education → Skills → Contact。网站正文保持英文；交接解释用中文。

## 2. 仓库与事实来源（规划时基线）

- 仓库：`/Users/frank/Desktop/Frank/Coding Projects/newPortfolio/YifanWang3744.github.io`
- Git remote：`https://github.com/YifanWang3744/YifanWang3744.github.io.git`
- 当前入口：`index.html`。
- 当前独立内容页：`dist/projects.html`、`dist/experience.html`、`dist/skills.html`、`dist/photography.html`。
- 当前实现：HTML、Tailwind CSS（编译文件和 CDN 均存在）、Alpine.js；图片查看使用 Fancybox，部分页面加载 jQuery。没有发现 package.json。
- 现有动画：页面和图片淡入、手势动画、少量悬停缩放；没有统一滚动时间线。
- 最新内容来源：原计划记录为用户提供的 `/Users/frank/Desktop/Yifan Wang Resume.pdf`，并已摘录实施必需内容。本轮保留这些摘录，未重新读取该 PDF；下个 session 可按本文整理内容，如发现冲突再核对原始简历。
- 仓库内 `Yifan_Wang_Resume.pdf` 不能自动视为同一份最新简历。需要下载简历功能时，再核对并替换，避免链接到旧内容。

本轮检查时已有未跟踪文件：`Yifan_Wang_Resume.pdf`、`styles.css`、`dist/styles.css`。实施前重新检查工作区，保留用户现有工作，不得覆盖或清理不相关变更。

本轮另确认：当前分支为 `main`；`outputs/` 本身也未跟踪；仓库未发现 `package.json`、`.gitignore` 或 `.github` 工作流。没有本地工作流不能证明 GitHub Pages 的实际发布方式，仍需读取远端设置确认。当前首页确实同时加载 `dist/output.css`、未跟踪的 `styles.css` 和 Tailwind CDN，并在 body 使用 `opacity-0`；新实现应明确解决样式来源重复和脚本失效时内容不可见的问题。

## 3. 视觉规范

- Hero 使用中性灰；正文使用白或近白；联系区使用深炭灰；强调色为接近参考站的蓝色。
- 采用简洁的无衬线字体，常规字重、大字号、紧凑行高；中英文都有可用的字体回退。
- 去掉当前蓝色径向渐变、拍立得相框、成片圆角卡片、标签底色和装饰阴影。
- 内容主要通过排版、留白和细横线组织，保留参考站的宽幅布局。
- 不必迁移 React。优先在现有静态部署结构上实现；允许为模块和资源管理加入轻量构建流程，但避免无必要重构。
- 先统一静态布局，再调动效；不要仅增加淡入动画就视为完成 Dennis 风格还原。

## 4. 多语言 Hello 开场

### 展示形式

- 初始显示全屏深色遮罩，正中央以大号浅色文字显示一个问候语，可带一个小圆点。
- 一次只显示一种语言，连续替换；不是多种文字同时散布，也不是浏览器弹窗。
- 默认顺序：`Hello` → `Bonjour` → `Hola` → `Ciao` → `Olá` → `こんにちは` → `你好` → `Hallo` → `Hello`。
- 第一项停留稍长，中间快速切换；「你好」保留足够可读时间。初步总长约 2.5–3 秒，结合原站体验微调。
- 结束后遮罩向上退出，底边弧形逐渐收拢，露出 Hero；导航、职业说明与姓名进入画面。
- 字体加载不应导致中文空白、方框或尺寸突变。

### 触发与容错

- 默认每次完整打开或刷新页面播放一次；页内导航、展开项目不重播。不使用“永久只播放一次”的 localStorage 逻辑。
- 允许按 Escape 跳过；动画期间暂时锁定页面滚动，结束、跳过或异常时都必须恢复。
- 不等所有资源加载完成才结束，不允许低网速造成永久遮罩。
- 禁用 JavaScript 时仍可看到主体内容；页面不能继续依赖 body 永久 opacity: 0。
- 系统启用减少动态效果（prefers-reduced-motion）时，显示短暂的「Hello · 你好」后快速淡出，避免密集切换。
- 读屏软件不应连续播报所有语言；遮罩不形成键盘陷阱。

## 5. 各 section 的实施方案

### 5.1 Hero

- 高度约一屏，左上为 `© Code by Yifan`，右上为 `Projects / About / Contact`；完整 section 导航放入展开菜单。
- 右侧职业文字：`Software Engineer` / `Full-stack Developer`，附参考站风格箭头。
- 左侧贴边位置标签：`Based in Wisconsin, USA`，可加入简洁旋转地球图标。
- 下方超大姓名连续排列：`Yifan Wang — Yifan Wang —`。缓慢循环横移，随滚动方向改变移动方向，且滚动时可适度加速。
- 背景与姓名轻微视差；滚出首屏时正文自然衔接。
- 顶部导航离开首屏后，右上出现圆形菜单按钮。点击展开深色侧边菜单，带弧形边缘；导航项定位到同页 section。

**图片约束：** 当前 `dist/assets/Avatar.png` 是海边小人物背影照片，不是半身人像。用户此次要求删除网页上的摄影展示，默认 Hero 也不再使用该照片，并将其归入本地保留、取消跟踪的照片。先用中性灰背景和完整排版动效实现 Hero。若用户之后提供清晰半身人像，可替换为更接近 Dennis 的构图；不得拿 Dennis 本人的照片代替用户，也不要生成未经要求的用户人像。

### 5.2 About

- 白底，大块留白；左侧大字号介绍，右侧较小的经历摘要。
- 建议主文案：`Building reliable software for complex, real-world systems.`
- 摘要以最新简历为准：在 Elutions 从事工业监控软件、全栈应用和后端系统开发，涉及 C++、C#、.NET、React、TypeScript。
- 不沿用容易过期的固定“3 years”描述。摄影、F1、足球爱好可以用一句文字保留，但不新增摄影区域或图片。
- 逐行上移显现；圆形 `My experience` 按钮滚动至经历区。

### 5.3 Projects

采用参考截图的全宽大字列表：左侧大标题，右侧简短分类，每行上下用细线分隔。以下顺序为默认：

| 标题 | 右侧分类 | 技术栈 |
| --- | --- | --- |
| Workforce Services Platform | Backend Development | Java, Spring Boot, Spring Cloud, MySQL, MongoDB, RabbitMQ |
| Cloud Bookstore | Cloud / Full-stack | Python, FastAPI, React, AWS, SQLAlchemy |
| Improved ORB-SLAM2 System | Computer Vision | C++, Computer Vision, SLAM |

可直接采用的英文项目描述：

**Workforce Services Platform**

> Developed backend services for profile management and application processing. Secured REST APIs with JWT and used RabbitMQ for asynchronous event processing, with account and workflow records in MySQL and profile data in MongoDB.

该项目对应替换当前 `HR Management System` 的名称和描述。旧 GitHub 链接为 `https://github.com/YifanWang3744/HR-Management-and-Employee-Onboarding-System`；实施时检查仓库内容，确认对应再使用。简历未提供新的仓库链接，不得根据新名称编造 URL。

**Cloud Bookstore**

> Built a cloud bookstore with four FastAPI services and a React frontend, featuring catalog and order management, Google sign-in, and Amazon RDS persistence. Exposed backend APIs through API Gateway and hosted the frontend on S3 with CloudFront.

替换当前 `AWS Bookstore Application` 的名称和描述，删除旧版不受新简历支持的服务间 OAuth2 等表述。旧 GitHub 链接为 `https://github.com/YifanWang3744/book-subscription-system`；同样核实后再使用。

**Improved ORB-SLAM2 System**

> Improved real-time localization using an image-pyramid method, achieving approximately 5% better trajectory accuracy.

这是用户明确要求保留的旧项目；约 5% 的数据来自现有 portfolio，不是本次简历。保留现有链接 `https://github.com/YifanWang3744/My-Improved-ORB-SLAM2`，不要增加未验证的新指标。

交互：

- 标题行悬停只做轻微文字位移、颜色变化和箭头反馈。
- 不实现浮动预览图片、光标追踪图片、巨大 View 圆圈或鼠标替换。
- 用可键盘操作的标题按钮展开行内详情，默认一次展开一个；详情含摘要、技术栈、经核实的 GitHub 链接。
- 项目截图可以在展开后固定显示，但先确认与更新后的项目匹配；无法确认时宁可先展示文字。截图不是 Gallery 照片，不应批量删除。
- 行内详情属于为保留用户项目内容所做的扩展，不是对原站交互的逐项复制。

### 5.4 Experience & Education

保留三条经历，取消圆角卡片。编号、日期、机构和说明按列排列，细线分隔；逐段显现。最新简历修正 Elutions 地点为 Delafield, Wisconsin。

**Elutions — Software Developer**

`May 2023 – Present · Delafield, Wisconsin`

- Led architecture and development of Chromium, a web-based industrial monitoring and control platform, delivering a beta release for customer evaluation.
- Designed its distributed backend, reusable EF Core data-access layer, licensing and migration systems, and real-time telemetry services.
- Owned feature development and production support for ControlMaestro, delivering 100+ features and resolving 300+ production issues.

可在展开详情中保留的简历事实：接收演示的客户约 60% 签订升级合同；升级工具将升级时间降低 50%；OPC UA 扫描由 10 分钟降至 2 分钟；Memlab 测试中的堆内存用量下降 20%。不可省略这些指标的对象和条件，也不可将它们改写成个人项目指标。

**Columbia University — M.S. in Electrical Engineering**

`Sep 2021 – Feb 2023 · New York, NY`

可选课程：Analysis of Algorithms, Introduction to Databases, Computer Systems, Cloud Computing。

**Sichuan University — B.S. in Electrical Engineering**

`Sep 2017 – Jun 2021 · Chengdu, China`

### 5.5 Skills

四个编号栏目，用文字和少量小图标，去掉每个技能的圆角底色。为了与新项目及经历一致，默认同步为最新简历技术清单：

1. Languages：C#, C++, SQL, TypeScript, JavaScript, Python, Java。
2. Backend & Web：.NET, EF Core, React, SignalR, YARP, FastAPI, Spring Boot。
3. Data & Messaging：PostgreSQL, SQL Server, TimescaleDB, Redis, NATS JetStream, RabbitMQ。
4. Cloud & Tooling：AWS, Docker, GitHub Actions, Jenkins, Git。

桌面多栏，窄屏逐栏排列，滚动进入时错开显现。不添加熟练度百分比或未经用户提供的评级。

### 5.6 Contact

- 深炭灰背景、大号浅色 `Let’s build something together.`。
- 上方白色区域用弧形边界过渡，滚动时露出联系区。
- 蓝色圆形 `Get in touch` 按钮及细分隔线。允许按钮轻微磁吸反馈，但不增加任何悬停图片。
- 最新邮箱：`frankwang3744@gmail.com`，替换旧的 Columbia 邮箱。
- 电话：`(212) 518-6933`。
- LinkedIn：`https://linkedin.com/in/yifanwang5`。
- GitHub：`https://github.com/YifanWang3744`。
- 邮箱使用 mailto；社交链接直接打开。无需新增提交表单或后端服务。

## 6. 删除 Gallery 与照片的精确范围

### 网站内容

- 删除 Gallery 导航、摄影 section、摄影大图弹窗和仅摄影页使用的脚本。
- 原 `dist/photography.html` 不再提供摄影展示；为旧链接可保留极简跳转到首页的兼容页，不能残留图片引用。
- 检查所有 HTML、CSS、JS 和预加载配置，不再请求以下摄影资源，包括 `Avatar.png`。

### 本地保留 / GitHub 当前版本移除

以下摄影文件在计划编写时被 Git 跟踪：

```text
dist/assets/Avatar.png
dist/assets/IMG_0594.JPG
dist/assets/Pronghorn-vsco.JPG
dist/assets/Pronghorn.JPG
dist/assets/california-ocean.jpg
dist/assets/chair-lyft.JPG
dist/assets/cross.JPG
dist/assets/fall-driveway.JPG
dist/assets/glacier-1.JPG
dist/assets/glacier-2.JPG
dist/assets/grand-teton.jpg
dist/assets/hawaii-lighthouse.jpg
dist/assets/hawaii-night.JPG
dist/assets/holy-hill.JPG
dist/assets/rainbow-2.JPG
dist/assets/rainbow.JPG
dist/assets/sammy.JPG
dist/assets/sunshine.JPG
dist/assets/yellowstone.JPG
dist/assets/thumbs/Pronghorn-vsco.jpg
dist/assets/thumbs/california-ocean.jpg
dist/assets/thumbs/chair-lyft.jpg
dist/assets/thumbs/cross.jpg
dist/assets/thumbs/fall-driveway.jpg
dist/assets/thumbs/glacier-1.jpg
dist/assets/thumbs/glacier-2.jpg
dist/assets/thumbs/grand-teton.jpg
dist/assets/thumbs/hawaii-lighthouse.jpg
dist/assets/thumbs/hawaii-night.jpg
dist/assets/thumbs/holy-hill.jpg
dist/assets/thumbs/rainbow-2.jpg
dist/assets/thumbs/rainbow.jpg
dist/assets/thumbs/sammy.jpg
dist/assets/thumbs/sunshine.jpg
dist/assets/thumbs/yellowstone.jpg
```

实施方式：先核对文件状态并记录存在清单，给这些明确路径添加 `.gitignore` 规则，再针对清单使用 `git rm --cached -- <具体路径>` 取消跟踪，保留磁盘文件。不要使用普通 `git rm`、文件系统删除或覆盖整个 assets 目录的忽略规则。

保留并继续跟踪项目资源：`dist/assets/orb-slam-2.jpg`、`dist/assets/bookstore.jpg`、`dist/assets/hr-system.jpg`、`dist/assets/favicon.ico`。新的人像或设计资源按需单独跟踪。

取消跟踪后须检查：文件仍在本地；`git ls-files` 不再列出摄影文件；`git check-ignore` 能确认忽略规则；变更列表没有误删项目截图。

用户已提出从 GitHub 删除这些照片。只有对应删除变更提交并推送到正确分支后，GitHub 当前版本才会移除；实施 session 应在完成检查后按实际仓库发布流程落实并验证，不得将“本地取消跟踪”报告为“GitHub 已删除”。这不包含清除 Git 历史、强推或历史重写；历史提交中的文件仍可存在。

若部署从当前工作目录直接打包，`.gitignore` 不等于打包排除规则：必须确保本地保留的摄影文件也被排除出部署产物。检查实际 GitHub Pages 来源及工作流，不凭仓库名假定部署方式。

## 7. 实施步骤

### 7.1 执行顺序

1. 阅读适用 AGENTS.md，检查工作区、当前分支、部署配置及用户已有变更；读取本文件并查看参考站。
2. 将五个页面中的有效文字内容合并到 `index.html` 的锚点 section；Gallery 完全退出内容结构。
3. 先搭建 Hero、About、项目大字列表、经历、技能及 Contact 的静态布局，确认窄屏无溢出。
4. 更新项目、技术栈、经历摘要及联系方式，核实旧项目链接与新名称的对应关系。
5. 加入多语言开场、弧形退出、移动姓名、滚动显现、菜单及联系区转场。建议 GSAP + ScrollTrigger；平滑滚动只采用一个统一方案，避免与已有 scroll-smooth 冲突。
6. 清理不再需要的 Alpine/Fancybox/jQuery 或旧动画；仅在确认没有其他用途后移除。统一样式来源，避免当前 CDN Tailwind、编译 CSS 和覆盖样式互相冲突。
7. 对旧 projects / experience / skills URL 保留合理的锚点跳转，避免旧链接直接失效。跳转时尊重目标锚点，开场结束后不能强制回到顶部。
8. 按照片清单取消跟踪并忽略，保留本地文件，确认部署不会携带它们。
9. 完成浏览器验证及动效调校，再处理提交、推送与部署；不夹带无关用户文件。

### 7.2 阶段交付与完成条件

以下阶段按顺序执行，每阶段检查通过后继续，不要求用户逐阶段审批。发布操作须依据实施 session 中的实际授权和仓库规则进行；本计划本身不代表本轮执行发布。

| 阶段 | 工作与交付 | 完成条件 |
| --- | --- | --- |
| A：核实基线 | 记录工作区状态、跟踪文件、Pages 来源；查看参考站，核实三个项目链接；记录不能核实的事实 | 明确发布入口、照片清单及待核实信息；本地已有工作有记录 |
| B：静态页面 | 完成六个正文 section、英文文案、统一样式及移动端布局 | 关闭 JavaScript 仍能阅读正文和项目内容，导航和联系链接可用，无摄影引用 |
| C：交互与动效 | 实现 Hello 开场、姓名移动、菜单、项目展开、滚动显现及弧形过渡 | 正常模式与减少动态效果模式均可操作，跳过和异常路径不会锁死页面 |
| D：旧链接与资源 | 添加旧页面跳转，清理废弃依赖，按精确清单取消照片跟踪并排除部署 | 旧 URL 到达正确 section；照片保留本地，项目资源保留；生产产物不包含摄影文件 |
| E：验收与交付 | 浏览器验证、修复、记录截图与结果；按实际授权发布并核对线上状态 | 第 8 节适用项通过，未验证项和发布状态明确，不把待办标为完成 |

### 7.3 默认文件改动范围

优先保持无需构建即可部署的静态站点。默认使用原生 HTML、独立 CSS 和原生 JavaScript；按第 7.1 节评估 GSAP + ScrollTrigger 用于复杂动效。无需为本次改版引入 React 或完整应用框架；如增加依赖，固定版本并记录加载方式。

| 路径 | 计划改动 |
| --- | --- |
| `index.html` | 合并内容；提供 `#home`、`#about`、`#projects`、`#experience`、`#skills`、`#contact`；保留语义化标题、页面描述和 favicon |
| `dist/portfolio.css`（新增） | 统一颜色、字体、间距、断点、布局和减少动态效果规则；替代页面对旧样式的依赖 |
| `dist/portfolio.js`（新增） | 管理开场、菜单、项目展开与动效初始化；交互初始化不依赖外部动画库成功加载 |
| `dist/projects.html` | 兼容跳转至 `../index.html#projects`，保留可点击的备用链接 |
| `dist/experience.html` | 兼容跳转至 `../index.html#experience`，保留可点击的备用链接 |
| `dist/skills.html` | 兼容跳转至 `../index.html#skills`，保留可点击的备用链接 |
| `dist/photography.html` | 兼容跳转至 `../index.html`，不再加载摄影资源 |
| `.gitignore`（新增） | 仅添加第 6 节摄影文件的精确忽略规则及实际需要的本地产物规则 |
| `README.md` | 补充本地预览方法、文件职责、实际部署流程和验证方法 |
| `outputs/portfolio-redesign-validation.md`（实施时新增） | 记录测试环境、检查结果、待核实事项、照片处理和发布证据 |

新增独立样式文件是为了保留当前未跟踪的 `styles.css` 和 `dist/styles.css` 内容。旧 `dist/output.css`、`src/input.css`、`dist/fade_in.js`、`dist/menu.js` 先移除页面引用，确认无剩余用途后再决定是否删除；不得批量清理 `dist/`，其中含必须保留的照片和项目资源。

### 7.4 关键实现约束

- **开场与滚动：** 使用统一结束函数处理正常完成、Escape 跳过和超时兜底；函数可以重复调用且结果一致，负责清理计时器、释放滚动并处理初始锚点。遮罩默认隐藏，仅在脚本可运行后启用；最长展示时间设置独立兜底，例如 4 秒。
- **导航菜单：** 打开时移动焦点到菜单；关闭后返回触发按钮。打开的模态菜单管理 Tab 焦点和背景可交互状态，支持 Escape 与点击遮罩关闭；避免和开场同时持有滚动锁。
- **项目详情：** 优先使用原生 `details/summary` 保证无脚本可展开；若使用按钮方案，正文详情默认可见，脚本初始化后才折叠，并同步 `aria-expanded` 与 `aria-controls`。无论采用哪种方式，都不要将 GitHub 链接嵌套在触发按钮内。
- **持续动画：** 姓名等连续移动内容提供可发现的暂停方式；页面不可见时暂停。减少动态效果模式下姓名静止，关闭视差、磁吸和大幅位移，内容直接呈现。
- **布局：** 超大姓名的裁切限制在 Hero 自身，不靠全局隐藏横向溢出来掩盖普通正文问题。正文标题在窄屏允许换行；开场和菜单使用适配移动浏览器的视口高度。
- **资源失败：** 动画库、字体或图片加载失败时，菜单、项目内容、锚点和联系入口仍然可用。只有动效增强依赖动画库。

### 7.5 验证方法与交付证据

1. 从仓库根目录启动本地 HTTP 静态服务，避免仅用 `file://` 检查。记录实际命令和访问地址。
2. 至少检查 1440×900、768×1024、390×844 三种视口；保存首屏、项目区与联系区截图，检查普通正文无横向溢出。姓名循环区域可按设计局部裁切。
3. 在 Chromium 和可用的 Safari/WebKit 中检查核心流程；如某浏览器不可用，在验证记录中标为未验证，不推定通过。
4. 检查完整开场、Escape 跳过、刷新、菜单重复开关、键盘 Tab/Enter/Space、项目切换、浏览器前进/后退、直达锚点和旧页面跳转。
5. 分别检查减少动态效果、禁用 JavaScript、阻断动画库、字体加载失败和窄屏缩放。阻断动效资源时页面仍可阅读和操作。
6. 检查网络请求及部署产物，无第 6 节摄影文件；检查 Git 状态、精确忽略规则和文件存在性，证明“保留本地”与“取消跟踪”同时成立。
7. 如已发布，记录提交、部署结果和线上 URL，验证线上关键流程及照片当前版本状态；如尚未发布，准确列出剩余步骤。

本轮仅修改规划文档，无需新增测试代码。实施阶段优先以浏览器实际行为和异常路径验证为准；只有交互复杂度确有需要时再增加自动化测试，不为静态文案或样式编写与实现重复的测试。

## 8. 验收标准

- [x] 刚打开页面先看到逐个切换的多语言 Hello，包含清晰可读的「你好」。
- [x] 开场完成或跳过后正确露出 Hero，滚动与键盘操作恢复；没有永久白屏或遮罩。
- [x] 页内导航和项目展开不会重新播放开场。
- [x] 大姓名、圆形菜单、白色大字项目列表、细横线、深色联系区形成一致的 Dennis 风格。
- [x] 全站没有悬停浮动图片、跟随光标图片或 View 大圆圈。
- [x] Projects 恰好包含 Workforce Services Platform、Cloud Bookstore、Improved ORB-SLAM2 System，文案来源清晰、链接有效。
- [x] Experience、Skills、Contact 与本文的新简历事实一致，没有新增虚构指标。
- [x] 没有 Gallery 导航、section 或摄影请求；Hero 不再引用旧背影照片。
- [x] 摄影文件在本地保留，Git 不再跟踪且已忽略；项目截图未误删。
- [x] 推送后核对 GitHub 当前分支摄影文件已移除；如尚未推送，明确报告待完成状态。
- [x] 在桌面及约 390px 宽手机视口检查：无意外横向滚动、标题截断、重叠菜单、无法点击的项目。
- [ ] 真实系统减少动态效果设置仍待独立集成验证；减少动态效果分支已用响应夹具检查。键盘焦点、Escape 关闭菜单/跳过开场及原生 details/summary 已通过。
- [x] 持续移动姓名可暂停；禁用 JavaScript 或动画库加载失败时仍可阅读正文、访问项目内容和联系入口。
- [x] 验证滚动前进/后退、刷新、直达锚点、窗口缩放以及资源加载失败；控制台无阻断性错误。
- [x] 保持现有 GitHub Pages 发布能力；交付时说明已实现部分、首屏人像仍缺失的视觉差距、部署状态。

## 9. 原始实施任务描述（已执行）

请读取 `outputs/portfolio-redesign-plan.md`，按其中方案实施我的 portfolio 改版。尽可能还原 Dennis Snellenberg 的布局和滚动动效，包含多语言 Hello 开场和中文「你好」，不要悬停预览图片或光标跟随图片。使用计划中的最新简历项目内容，保留 Improved ORB-SLAM2，删除 Gallery。摄影文件留在本地，但取消 Git 跟踪并忽略，完成验证后落实 GitHub 当前版本移除。先检查现有工作区和部署流程，保留我的已有变更；没有新半身人像时使用中性灰 Hero，不使用旧海边照片。完成桌面、手机及减少动态效果验证，并明确报告实现、照片处理和部署状态。
