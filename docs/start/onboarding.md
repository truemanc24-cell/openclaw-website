# 入职引导 (macOS 应用)

本文档描述**当前**的首次运行设置流程。目标是实现顺畅的"第 0 天"体验：
选择网关运行位置、连接认证、运行向导，让代理自我引导。
有关入职引导路径的概述，请参阅 [入职引导概述](/start/onboarding-overview)。

<Steps>
  <Step title="批准 macOS 警告">
    <Frame>
      <img src="https://mintcdn.com/clawdhub/zr61AlCx-k7XN8so/assets/macos-onboarding/01-macos-warning.jpeg?fit=max&auto=format&n=zr61AlCx-k7XN8so&q=85&s=7ade99ff85eba6a2fe743ff1f7799087" alt="" width="1132" height="818" data-path="assets/macos-onboarding/01-macos-warning.jpeg" />
    </Frame>
  </Step>

  <Step title="批准查找本地网络">
    <Frame>
      <img src="https://mintcdn.com/clawdhub/zr61AlCx-k7XN8so/assets/macos-onboarding/02-local-networks.jpeg?fit=max&auto=format&n=zr61AlCx-k7XN8so&q=85&s=e9fcec535d0cdca207cff0cf2379e951" alt="" width="1132" height="818" data-path="assets/macos-onboarding/02-local-networks.jpeg" />
    </Frame>
  </Step>

  <Step title="欢迎和安全提示">
    <Frame caption="阅读显示的安全提示并做出相应决定">
      <img src="https://mintcdn.com/clawdhub/zr61AlCx-k7XN8so/assets/macos-onboarding/03-security-notice.png?fit=max&auto=format&n=zr61AlCx-k7XN8so&q=85&s=8866e4aaac170614a163d990091addac" alt="" width="1262" height="1570" data-path="assets/macos-onboarding/03-security-notice.png" />
    </Frame>

    安全信任模型：

    * 默认情况下，OpenClaw 是一个个人代理：一个受信任的操作员边界。
    * 共享/多用户设置需要锁定（分离信任边界，保持最小的工具访问权限，并遵循 [安全](/gateway/security) 原则）。
    * 本地入职引导现在默认新配置为 `tools.profile: "coding"`，以便新的本地设置可以保留文件系统/运行时工具，而不会强制使用不受限制的 `full` 配置。
    * 如果启用了 hooks/webhooks 或其他不受信任的内容源，请使用强大的现代模型层级，并保持严格的工具策略/沙箱。
  </Step>

  <Step title="本地 vs 远程">
    <Frame>
      <img src="https://mintcdn.com/clawdhub/zr61AlCx-k7XN8so/assets/macos-onboarding/04-choose-gateway.png?fit=max&auto=format&n=zr61AlCx-k7XN8so&q=85&s=7e923f389e6d774363064140691b4fbe" alt="" width="1262" height="1570" data-path="assets/macos-onboarding/04-choose-gateway.png" />
    </Frame>

    **网关**在哪里运行？

    * **此 Mac（仅本地）：** 入职引导可以配置认证并在本地写入凭据。
    * **远程（通过 SSH/Tailnet）：** 入职引导**不会**配置本地认证；
      凭据必须存在于网关主机上。
    * **稍后配置：** 跳过设置并保持应用未配置状态。

    <Tip>
      **网关认证提示：**

      * 向导现在即使对回环也会生成 **token**，因此本地 WS 客户端必须进行认证。
      * 如果禁用认证，任何本地进程都可以连接；仅在完全可信的机器上使用。
      * 对于多机器访问或非回环绑定，请使用 **token**。
    </Tip>
  </Step>

  <Step title="权限">
    <Frame caption="选择你希望给予 OpenClaw 的权限">
      <img src="https://mintcdn.com/clawdhub/zr61AlCx-k7XN8so/assets/macos-onboarding/05-permissions.png?fit=max&auto=format&n=zr61AlCx-k7XN8so&q=85&s=6c45fa49282cf491a1425a714ec68f18" alt="" width="1262" height="1570" data-path="assets/macos-onboarding/05-permissions.png" />
    </Frame>

    入职引导请求所需的 TCC 权限：

    * 自动化（AppleScript）
    * 通知
    * 辅助功能
    * 屏幕录制
    * 麦克风
    * 语音识别
    * 摄像头
    * 位置
  </Step>

  <Step title="CLI">
    <Info>此步骤是可选的</Info>
    应用可以通过 npm/pnpm 安装全局 `openclaw` CLI，以便终端
    工作流和 launchd 任务开箱即用。
  </Step>

  <Step title="入职引导聊天（专用会话）">
    设置后，应用会打开一个专用的入职引导聊天会话，以便代理可以
    介绍自己并引导下一步。这将首次运行指导与你的正常对话分开。
    有关网关主机上首次代理运行期间发生的情况，请参阅 [引导](/start/bootstrapping)。
  </Step>
</Steps>


Built with [Mintlify](https://mintlify.com).