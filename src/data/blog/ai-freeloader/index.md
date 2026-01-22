---
title: "I am an AI Freeloader"
date: 2026-01-22
tags: ["code", "ai"]
excerpt: "and I dont feel bad about it at all."
---

## The landscape just to start

| Thing           | Monthly |
| --------------- | ------- |
| Cursor          | $40     |
| ChatGPT+        | $20     |
| Gemini          | $20     |
| Claude          | $20     |
| Google AI Pro   | $20     |
| NEW SHINY THING | $20     |
| ANOTHER THING   | $20     |

I am reminded of the glut of steaming(+) services. Where cutting cable ending up seeming like a bad idea if you just wanted to watch the shows you loved. I have neither the time or money to waste on all of these.

## ...but I still want to use and learn all of them

So here's what I do. I use all of their free tiers, evaluation models, loss leaders, etc. And while that sounds like a mess of context switching, and it can be, I have found it is entirely manageable with some careful planning.

## A system for the chaos

I use two things to keep everythng in sync:

1. The Memory Bank prompt.
2. A script to sync all the environments.

### The Memory Bank

I have a prompt that I use in every project. It is a markdown file that I keep in the project directory under `prompts/instructions.md`. It changes now and then, but unless I add something that turns out to be a real game changer I don't ever really update projects using older version. I just start fresh with the new prompt in new projects. Here is my latest revision of this prompt: [Memory Bank](https://github.com/joemaddalone/hactar/blob/main/prompts/instructions.md)

### The Sync Script

I use a script to sync all the environments. I am usually working in Node so it's a .mjs script that I keep in the project directory under `scripts/sync-ai.mjs`. It could easily be ported to a shell script. Here is my latest revision of this script: [Sync Script](https://github.com/joemaddalone/hactar/blob/main/scripts/sync-ai.mjs). All it is doing is sym linking the memory bank prompt into the various AI environments. Claude wants `CLAUDE.MD`, Cursor wants `.cursor/instructions.md`, etc.

## Credit

I invented neither of these ideas. I don't have a particular source to reference, i think the memory bank was a Cline thing at some point and the sync script is based on someone else's idea I saw on Reddit. I just put them together in a way that works for me and have refined them for a while now.

## The Workflow

1. Create a new project directory.
2. Copy the `prompts/instructions.md` and `scripts/sync-ai.mjs` files into the new project directory.
3. Run `node scripts/sync-ai.mjs` to sync all the environments.
4. Start using the whatever CLI or IDE you want to use.

## The snags

Sometimes the AI's need to be reminded of the instructions. I usually just start a new chat session with @instructions.md (or whatever the equivalent is for the tool). And after a completing a task if the AI has not update the memory bank I simply type "update memory bank" and it will update it. When I hit a limit the next AI will pick up where the previous one left off.

## The cost

This is all free. I am not paying for any of these services. I am using the free tiers, evaluation models, loss leaders, etc. and the script + memory bank keeps them all on the same page.

## The results

I am able to use all of these tools and get a good sense of what they can do. I am not locked into any one ecosystem. I can switch between them as needed. And I am not paying for any of them. It is a win win win.
