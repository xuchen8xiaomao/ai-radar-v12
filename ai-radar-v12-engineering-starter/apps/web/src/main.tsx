import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Language = 'zh' | 'en';
type Article = {
  id: number; language: Language; topic: string; title: string; summary: string;
  source: string; publishedAt: string; importance: number; heat: number;
  type: string; evidenceCount: number;
};

const articles: Article[] = [
  { id: 1, language: 'zh', topic: '空间智能', title: '某研究团队提出新型三维场景推理框架', summary: '围绕复杂场景关系理解和长时序空间表示提出新方法，研究结果仍需独立验证。', source: '研究机构博客', publishedAt: '2026-11-10T10:40:00+08:00', importance: 93, heat: 67, type: '技术突破', evidenceCount: 3 },
  { id: 2, language: 'en', topic: 'AIGC', title: 'A new video generation workflow improves scene consistency', summary: 'A hypothetical production workflow explores stronger temporal coherence and controllable edits in generative video.', source: 'AI Research Digest', publishedAt: '2026-11-10T09:20:00+08:00', importance: 84, heat: 91, type: '产品发布', evidenceCount: 5 },
  { id: 3, language: 'zh', topic: '智慧零售', title: '某购物中心试点多智能体商业空间服务', summary: '在商场问答、店铺查询和路线规划中试点多工具协同流程，尚未披露完整运营结果。', source: '智慧商业观察', publishedAt: '2026-11-10T08:15:00+08:00', importance: 81, heat: 61, type: '商业落地', evidenceCount: 2 },
  { id: 4, language: 'en', topic: '空间智能', title: 'Open benchmark proposal for embodied spatial reasoning', summary: 'A proposed benchmark focuses on object relations, navigation choices and generalization across unfamiliar environments.', source: 'Open Research Notes', publishedAt: '2026-11-09T22:00:00+08:00', importance: 87, heat: 54, type: '评测验证', evidenceCount: 2 },
  { id: 5, language: 'zh', topic: '大模型与基础技术', title: '某开源基础模型新增工具调用与长上下文能力', summary: '开发团队发布新版本，优化结构化输出与复杂任务的工具链调用方式。', source: '开源模型观察', publishedAt: '2026-11-09T18:30:00+08:00', importance: 78, heat: 96, type: '模型发布', evidenceCount: 6 },
  { id: 6, language: 'en', topic: 'AI Agent', title: 'Agent evaluation toolkit adds multi-step reliability tests', summary: 'The update proposes clearer evaluation of tool execution, recovery and long-running task completion.', source: 'Developer Systems', publishedAt: '2026-11-09T16:10:00+08:00', importance: 74, heat: 77, type: '开源发布', evidenceCount: 4 },
  { id: 7, language: 'zh', topic: 'AIGC', title: '面向短视频制作的可控生成编辑工具升级', summary: '新增局部编辑和镜头连续性控制工作流，关注创作成本与批量产出效率。', source: '数字内容产业观察', publishedAt: '2026-11-09T12:05:00+08:00', importance: 76, heat: 83, type: '产品发布', evidenceCount: 3 },
  { id: 8, language: 'en', topic: '智慧零售', title: 'Retail computer vision pilot reports new store-operations metrics', summary: 'A pilot outlines evaluation metrics for customer movement and inventory visibility without independently verified impact.', source: 'Retail Technology Review', publishedAt: '2026-11-08T21:50:00+08:00', importance: 72, heat: 42, type: '商业落地', evidenceCount: 1 },
  { id: 9, language: 'zh', topic: '空间智能', title: '机器人视觉语言动作模型发布测试版本', summary: '演示从多模态指令到动作规划的研究原型，真实环境鲁棒性仍需更多证据。', source: '机器人研究前沿', publishedAt: '2026-11-08T13:24:00+08:00', importance: 91, heat: 74, type: '模型发布', evidenceCount: 4 },
  { id: 10, language: 'en', topic: 'AI 基础设施', title: 'Inference runtime update explores lower latency serving', summary: 'New batching and memory policies are benchmarked on selected inference loads; deployment trade-offs remain.', source: 'Systems Engineering Weekly', publishedAt: '2026-11-08T09:05:00+08:00', importance: 69, heat: 57, type: '技术突破', evidenceCount: 2 },
  { id: 11, language: 'zh', topic: 'AI 产品与商业化', title: '企业 AI 办公产品改进文档自动化工作流', summary: '结合结构化提取、流程执行和权限管理，探索更完整的企业级应用链路。', source: 'AI 产品笔记', publishedAt: '2026-11-07T14:35:00+08:00', importance: 66, heat: 79, type: '产品发布', evidenceCount: 3 },
  { id: 12, language: 'en', topic: 'AI 安全与治理', title: 'New model safety evaluation guidelines published for review', summary: 'A draft guideline discusses operational testing, risk reporting and reproducible safety evaluations.', source: 'AI Governance Brief', publishedAt: '2026-11-06T11:10:00+08:00', importance: 82, heat: 49, type: '政策与标准', evidenceCount: 2 },
];

const topics = ['全部', '空间智能', '智慧零售', 'AIGC', '大模型与基础技术', 'AI Agent', 'AI 基础设施', 'AI 产品与商业化', 'AI 安全与治理'];
const navItems = [
  { label: '情报总览', icon: '▦' }, { label: '专题研究', icon: '◇' },
  { label: '研究资料库', icon: '▤' }, { label: '事件审核', icon: '☷', count: '8' },
  { label: '信息源管理', icon: '⌁' },
];
const dateText = (value: string) => new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));

function StatCard({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return <div className="stat-card"><div className="stat-label">{label}</div><div className={`stat-value ${accent}`}>{value}</div><div className="stat-note">{note}</div></div>;
}

function Score({ label, value, kind }: { label: string; value: number; kind: 'heat' | 'importance' }) {
  return <div className={`score-box ${kind}`}><strong>{value}</strong><span>{label}</span></div>;
}

function ArticleCard({ article, saved, onSave, onOpen }: { article: Article; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return <article className="article-card">
    <div className="article-main">
      <div className="article-tags"><span className={`topic-tag ${article.topic === '空间智能' ? 'blue' : article.topic === '智慧零售' ? 'teal' : article.topic === 'AIGC' ? 'gold' : ''}`}>{article.topic}</span><span className="language-tag">{article.language === 'zh' ? '中文' : 'EN'}</span><span className="article-type">{article.type}</span></div>
      <button className="article-title" onClick={onOpen}>{article.title}</button>
      <p className="article-summary">{article.summary}</p>
      <div className="article-meta"><span>◉ {article.source}</span><span>◷ {dateText(article.publishedAt)}</span><span>◈ {article.evidenceCount} 条关联证据（演示）</span></div>
    </div>
    <div className="article-actions"><div className="scores"><Score label="热度估算" value={article.heat} kind="heat"/><Score label="重要性" value={article.importance} kind="importance"/></div><button className={`save-button ${saved ? 'saved' : ''}`} aria-label={saved ? '取消收藏' : '收藏'} title={saved ? '取消收藏' : '收藏'} onClick={onSave}>{saved ? '★' : '☆'}</button></div>
  </article>;
}

function DetailDrawer({ article, onClose, saved, onSave }: { article: Article | null; onClose: () => void; saved: boolean; onSave: () => void }) {
  if (!article) return null;
  return <div className="drawer-shade" onMouseDown={onClose}><aside className="detail-drawer" onMouseDown={e => e.stopPropagation()}>
    <div className="drawer-top"><span className="eyebrow">INTELLIGENCE DETAIL · DEMO</span><button className="icon-button" onClick={onClose}>✕</button></div>
    <div className="article-tags"><span className="topic-tag blue">{article.topic}</span><span className="language-tag">{article.language === 'zh' ? '中文' : 'English'}</span><span className="article-type">{article.type}</span></div>
    <h2>{article.title}</h2><p className="drawer-summary">{article.summary}</p>
    <div className="detail-meta"><span>来源：{article.source}</span><span>发布时间：{dateText(article.publishedAt)}</span></div>
    <section className="detail-section"><h3>研究评估（演示值）</h3><div className="detail-scores"><Score label="热度估算" value={article.heat} kind="heat"/><Score label="重要性" value={article.importance} kind="importance"/></div><p>热度分数为原型预设值，非真实全网热度。正式版本将展示报道覆盖、讨论度、增长速度及数据可信度。</p></section>
    <section className="detail-section"><h3>事件与证据</h3><p>关联来源：{article.evidenceCount} 条（模拟）。<br/>核验状态：待审阅。<br/>里程碑：尚未人工确认。<br/>Research Track：待建立关联。</p></section>
    <section className="detail-section"><h3>原文访问</h3><p>此条资讯是界面设计用的演示样例，没有真实原文链接。正式版本每条资讯都将保留可追溯来源。</p></section>
    <div className="drawer-footer"><button className="secondary-button" onClick={onSave}>{saved ? '★ 已收藏' : '☆ 收藏'}</button><button className="primary-button" onClick={onClose}>返回情报流</button></div>
  </aside></div>;
}

function App() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [topic, setTopic] = useState('全部');
  const [minImportance, setMinImportance] = useState(0);
  const [minHeat, setMinHeat] = useState(0);
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [detail, setDetail] = useState<Article | null>(null);
  const [activeNav, setActiveNav] = useState('情报总览');

  const filtered = useMemo(() => articles.filter(item =>
    (language === 'all' || item.language === language) &&
    (topic === '全部' || item.topic === topic) &&
    item.importance >= minImportance && item.heat >= minHeat &&
    (!onlySaved || saved.includes(item.id)) &&
    `${item.title} ${item.summary} ${item.source} ${item.topic}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)), [query, language, topic, minImportance, minHeat, onlySaved, saved]);

  const toggleSaved = (id: number) => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const reset = () => { setQuery(''); setLanguage('all'); setTopic('全部'); setMinImportance(0); setMinHeat(0); setOnlySaved(false); };
  const openTopic = (value: string) => { setTopic(value); setActiveNav('情报总览'); };
  const stats = [
    { label: '演示资讯总量', value: String(articles.length), note: '当前原型样例数据', accent: '' },
    { label: '高重要性资讯', value: String(articles.filter(x => x.importance >= 80).length), note: '重要性 ≥ 80', accent: 'teal-text' },
    { label: '高热度资讯', value: String(articles.filter(x => x.heat >= 75).length), note: '热度估算 ≥ 75', accent: 'gold-text' },
    { label: '待审核候选', value: '8', note: '模拟工作台数据', accent: 'blue-text' },
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">✦</div><div><strong>AI RADAR</strong><small>INTELLIGENCE WORKSPACE</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="main-nav">{navItems.map(item => <button key={item.label} className={activeNav === item.label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(item.label)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}</button>)}</nav>
      <div className="sidebar-focus"><div className="nav-label">重点追踪专题</div>{['空间智能', '智慧零售', 'AIGC'].map((item, index) => <button key={item} className="focus-link" onClick={() => openTopic(item)}><i className={`focus-dot dot-${index}`} />{item}<span>→</span></button>)}</div>
      <div className="sidebar-bottom"><span className="online-dot"/> 演示环境 · 未连接生产数据<div className="version-label">AI RADAR / V1.2 PREVIEW</div></div>
    </aside>

    <main className="main-area">
      <div className="topbar"><div className="breadcrumb">工作台 <span>/</span> <strong>{activeNav}</strong></div><div className="topbar-right"><span className="public-label">公开只读模式</span><span className="avatar">AR</span></div></div>
      <div className="page-content">
        {activeNav === '情报总览' ? <>
          <header className="page-heading"><div><div className="eyebrow">AI INDUSTRY INTELLIGENCE</div><h1>AI 行业情报总览</h1><p>追踪技术突破、产品发布与产业落地，发现真正值得关注的行业变化。</p></div><div className="heading-date"><span className="online-dot"/> 演示数据 · 2026.11</div></header>
          <section className="stats-grid">{stats.map(item => <StatCard key={item.label} {...item}/>)}</section>
          <div className="workspace-grid">
            <section className="panel feed-panel">
              <div className="panel-heading"><div><h2>最新行业资讯</h2><p>跨来源聚合 · 按发布时间最新优先</p></div><span className="live-pill"><i/> DEMO FEED</span></div>
              <div className="filter-area">
                <label className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索技术、企业、产品或关键词..." aria-label="搜索资讯"/><kbd>⌘ K</kbd></label>
                <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="语言筛选"><option value="all">全部语言</option><option value="zh">中文资讯</option><option value="en">英文资讯</option></select>
                <select value={minImportance} onChange={e => setMinImportance(Number(e.target.value))} aria-label="重要性筛选"><option value={0}>全部重要性</option><option value={70}>重要性 ≥ 70</option><option value={80}>重要性 ≥ 80</option><option value={90}>重要性 ≥ 90</option></select>
                <select value={minHeat} onChange={e => setMinHeat(Number(e.target.value))} aria-label="热度筛选"><option value={0}>全部热度</option><option value={50}>热度 ≥ 50</option><option value={70}>热度 ≥ 70</option><option value={85}>热度 ≥ 85</option></select>
              </div>
              <div className="topic-chips">{topics.map(item => <button key={item} className={topic === item ? 'topic-chip selected' : 'topic-chip'} onClick={() => setTopic(item)}>{item}</button>)}</div>
              <div className="feed-toolbar"><span>符合条件 <strong>{filtered.length}</strong> 条资讯</span><div><label className="saved-filter"><input type="checkbox" checked={onlySaved} onChange={e => setOnlySaved(e.target.checked)}/> 仅看收藏</label><button className="text-button" onClick={reset}>重置筛选 ↺</button><span className="sort-label">↓ 最新优先</span></div></div>
              <div className="article-list">{filtered.length ? filtered.map(item => <ArticleCard key={item.id} article={item} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setDetail(item)}/>) : <div className="empty-state"><strong>没有找到匹配的资讯</strong><span>试试调整语言、专题或评分筛选条件。</span><button className="secondary-button" onClick={reset}>清除筛选条件</button></div>}</div>
              <div className="feed-bottom"><span>当前为高保真原型演示数据，不代表真实行业资讯。</span><button className="text-button" onClick={reset}>清除全部筛选</button></div>
            </section>
            <aside className="right-column">
              <section className="panel side-panel"><div className="panel-heading compact"><div><h2>重点研究方向</h2><p>优先追踪的三个行业专题</p></div><span className="more-mark">•••</span></div><div className="focus-list">{['空间智能', '智慧零售', 'AIGC'].map((item, index) => { const rows = articles.filter(x => x.topic === item); const avg = Math.round(rows.reduce((sum, x) => sum + x.importance, 0) / Math.max(1, rows.length)); return <button className="focus-card" key={item} onClick={() => openTopic(item)}><div className="focus-row"><strong>{item}</strong><span>{rows.length} 条样例</span></div><div className="focus-description">平均重要性 {avg} · 点击查看相关资讯</div><div className="progress-track"><div className={`progress-fill fill-${index}`} style={{ width: `${avg}%` }}/></div></button>; })}</div></section>
              <section className="panel side-panel"><div className="panel-heading compact"><div><h2>近期关键进展</h2><p>事件候选 · 尚未人工确认</p></div><span className="more-mark">•••</span></div><div className="mini-timeline">{articles.filter(x => ['空间智能', 'AIGC'].includes(x.topic)).slice(0, 4).map(item => <button className="timeline-item" key={item.id} onClick={() => setDetail(item)}><span className="timeline-date">{dateText(item.publishedAt)}</span><strong>{item.title}</strong><span className="timeline-topic">{item.topic} · 候选进展</span></button>)}</div></section>
              <section className="workflow-note"><div className="workflow-icon">⌘</div><div><strong>研究工作流</strong><p>资讯采集 → 去重聚合 → 人工审核 → 专题时间轴</p><span>正式版本将接入云端数据同步</span></div></section>
            </aside>
          </div>
        </> : <section className="placeholder-page"><div className="eyebrow">AI RADAR · V1.2 PREVIEW</div><h1>{activeNav}</h1><p>该页面将在后续阶段开发。本次先完成情报总览的 React 组件化与交互验证。</p><div className="placeholder-card"><strong>当前阶段：前端首页工程化</strong><span>此模块尚未接入真实数据、后端 API 或管理员认证。</span><button className="primary-button" onClick={() => setActiveNav('情报总览')}>返回情报总览</button></div></section>}
      </div>
    </main>
    <DetailDrawer article={detail} onClose={() => setDetail(null)} saved={detail ? saved.includes(detail.id) : false} onSave={() => detail && toggleSaved(detail.id)}/>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App/>);
