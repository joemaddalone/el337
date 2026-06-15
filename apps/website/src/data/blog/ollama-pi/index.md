---
title: "Ollama + Pi"
date: 2026-02-20
tags: ["software", "ai"]
excerpt: "pi coding agent + ollama"
---

## What is Pi?

[Pi](https://github.com/badlogic/pi-mono): Tools for building AI agents and managing LLM deployments

## What is Ollama?

[Ollama](https://ollama.ai/) is a tool for downloading and running large language models. It's like bittorrent for open source LLMs.

## Install Ollama

[This post](/posts/ollama) has instructions for installing and using Ollama.


## Let's Go!

```bash
mkdir ai-local
cd ai-local
bun init -y
bun add @mariozechner/pi-coding-agent @mariozechner/pi-ai @mariozechner/pi-agent-core
touch index.ts model.ts
```

### model.ts

```ts
import type { Model } from "@mariozechner/pi-ai";

const qwen: Model<"openai-responses"> = {
	id: "qwen3:8b", // same as ollama list tag
	name: "qwen3:8b",
	api: "openai-responses",
	provider: "ollama",
	baseUrl: "http://localhost:11434/v1",
	reasoning: true,
	input: ["text"],
	cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
	contextWindow: 128000,
	maxTokens: 8192,
};

export { qwen };
```

### index.ts [lifted from minimal example](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/sdk/01-minimal.ts)

```ts
import {
  createAgentSession,
  SessionManager,
} from "@mariozechner/pi-coding-agent";
import { qwen } from "./model";

const { session } = await createAgentSession({
  model: qwen,
  thinkingLevel: "off",
  sessionManager: SessionManager.inMemory(),
});

// workaround for ollama
session.agent.getApiKey = () => "ollama";

session.subscribe((event) => {
  if (
    event.type === "message_update" &&
    event.assistantMessageEvent.type === "text_delta"
  ) {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await session.prompt("What files are in the current directory?");

console.log();
session.dispose();
```

## Run it

```bash
bun run index.ts
```

### Output (response may vary)
```bash
Here are the files in the current directory:

bun.lock        // Bun dependency lockfile
CLAUDE.md       // Documentation or notes about Claude
index.ts        // Main TypeScript entry point
model.ts        // TypeScript file for models
node_modules/   // npm dependencies
package.json    // Project configuration
README.md       // Project documentation
tsconfig.json   // TypeScript compiler options


The directory appears to contain a TypeScript project with standard files, along with documentation and dependency management files. Would you like me to show the contents of any specific file?
```

## Whoa, what just happened?

The agent used the Ollama API to query the Qwen model, which generated a response based on the prompt. The response was streamed back and printed to the console in real time.  The agent had access to the file system and could see the files in the current directory.  That's called using tools y'all.

## pi-coding-agent built-in tools

pi-coding-agent comes with tools grouped into two presets.

### codingTools
  - read
  - bash
  - edit
  - write

### readOnlyTools
  - grep
  - find
  - ls






