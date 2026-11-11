# AI Radar V1.2 — 系统架构图（开发阶段 1）

> 文档状态：阶段 1 前端工程化进行中。以下明确区分已实现与规划中的部分。

## 1. 全景图

```mermaid
flowchart TB
  U[访客 / 管理员] --> WEB[React + TypeScript 前端\nCloudflare Pages（规划部署）]
  WEB -. 当前阶段 .-> DEMO[本地演示数据\n已实现]
  WEB -. 后续接入 .-> API[Cloudflare Workers API\n只读骨架已存在]
  API -. 后续接入 .-> DB[(Cloudflare D1\n初始迁移草案已存在)]
  GH[GitHub 代码仓库] --> DEPLOY[构建与部署流程]
  DEPLOY --> WEB
  COL[GitHub Actions + Python 采集\n规划中] --> API
  API --> DB
```

## 2. 前端组件关系

```mermaid
flowchart TB
  APP[App 应用入口] --> SHELL[AppShell / 页面框架]
  SHELL --> SIDE[Sidebar 导航]
  SHELL --> TOP[Topbar 顶栏]
  SHELL --> PAGE[情报总览页面]
  PAGE --> STATS[StatsGrid 指标卡]
  PAGE --> FEED[FeedPanel 资讯区]
  PAGE --> RIGHT[ResearchSidebar 研究侧栏]
  FEED --> FILTER[FilterBar 筛选区]
  FEED --> LIST[ArticleList 资讯列表]
  LIST --> CARD[ArticleCard 资讯卡片]
  CARD --> SCORE[Score 热度/重要性]
  APP --> DRAWER[DetailDrawer 详情抽屉]
```

## 3. 数据流（目标形态）

```mermaid
flowchart LR
  SRC[RSS / 官方博客 / 公开 API] --> COL[定时采集]
  COL --> CLEAN[清洗与文章去重]
  CLEAN --> CAND[候选事件识别与评分]
  CAND --> DB[(D1 数据库)]
  ADMIN[管理员审核] --> API[Workers API]
  API --> DB
  DB --> API
  API --> WEB[React 前端公开读取]
  WEB --> VIS[访客只读浏览]
```

## 4. 已实现 / 未实现边界

| 部分 | 当前状态 | 说明 |
|---|---|---|
| React + TypeScript + Vite | 已实现基础工程 | 本阶段正在完成首页组件化 |
| 首页搜索、语言/专题/评分筛选 | 已实现（演示数据） | 仅在浏览器本地运行 |
| 资讯详情抽屉、收藏 | 已实现（演示数据） | 收藏仅保存在当前页面状态 |
| Workers API | 只读骨架 | 尚未接入正式环境与认证 |
| D1 schema | 初始迁移草案 | 尚未创建/迁移生产数据库 |
| 管理员登录与写 API | 未实现 | 上线前必须完成服务端认证和授权 |
| 自动采集与热度信号 | 未实现 | 后续接入 GitHub Actions |
| Pages 预览部署 | 未执行 | 不影响现有 V1 生产网站 |

## 5. 产品经理如何理解

- **前端**：你看到和点击的工作台。改布局、颜色、筛选交互，通常只需重新部署前端。
- **Workers 后端**：处理请求、权限和业务规则。改 API 或服务端逻辑才需要部署 Worker。
- **D1 数据库**：保存资讯和研究成果。新增表/字段时执行数据库迁移；普通新增文章不需要部署。
- **GitHub**：保存代码和迁移脚本，不是未来唯一的数据存储位置。
- **自动采集**：独立定时任务。采集规则变化时更新采集程序，不必然需要更新网站。

## 6. 版本更新原则

1. 前端、Worker、采集任务独立版本化。
2. 数据库迁移先在 staging 执行，备份后再考虑生产迁移。
3. API 使用版本化路径，优先保持向后兼容。
4. 不将未审核数据、管理员凭证或密钥打包进公开前端。
5. V1 正式站点保持不变，V1.2 在独立预览环境验收后再切换。
