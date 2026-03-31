---
title: getting started
description: getting started 页面
---
<Info>
  最快聊天方式：打开控制界面（无需设置渠道）。运行 `openclaw dashboard`
  并在浏览器中聊天，或在
  <Tooltip headline="网关主机" tip="运行 OpenClaw 网关服务的机器。">网关主机</Tooltip> 上打开 `http://127.0.0.1:18789/`。
  文档：[控制面板](/web/dashboard) 和 [控制界面](/web/control-ui)。
</Info>

## 前置要求

* 推荐使用 Node 24（Node 22 LTS，当前 `22.16+`，为兼容性仍支持）

<Tip>
  如果不确定，运行 `node --version` 检查 Node 版本。
</Tip>

## 快速设置（CLI）

<Steps>
  <Step title="安装 OpenClaw（推荐）">
    <Tabs>
      <Tab title="macOS/Linux">
        ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
        curl -fsSL https://openclaw.ai/install.sh | bash
        ```

        <img src="https://mintcdn.com/clawdhub/U8jr7qEbUc9OU9YR/assets/install-script.svg?fit=max&auto=format&n=U8jr7qEbUc9OU9YR&q=85&s=50706f81e3210a610262f14facb11f65" alt="安装脚本流程" className="rounded-lg" width="1370" height="581" data-path="assets/install-script.svg" />
      </Tab>

      <Tab title="Windows (PowerShell)">
        ```powershell  theme={"theme":{"light":"min-light","dark":"min-dark"}}
        iwr -useb https://openclaw.ai/install.ps1 | iex
        ```
      </Tab>
    </Tabs>

    <Note>
      其他安装方式和要求请参阅：[安装](/install)。
    </Note>
  </Step>

  <Step title="运行入职引导">
    ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --install-daemon
    ```

    入职引导会配置认证、网关设置和可选渠道。
    详细信息请参阅 [入职引导 (CLI)](/start/wizard)。
  </Step>

  <Step title="检查网关状态">
    如果已安装服务，网关应该已经在运行：

    ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw gateway status
    ```
  </Step>

  <Step title="打开控制界面">
    ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw dashboard
    ```
  </Step>
</Steps>

<Check>
  如果控制界面能够加载，说明网关已准备就绪。
</Check>

## 可选的检查和扩展功能

<AccordionGroup>
  <Accordion title="在前台运行网关">
    用于快速测试或故障排除。

    ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw gateway --port 18789
    ```
  </Accordion>

  <Accordion title="发送测试消息">
    需要已配置的渠道。

    ```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw message send --target +15555550123 --message "Hello from OpenClaw"
    ```
  </Accordion>
</AccordionGroup>

## 有用的环境变量

如果以服务账户运行 OpenClaw，或希望自定义配置/状态位置：

* `OPENCLAW_HOME` 设置用于内部路径解析的主目录。
* `OPENCLAW_STATE_DIR` 覆盖状态目录。
* `OPENCLAW_CONFIG_PATH` 覆盖配置文件路径。

完整的环境变量参考请参阅：[环境变量](/help/environment)。

## 深入了解

<Columns>
  <Card title="入职引导 (CLI)" href="/start/wizard">
    完整的 CLI 入职引导参考和高级选项。
  </Card>

  <Card title="macOS 应用入职引导" href="/start/onboarding">
    macOS 应用的首次运行流程。
  </Card>
</Columns>

## 你将拥有

* 一个运行中的网关
* 已配置的认证
* 控制界面访问权限或已连接的渠道

## 下一步

* DM 安全和审批：[配对](/channels/pairing)
* 连接更多渠道：[渠道](/channels)
* 高级工作流和源码安装：[设置](/start/setup)


Built with [Mintlify](https://mintlify.com).