import{_ as a,o as n,c as p,a2 as i}from"./chunks/framework.BRk9mohw.js";const k=JSON.parse('{"title":"技能审查员 🔒","description":"","frontmatter":{"名称":"skill-vetter","版本":"1.0.0","描述":"面向 AI 代理的安全优先技能审查。在从 ClawdHub、GitHub 或其他来源安装任何技能之前使用。检查红旗、权限范围和可疑模式。"},"headers":[],"relativePath":"skills/skill-vetter.md","filePath":"skills/skill-vetter.md"}'),l={name:"skills/skill-vetter.md"};function t(e,s,h,r,c,d){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="技能审查员-🔒" tabindex="-1">技能审查员 🔒 <a class="header-anchor" href="#技能审查员-🔒" aria-label="Permalink to &quot;技能审查员 🔒&quot;">​</a></h1><p>面向 AI 代理技能的安全优先审查协议。<strong>在审查之前永远不要安装技能。</strong></p><h2 id="何时使用" tabindex="-1">何时使用 <a class="header-anchor" href="#何时使用" aria-label="Permalink to &quot;何时使用&quot;">​</a></h2><ul><li>在从 ClawdHub 安装任何技能之前</li><li>在运行来自 GitHub 仓库的技能之前</li><li>在评估其他代理分享的技能时</li><li>在被要求安装未知代码时</li></ul><h2 id="审查协议" tabindex="-1">审查协议 <a class="header-anchor" href="#审查协议" aria-label="Permalink to &quot;审查协议&quot;">​</a></h2><h3 id="第一步-来源检查" tabindex="-1">第一步：来源检查 <a class="header-anchor" href="#第一步-来源检查" aria-label="Permalink to &quot;第一步：来源检查&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>需要回答的问题：</span></span>
<span class="line"><span>- [ ] 这个技能来自哪里？</span></span>
<span class="line"><span>- [ ] 作者是已知/可信赖的吗？</span></span>
<span class="line"><span>- [ ] 有多少下载/星标？</span></span>
<span class="line"><span>- [ ] 最后更新是什么时候？</span></span>
<span class="line"><span>- [ ] 有其他代理的评论吗？</span></span></code></pre></div><h3 id="第二步-代码审查-强制" tabindex="-1">第二步：代码审查（强制） <a class="header-anchor" href="#第二步-代码审查-强制" aria-label="Permalink to &quot;第二步：代码审查（强制）&quot;">​</a></h3><p>读取技能中的所有文件。检查这些<strong>红旗</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>🚨 如果看到以下情况立即拒绝：</span></span>
<span class="line"><span>─────────────────────────────────────────</span></span>
<span class="line"><span>• curl/wget 到未知 URL</span></span>
<span class="line"><span>• 发送数据到外部服务器</span></span>
<span class="line"><span>• 请求凭据/令牌/API 密钥</span></span>
<span class="line"><span>• 读取 ~/.ssh、~/.aws、~/.config 且没有明确原因</span></span>
<span class="line"><span>• 访问 MEMORY.md、USER.md、SOUL.md、IDENTITY.md</span></span>
<span class="line"><span>• 对任何内容使用 base64 解码</span></span>
<span class="line"><span>• 使用 eval() 或 exec() 处理外部输入</span></span>
<span class="line"><span>• 修改系统文件（工作区外）</span></span>
<span class="line"><span>• 安装包但不列出它们</span></span>
<span class="line"><span>• 網絡調用到 IP 而不是域名</span></span>
<span class="line"><span>• 混淆的代码（压缩、编码、压缩）</span></span>
<span class="line"><span>• 请求提升/sudo 权限</span></span>
<span class="line"><span>• 访问浏览器 cookie/session</span></span>
<span class="line"><span>• 触碰凭据文件</span></span>
<span class="line"><span>─────────────────────────────────────────</span></span></code></pre></div><h3 id="第三步-权限范围" tabindex="-1">第三步：权限范围 <a class="header-anchor" href="#第三步-权限范围" aria-label="Permalink to &quot;第三步：权限范围&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>评估：</span></span>
<span class="line"><span>- [ ] 它需要读取哪些文件？</span></span>
<span class="line"><span>- [ ] 它需要写入哪些文件？</span></span>
<span class="line"><span>- [ ] 它运行哪些命令？</span></span>
<span class="line"><span>- [ ] 它需要网络访问吗？到哪里？</span></span>
<span class="line"><span>- [ ] 范围对其声明的目的是否最小化？</span></span></code></pre></div><h3 id="第四步-风险分类" tabindex="-1">第四步：风险分类 <a class="header-anchor" href="#第四步-风险分类" aria-label="Permalink to &quot;第四步：风险分类&quot;">​</a></h3><table tabindex="0"><thead><tr><th>风险等级</th><th>示例</th><th>操作</th></tr></thead><tbody><tr><td>🟢 低</td><td>笔记、天气、格式化</td><td>基本审查，可以安装</td></tr><tr><td>🟡 中</td><td>文件操作、浏览器、API</td><td>需要完整代码审查</td></tr><tr><td>🔴 高</td><td>凭据、交易、系统</td><td>需要人工批准</td></tr><tr><td>⛔ 极端</td><td>安全配置、根访问</td><td><strong>不要安装</strong></td></tr></tbody></table><h2 id="输出格式" tabindex="-1">输出格式 <a class="header-anchor" href="#输出格式" aria-label="Permalink to &quot;输出格式&quot;">​</a></h2><p>审查后，生成此报告：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>技能审查报告</span></span>
<span class="line"><span>═══════════════════════════════════════</span></span>
<span class="line"><span>技能：[名称]</span></span>
<span class="line"><span>来源：[ClawdHub / GitHub / 其他]</span></span>
<span class="line"><span>作者：[用户名]</span></span>
<span class="line"><span>版本：[版本]</span></span>
<span class="line"><span>───────────────────────────────────────</span></span>
<span class="line"><span>指标：</span></span>
<span class="line"><span>• 下载/星标：[数量]</span></span>
<span class="line"><span>• 最后更新：[日期]</span></span>
<span class="line"><span>• 审查的文件：[数量]</span></span>
<span class="line"><span>───────────────────────────────────────</span></span>
<span class="line"><span>红旗：[无 / 列出]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>需要的权限：</span></span>
<span class="line"><span>• 文件：[列表或&quot;无&quot;]</span></span>
<span class="line"><span>• 网络：[列表或&quot;无&quot;]  </span></span>
<span class="line"><span>• 命令：[列表或&quot;无&quot;]</span></span>
<span class="line"><span>───────────────────────────────────────</span></span>
<span class="line"><span>风险等级：[🟢 低 / 🟡 中 / 🔴 高 / ⛔ 极端]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>裁决：[✅ 可以安全安装 / ⚠️ 安装时需谨慎 / ❌ 不要安装]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>备注：[任何观察]</span></span>
<span class="line"><span>═══════════════════════════════════════</span></span></code></pre></div><h2 id="快速审查命令" tabindex="-1">快速审查命令 <a class="header-anchor" href="#快速审查命令" aria-label="Permalink to &quot;快速审查命令&quot;">​</a></h2><p>对于托管在 GitHub 上的技能：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检查仓库统计</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://api.github.com/repos/OWNER/REPO&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> jq</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;{stars: .stargazers_count, forks: .forks_count, updated: .updated_at}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 列出技能文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://api.github.com/repos/OWNER/REPO/contents/skills/SKILL_NAME&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> jq</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;.[].name&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 获取并审查 SKILL.md</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://raw.githubusercontent.com/OWNER/REPO/main/skills/SKILL_NAME/SKILL.md&quot;</span></span></code></pre></div><h2 id="信任层级" tabindex="-1">信任层级 <a class="header-anchor" href="#信任层级" aria-label="Permalink to &quot;信任层级&quot;">​</a></h2><ol><li><strong>官方 OpenClaw 技能</strong> → 较低审查（仍需审查）</li><li><strong>高星标仓库（1000+）</strong> → 适度审查</li><li><strong>已知作者</strong> → 适度审查</li><li><strong>新/未知来源</strong> → 最高审查</li><li><strong>请求凭据的技能</strong> → 始终需要人工批准</li></ol><h2 id="记住" tabindex="-1">记住 <a class="header-anchor" href="#记住" aria-label="Permalink to &quot;记住&quot;">​</a></h2><ul><li>没有什么技能值得牺牲安全</li><li>如有疑问，不要安装</li><li>对于高风险决策询问您的人类</li><li>记录您审查的内容以供将来参考</li></ul><hr><p><em>偏执是一种功能。</em> 🔒🦀</p>`,26)])])}const u=a(l,[["render",t]]);export{k as __pageData,u as default};
