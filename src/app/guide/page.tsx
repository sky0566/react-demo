import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Operations Guide - Gallop Lift Parts',
  robots: 'noindex, nofollow',
};

const sections = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'logos', label: 'Logos' },
  { id: 'news', label: 'News' },
  { id: 'seo', label: 'SEO (重点)' },
  { id: 'inquiries', label: 'Inquiries' },
  { id: 'partners', label: 'Partners' },
  { id: 'settings', label: 'Settings' },
  { id: 'security', label: 'Security (安全)' },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2B6CB0] text-white sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-[20px] font-bold">Gallop Lift Parts - 后台操作指南</h1>
          <a href="/admin" className="text-[14px] bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded transition-colors">
            进入后台 →
          </a>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <nav className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="sticky top-[80px]">
            <h3 className="text-[13px] font-bold text-[#999] uppercase mb-3 tracking-wider">目录</h3>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block px-3 py-1.5 text-[14px] text-[#555] hover:text-[#2B6CB0] hover:bg-[#f0f7ff] rounded transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Intro */}
          <div className="mb-10 pb-8 border-b border-[#e2e5e7]">
            <h2 className="text-[28px] font-bold text-[#222] mb-3">管理后台操作指南</h2>
            <p className="text-[16px] text-[#555] leading-relaxed">
              本指南详细说明 Gallop Lift Parts 网站后台的各项功能操作方法，重点介绍 SEO 优化相关设置。
            </p>
            <div className="mt-4 bg-[#f0f7ff] border border-[#2B6CB0]/20 rounded-lg px-5 py-3 text-[14px] text-[#2B6CB0]">
              后台地址：<code className="bg-white px-2 py-0.5 rounded border text-[13px]">/admin</code>
              &nbsp;&nbsp;默认账号可在 Settings 页面修改密码。
            </div>
          </div>

          {/* Section: Dashboard */}
          <section id="dashboard" className="mb-12">
            <SectionTitle>1. Dashboard 仪表盘</SectionTitle>
            <p>登录后台后的首页，展示网站核心数据概览：</p>
            <ul className="guide-list">
              <li><strong>总产品数</strong> — 当前数据库中所有产品数量</li>
              <li><strong>总分类数</strong> — 产品分类数量</li>
              <li><strong>总询盘数</strong> — 客户提交的询价数量</li>
              <li><strong>页面访问量</strong> — 网站页面浏览次数统计</li>
              <li><strong>在线访客</strong> — 当前正在浏览网站的用户数</li>
              <li><strong>热门页面</strong> — 访问量最高的页面排行</li>
            </ul>
            <Tip>点击右上角刷新按钮可以实时更新数据。</Tip>
          </section>

          {/* Section: Products */}
          <section id="products" className="mb-12">
            <SectionTitle>2. Products 产品管理</SectionTitle>
            
            <h4 className="guide-subtitle">查看产品</h4>
            <p>产品列表支持按 <strong>关键词搜索</strong>（名称或 SKU）、<strong>分类筛选</strong>、<strong>状态筛选</strong>（Active/Inactive）。</p>

            <h4 className="guide-subtitle">新增产品</h4>
            <ol className="guide-list-ordered">
              <li>点击右上角 <code>+ Add Product</code> 按钮</li>
              <li>填写必填字段：<strong>SKU</strong>（产品编号，唯一）和 <strong>Name</strong>（产品名称）</li>
              <li>选择 <strong>Category</strong> 分类</li>
              <li>填写 <strong>Short Description</strong> — 简短描述，显示在产品详情页标题下方</li>
              <li>填写 <strong>Description</strong> — 详细描述，支持 HTML 格式（表格、列表、图片都可以）</li>
              <li>在 <strong>Image URLs</strong> 中粘贴图片链接，每行一个 URL</li>
              <li>填写 <strong>SEO Settings</strong>（见 SEO 章节详细说明）</li>
              <li>勾选 Active（上架）和 Featured（推荐/热门）</li>
              <li>点击 Create 保存</li>
            </ol>

            <h4 className="guide-subtitle">编辑产品</h4>
            <p>点击产品行右侧的 <code>Edit</code> 按钮，修改后点击 <code>Update</code> 保存。</p>
            <p className="mt-2">编辑弹窗右上角有 <code>Preview</code> 按钮，点击可实时预览：</p>
            <ul className="guide-list">
              <li><strong>图片预览</strong> — 查看所有图片 URL 是否正确加载</li>
              <li><strong>Description 渲染</strong> — 查看 HTML 描述的实际排版效果</li>
              <li><strong>SEO 预览</strong> — 模拟 Google 搜索结果展示标题和描述</li>
            </ul>
            <Tip>每次修改 Description 或 SEO 字段后，建议点 Preview 确认效果再保存。</Tip>

            <h4 className="guide-subtitle">拖动排序</h4>
            <p>产品列表左侧有拖拽手柄（六个点图标），按住拖动可以调整产品的显示顺序。松手后自动保存到服务器。</p>
            <Tip>排序会立即同步到前台产品列表（Hot Selling 排序）。前台默认按 Hot Selling 排序，只有两种排序：Hot Selling 和 Name。热门产品建议拖到最前面。</Tip>

            <h4 className="guide-subtitle">批量导入</h4>
            <p>点击 <code>Batch Import</code> 可以通过 JSON 格式批量导入产品数据。</p>

            <h4 className="guide-subtitle">删除产品</h4>
            <p>点击 <code>Delete</code> 按钮，确认后永久删除。<strong>建议先设为 Inactive 而非直接删除。</strong></p>
          </section>

          {/* Section: Categories */}
          <section id="categories" className="mb-12">
            <SectionTitle>3. Categories 分类管理</SectionTitle>
            <p>管理产品分类，每个分类包含：</p>
            <ul className="guide-list">
              <li><strong>Name</strong> — 分类名称（如 Elevator, Selcom, Fermator）</li>
              <li><strong>Slug</strong> — URL 路径标识，自动根据名称生成（如 <code>elevator</code>, <code>selcom</code>）</li>
              <li><strong>Description</strong> — 分类描述</li>
              <li><strong>Image</strong> — 分类封面图，显示在首页 Product Categories 区域</li>
              <li><strong>Logo</strong> — 品牌 Logo 图标，显示在侧边栏分类列表和导航下拉菜单</li>
              <li><strong>Sort Order</strong> — 排序序号，数字越小越靠前</li>
            </ul>
            <Tip>Logo 和 Image 也可以在独立的 Logos 管理模块中修改。</Tip>
          </section>

          {/* Section: Logos */}
          <section id="logos" className="mb-12">
            <SectionTitle>4. Logos Logo 管理</SectionTitle>
            <p>独立的 Logo 管理模块，集中管理所有分类的 Logo 图标和封面图。</p>
            <ul className="guide-list">
              <li><strong>Logo (Sidebar)</strong> — 品牌小图标，显示在产品页左侧分类导航和顶部导航下拉菜单中</li>
              <li><strong>Category Image (Homepage)</strong> — 分类大图，显示在首页的 Product Categories 卡片中</li>
            </ul>
            <p>点击 <code>Edit Logo</code> 或 <code>Edit Image</code> 按钮，粘贴图片 URL 后点击 Save 即可。</p>
            <Tip>建议 Logo 图标使用透明背景的 PNG 格式，尺寸约 100×40px。分类大图建议使用 4:3 长方形比例的产品图。</Tip>
          </section>

          {/* Section: News */}
          <section id="news" className="mb-12">
            <SectionTitle>5. News 新闻/动态管理</SectionTitle>
            <p>用于发布公司新闻、发货动态、行业资讯等。主要用于展示发货记录。</p>

            <h4 className="guide-subtitle">新增文章</h4>
            <ol className="guide-list-ordered">
              <li>点击 <code>+ Add News</code></li>
              <li>填写 <strong>Title</strong>（标题）— 同时影响 SEO</li>
              <li>填写 <strong>Slug</strong>（URL 路径）— 建议使用英文短横线分隔，如 <code>selcom-door-shipment-march-2026</code></li>
              <li>填写 <strong>Content</strong>（正文）— 支持 HTML，可以使用 <code>&lt;h2&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;img&gt;</code> 等标签</li>
              <li>填写 <strong>Excerpt</strong>（摘要）— 显示在列表页的简短预览</li>
              <li>填写 <strong>Image URL</strong>（封面图）</li>
              <li>选择 <strong>Category</strong>（如 Shipping, Industry News）</li>
              <li>设置 <strong>Active</strong> 状态发布</li>
            </ol>

            <h4 className="guide-subtitle">Content 内容格式示例</h4>
            <CodeBlock>{`<h2>发货详情</h2>
<p>本次发货包含以下产品：</p>
<ul>
  <li><strong>Fermator 门机</strong> - 50 套</li>
  <li><strong>Selcom 门锁</strong> - 100 套</li>
</ul>

<div class="gallery">
  <figure class="gallery-item">
    <div class="gallery-icon">
      <img src="图片URL" alt="描述">
    </div>
    <figcaption>图片说明</figcaption>
  </figure>
</div>`}</CodeBlock>
            <Tip>gallery 图片画廊会自动一行显示 4 张图，适合展示发货打包照片。</Tip>
          </section>

          {/* Section: SEO - KEY SECTION */}
          <section id="seo" className="mb-12">
            <SectionTitle>
              <span className="inline-flex items-center gap-2">
                6. SEO 搜索引擎优化
                <span className="bg-red-500 text-white text-[12px] px-2 py-0.5 rounded-full font-normal">重点</span>
              </span>
            </SectionTitle>
            
            <div className="bg-[#fffbeb] border border-yellow-300 rounded-lg p-5 mb-6 text-[14px]">
              <strong className="text-yellow-800">什么是 SEO？</strong>
              <p className="text-yellow-800 mt-1">
                SEO (Search Engine Optimization) 是让 Google、Bing 等搜索引擎更好地理解你的页面内容，
                从而在搜索结果中获得更高排名的技术。做好 SEO 可以带来大量免费的精准客户流量。
              </p>
            </div>

            <h4 className="guide-subtitle">6.1 产品页 SEO 设置</h4>
            <p>每个产品在编辑时都有三个 SEO 字段，这是最重要的 SEO 操作：</p>
            
            <div className="bg-gray-50 border rounded-lg p-5 my-4">
              <h5 className="font-bold text-[15px] text-[#222] mb-3">Meta Title（页面标题）</h5>
              <p className="text-[14px] text-[#555] mb-2">显示在浏览器标签和 Google 搜索结果的蓝色标题。</p>
              <p className="text-[14px] mb-1"><strong>格式建议：</strong></p>
              <CodeBlock>产品名 + 核心关键词 | Gallop Lift Parts</CodeBlock>
              <p className="text-[14px] mt-2 mb-1"><strong>示例：</strong></p>
              <ul className="text-[14px] space-y-1 ml-4">
                <li>✅ <code>Selcom ECO Door Motor for Elevator Door Operator | Gallop Lift Parts</code></li>
                <li>✅ <code>Fermator VF5+ Landing Door - Automatic Elevator Door System</code></li>
                <li>❌ <code>产品页面</code>（太笼统，没有关键词）</li>
                <li>❌ <code>Selcom ECO Door Motor Selcom Motor Selcom Elevator Motor Buy Selcom</code>（关键词堆砌）</li>
              </ul>
              <Tip>标题长度建议 50-60 个字符，超出部分会在搜索结果中被截断。</Tip>
            </div>

            <div className="bg-gray-50 border rounded-lg p-5 my-4">
              <h5 className="font-bold text-[15px] text-[#222] mb-3">Meta Description（页面描述）</h5>
              <p className="text-[14px] text-[#555] mb-2">显示在 Google 搜索结果标题下方的灰色描述文字。</p>
              <p className="text-[14px] mb-1"><strong>格式建议：</strong></p>
              <CodeBlock>简明描述产品用途 + 核心卖点 + 行动号召</CodeBlock>
              <p className="text-[14px] mt-2 mb-1"><strong>示例：</strong></p>
              <ul className="text-[14px] space-y-1 ml-4">
                <li>✅ <code>Genuine Selcom ECO Door Motor for elevator door systems. OEM quality, 12-month warranty. Fast shipping worldwide. Contact us for best price.</code></li>
                <li>❌ <code>We sell elevator parts.</code>（太短，没有具体信息）</li>
              </ul>
              <Tip>描述长度建议 120-160 个字符。要包含用户可能搜索的关键词。</Tip>
            </div>

            <div className="bg-gray-50 border rounded-lg p-5 my-4">
              <h5 className="font-bold text-[15px] text-[#222] mb-3">Meta Keywords（关键词）</h5>
              <p className="text-[14px] text-[#555] mb-2">虽然 Google 已不直接使用 keywords，但其他搜索引擎仍参考，建议填写。</p>
              <p className="text-[14px] mb-1"><strong>格式：</strong>英文逗号分隔</p>
              <CodeBlock>selcom door motor, ECO door motor, elevator door operator, selcom spare parts, elevator door motor</CodeBlock>
              <Tip>选择 5-10 个相关关键词，包含产品名、品牌名、产品类型、应用场景。</Tip>
            </div>

            <h4 className="guide-subtitle">6.2 产品名称和描述的 SEO 技巧</h4>
            <div className="space-y-3 text-[14px]">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✅</span>
                <div>
                  <strong>产品名称要具体</strong>
                  <p className="text-[#666]">使用「品牌 + 型号 + 产品类型」格式，如 &quot;Selcom ECO Door Control Board 903510G01S-L&quot;</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✅</span>
                <div>
                  <strong>Description（详细描述）要丰富</strong>
                  <p className="text-[#666]">使用 H2 标签分节（如 &lt;h2&gt;Features&lt;/h2&gt;, &lt;h2&gt;Specifications&lt;/h2&gt;），用列表列出参数，写 200 字以上</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✅</span>
                <div>
                  <strong>图片 alt 文字</strong>
                  <p className="text-[#666]">在 Description 中插入图片时，alt 属性写上产品名称，如 &lt;img alt=&quot;Selcom ECO Door Motor&quot;&gt;</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✅</span>
                <div>
                  <strong>Short Description 要简洁有力</strong>
                  <p className="text-[#666]">1-2 句话点明产品和核心卖点，这会作为搜索结果的 fallback 描述</p>
                </div>
              </div>
            </div>

            <h4 className="guide-subtitle">6.3 News/Blog 文章的 SEO 价值</h4>
            <p>发布新闻文章是提升网站 SEO 的重要手段：</p>
            <ul className="guide-list">
              <li><strong>保持更新频率</strong> — 建议每周至少发布 1 篇，Google 喜欢持续更新的网站</li>
              <li><strong>Title 要包含关键词</strong> — 如 &quot;Selcom Elevator Door Parts Shipment to Saudi Arabia&quot; 包含了品牌名、产品类型、发货目的地</li>
              <li><strong>内容中自然使用关键词</strong> — 不要堆砌，要自然出现在正文中</li>
              <li><strong>附带产品链接</strong> — 在文章中链接到相关产品页，形成内部链接网络</li>
              <li><strong>使用图片gallery</strong> — 展示发货实拍图，增加内容丰富度和可信度</li>
            </ul>

            <h4 className="guide-subtitle">6.4 文章内容写作模板</h4>
            <div className="bg-gray-50 border rounded-lg p-5 my-4 text-[14px]">
              <p className="font-bold mb-2">发货动态类文章模板：</p>
              <ol className="space-y-1 ml-4 list-decimal">
                <li><strong>开头</strong>：说明发货目的地和客户类型</li>
                <li><strong>产品清单</strong>：用列表列出本次发货的具体产品（带链接）</li>
                <li><strong>质量检验</strong>：描述质检和打包流程，附图</li>
                <li><strong>市场分析</strong>：简述目的地市场的电梯需求</li>
                <li><strong>总结</strong>：总结并引导联系</li>
              </ol>
            </div>

            <h4 className="guide-subtitle">6.5 SEO 日常检查清单</h4>
            <div className="bg-[#f0fdf4] border border-green-200 rounded-lg p-5 my-4">
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>每个产品都填写了 Meta Title 和 Meta Description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>产品名称使用「品牌 + 型号 + 类型」格式</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>每个产品有至少 1 张清晰的产品图</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>Description 内容超过 200 字，使用 H2 和列表格式化</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>每周至少发布 1 篇 News 文章</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>News 文章中包含相关产品的链接</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>新产品的 slug（URL）使用英文、简短、含关键词</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">☐</span>
                  <span>定期查看 Dashboard 数据，关注热门页面和访客趋势</span>
                </li>
              </ul>
            </div>

            <h4 className="guide-subtitle">6.6 高级 SEO：网站已内置的自动化功能</h4>
            <p>以下 SEO 功能已在网站代码中自动实现，无需手动操作：</p>
            <ul className="guide-list">
              <li><strong>Sitemap</strong> — 自动生成 <code>/sitemap.xml</code>，包含所有产品和分类页面</li>
              <li><strong>Robots.txt</strong> — 自动允许搜索引擎抓取</li>
              <li><strong>JSON-LD 结构化数据</strong> — 产品页自动生成 Product Schema（品牌、价格、库存状态），帮助 Google 理解产品信息</li>
              <li><strong>Canonical URL</strong> — 每个页面自动设置规范 URL，避免重复内容</li>
              <li><strong>H1/H2 语义化</strong> — 产品名使用 H1，各节标题使用 H2，符合 SEO 最佳实践</li>
              <li><strong>Breadcrumb 面包屑</strong> — 产品页和新闻页自动生成面包屑导航</li>
              <li><strong>Open Graph</strong> — 社交媒体分享时自动显示标题、描述和图片</li>
              <li><strong>next/image 优化</strong> — 图片自动转换 WebP 格式、响应式尺寸、CDN 缓存</li>
            </ul>
          </section>

          {/* Section: Inquiries */}
          <section id="inquiries" className="mb-12">
            <SectionTitle>7. Inquiries 询盘管理</SectionTitle>
            <p>客户通过产品详情页的 &quot;Request a Quote&quot; 表单提交的询价信息。</p>
            <ul className="guide-list">
              <li>查看客户姓名、邮箱、公司、电话、留言内容</li>
              <li>支持标记已读/未读状态</li>
              <li>支持删除</li>
            </ul>
            <Tip>建议每天检查新询盘并及时回复，响应速度直接影响成交率。</Tip>
          </section>

          {/* Section: Partners */}
          <section id="partners" className="mb-12">
            <SectionTitle>8. Partners 合作伙伴</SectionTitle>
            <p>管理首页 &quot;Cooperation Partner&quot; 区域展示的合作伙伴 Logo。</p>
            <ul className="guide-list">
              <li><strong>Name</strong> — 合作伙伴名称</li>
              <li><strong>Logo</strong> — Logo 图片 URL（建议透明背景 PNG）</li>
              <li><strong>Website</strong> — 合作伙伴官网链接（可选）</li>
              <li><strong>Sort Order</strong> — 显示排序</li>
            </ul>
          </section>

          {/* Section: Settings */}
          <section id="settings" className="mb-12">
            <SectionTitle>9. Settings 系统设置</SectionTitle>
            <p>修改管理员密码和其他系统配置。</p>
            <Tip>建议定期更换密码，使用强密码（8位以上，包含字母数字特殊字符）。</Tip>
          </section>

          {/* Section: Security */}
          <section id="security" className="mb-12">
            <SectionTitle>
              <span className="inline-flex items-center gap-2">
                10. Security 安全策略
                <span className="bg-red-500 text-white text-[12px] px-2 py-0.5 rounded-full font-normal">重要</span>
              </span>
            </SectionTitle>
            
            <div className="bg-[#fef2f2] border border-red-200 rounded-lg p-5 mb-6 text-[14px]">
              <strong className="text-red-800">网站已内置多层安全防护</strong>
              <p className="text-red-800 mt-1">
                以下安全机制已自动生效，无需手动配置。了解这些机制有助于正确使用后台和排查问题。
              </p>
            </div>

            <h4 className="guide-subtitle">10.1 API 鉴权保护</h4>
            <p>所有后台管理操作（增删改）的 API 都需要登录后的 Token 才能访问：</p>
            <ul className="guide-list">
              <li><strong>产品、分类、新闻、合作伙伴</strong> — 创建、修改、删除全部需要管理员身份验证</li>
              <li><strong>询盘数据</strong> — 查看、修改、删除需要管理员登录（客户提交询盘不需要登录）</li>
              <li><strong>统计数据、系统设置</strong> — 仅管理员可查看和修改</li>
              <li><strong>公开接口不受影响</strong> — 产品列表、新闻列表等前台展示接口正常公开</li>
            </ul>
            <Tip>如果在后台操作时遇到 &quot;Unauthorized&quot; 错误，说明登录已过期（8小时），请重新登录。</Tip>

            <h4 className="guide-subtitle">10.2 XSS 防护（跨站脚本攻击）</h4>
            <p>所有用户输入的 HTML 内容（产品描述、新闻正文）在页面显示前会自动消毒处理：</p>
            <ul className="guide-list">
              <li>自动过滤 <code>&lt;script&gt;</code>、<code>&lt;iframe&gt;</code>、<code>onclick</code> 等危险标签和属性</li>
              <li>保留安全的 HTML 标签（标题、列表、表格、图片、链接等）</li>
              <li>后台编辑预览同样受到保护</li>
            </ul>
            <Tip>正常使用 HTML 编写产品描述和新闻内容不受影响，只有恶意代码会被过滤。</Tip>

            <h4 className="guide-subtitle">10.3 访问频率限制</h4>
            <p>为防止恶意攻击和垃圾信息，以下操作有频率限制：</p>
            <div className="bg-gray-50 border rounded-lg p-5 my-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-bold">操作</th>
                    <th className="text-left py-2 font-bold">限制</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">管理员登录</td>
                    <td className="py-2">5 次 / 15 分钟（每 IP）</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">客户提交询盘</td>
                    <td className="py-2">20 次 / 小时（每 IP）</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">发送报价邮件</td>
                    <td className="py-2">10 次 / 小时（每 IP）</td>
                  </tr>
                  <tr>
                    <td className="py-2">下载报价 PDF</td>
                    <td className="py-2">30 次 / 小时（每 IP）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Tip>正常客户操作不会触发限制。如果客户反馈无法提交询盘，可能是同一网络（如公司）的多人同时操作，过一小时后自动恢复。</Tip>

            <h4 className="guide-subtitle">10.4 HTTP 安全头</h4>
            <p>网站自动添加了以下 HTTP 安全响应头：</p>
            <ul className="guide-list">
              <li><strong>X-Frame-Options: SAMEORIGIN</strong> — 防止网站被嵌入到其他站点的 iframe 中（防点击劫持）</li>
              <li><strong>X-Content-Type-Options: nosniff</strong> — 防止浏览器 MIME 类型嗅探</li>
              <li><strong>Strict-Transport-Security</strong> — 强制 HTTPS 访问</li>
              <li><strong>Referrer-Policy</strong> — 控制来源信息的发送策略</li>
              <li><strong>Permissions-Policy</strong> — 禁用不需要的浏览器 API（摄像头、麦克风、定位）</li>
            </ul>

            <h4 className="guide-subtitle">10.5 Middleware 路由保护</h4>
            <p>所有 <code>/admin</code> 页面在服务器端受 middleware 保护：</p>
            <ul className="guide-list">
              <li>未登录访问 <code>/admin</code> 会自动跳转到登录页</li>
              <li>登录 Token 有效期 8 小时，过期后需重新登录</li>
            </ul>

            <h4 className="guide-subtitle">10.6 输入验证</h4>
            <p>客户提交的表单数据会进行验证：</p>
            <ul className="guide-list">
              <li>必填字段检查（姓名、邮箱）</li>
              <li>邮箱格式验证</li>
              <li>字段长度限制（姓名 200 字符、留言 5000 字符等）</li>
              <li>邮件头注入防护（过滤换行符等控制字符）</li>
            </ul>

            <h4 className="guide-subtitle">10.7 图片安全</h4>
            <p>所有产品图片已迁移到本地服务器，不再依赖外部 WordPress 服务器。</p>
            <ul className="guide-list">
              <li>图片存储在 <code>/images/wp/</code> 目录下，由 Next.js 直接提供服务</li>
              <li>图片加载限制为指定域名，防止恶意外链</li>
            </ul>

            <h4 className="guide-subtitle">10.8 上线前安全检查清单</h4>
            <div className="bg-[#fef2f2] border border-red-200 rounded-lg p-5 my-4">
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">☐</span>
                  <span>修改默认管理员密码（默认 <code>admin</code> / <code>admin123</code>）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">☐</span>
                  <span>设置环境变量 <code>JWT_SECRET</code>（用于加密登录令牌，建议 32 位以上随机字符串）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">☐</span>
                  <span>确认 SMTP 邮件配置正确（如已配置）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">☐</span>
                  <span>域名已启用 HTTPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">☐</span>
                  <span>Vercel 环境变量中设置了 <code>JWT_SECRET</code></span>
                </li>
              </ul>
            </div>
            <Tip>上线前务必完成以上检查清单，特别是修改默认密码和设置 JWT_SECRET！</Tip>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-[#e2e5e7] text-center text-[14px] text-[#999]">
            <p>Gallop Lift Parts Admin Guide · Last updated: April 2026</p>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[22px] font-bold text-[#2B6CB0] mb-4 pb-2 border-b-2 border-[#2B6CB0]/20">{children}</h3>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f0f7ff] border-l-4 border-[#2B6CB0] px-4 py-3 my-4 text-[14px] text-[#2B6CB0]">
      <strong>💡 提示：</strong>{children}
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-[#1e1e1e] text-green-400 text-[13px] px-4 py-3 rounded-lg overflow-x-auto my-2 leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}
