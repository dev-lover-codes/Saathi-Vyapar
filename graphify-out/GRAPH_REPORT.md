# Graph Report - saathi-vyapar  (2026-09-06)

## Corpus Check
- 44 files · ~29,904 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 238 nodes · 321 edges · 21 communities (13 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2837d44e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- business-guide/generate/route.ts
- plan/generate/route.ts
- package.json
- conversationOrchestrator.ts
- VoiceOnboardingModal.tsx
- compilerOptions
- layout.tsx
- README.md
- dependencies
- devDependencies
- parse/route.ts
- eslint.config.mjs
- postcss.config.mjs
- vercel.json
- Supabase Migrations
- facilitator/page.tsx
- AGENTS.md
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `handleIncomingMessage()` - 11 edges
3. `matchSchemes()` - 10 edges
4. `supabaseServer` - 10 edges
5. `generateFinancialSummary()` - 9 edges
6. `react` - 8 edges
7. `YojanaKendraContent()` - 6 edges
8. `VoiceOnboardingModal()` - 6 edges
9. `supabaseClient` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `loadData()` --calls--> `matchSchemes()`  [EXTRACTED]
  src/app/dashboard/schemes/page.tsx → src/lib/engines/schemeMatcher.ts
- `handleRecheck()` --calls--> `matchSchemes()`  [EXTRACTED]
  src/app/dashboard/schemes/page.tsx → src/lib/engines/schemeMatcher.ts
- `PastGuideItem` --references--> `RoadmapStageItem`  [EXTRACTED]
  src/app/dashboard/business-guide/page.tsx → src/app/api/business-guide/generate/route.ts
- `POST()` --calls--> `generateFinancialSummary()`  [EXTRACTED]
  src/app/api/onboarding/complete/route.ts → src/lib/engines/financialEngine.ts
- `POST()` --calls--> `matchSchemes()`  [EXTRACTED]
  src/app/api/onboarding/complete/route.ts → src/lib/engines/schemeMatcher.ts

## Import Cycles
- None detected.

## Communities (21 total, 6 thin omitted)

### Community 0 - "business-guide/generate/route.ts"
Cohesion: 0.10
Nodes (17): @supabase/supabase-js, tesseract.js, zod, FIXED_STAGES, generateFallbackRoadmap(), GenerateGuideSchema, getGeminiClient(), POST() (+9 more)

### Community 1 - "plan/generate/route.ts"
Cohesion: 0.12
Nodes (24): vitest, OnboardingCompleteSchema, POST(), GeneratePlanSchema, getGeminiClient(), LANGUAGE_NAMES, POST(), getSchemeDetails() (+16 more)

### Community 2 - "package.json"
Cohesion: 0.09
Nodes (21): name, private, scripts, build, dev, lint, start, version (+13 more)

### Community 3 - "conversationOrchestrator.ts"
Cohesion: 0.15
Nodes (17): POST(), twimlResponse(), getWhatsAppMediaUrl(), POST(), processWhatsAppMessages(), sendWhatsAppMessage(), WhatsAppMessage, WhatsAppWebhookBody (+9 more)

### Community 4 - "VoiceOnboardingModal.tsx"
Cohesion: 0.10
Nodes (16): react, RoadmapStageItem, BusinessGuidePage(), PastGuideItem, PRESET_CHALLENGES, STAGE_ICONS, Step, OnboardingPage() (+8 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "layout.tsx"
Cohesion: 0.15
Nodes (10): nextConfig, next, geistMono, geistSans, metadata, LoginForm(), formatPhone(), handleSendOtp() (+2 more)

### Community 7 - "README.md"
Cohesion: 0.20
Nodes (9): 1. Meta WhatsApp Webhook, 2. Twilio SMS Webhook, 🏗️ Architecture Overview, 🗄️ Database Setup & Migrations, 🔄 Keepalive Endpoint (UptimeRobot), 🧪 Local Testing & Development, 🔑 Required Environment Variables, 🚀 Vercel Deployment (+1 more)

### Community 8 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @google/genai, groq-sdk, next, react, react-dom, @supabase/ssr, @supabase/supabase-js (+3 more)

### Community 9 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+3 more)

### Community 10 - "parse/route.ts"
Cohesion: 0.28
Nodes (6): @google/genai, fallbackParser(), getGeminiClient(), ParsedResult, ParseRequestBody, POST()

### Community 15 - "Supabase Migrations"
Cohesion: 0.22
Nodes (8): Migration Files, Notes, Option 1: Supabase CLI (Recommended), Option 2: SQL Editor (Dashboard), Option 3: psql / direct connection, Running Migrations, Seed Data, Supabase Migrations

### Community 16 - "facilitator/page.tsx"
Cohesion: 0.29
Nodes (4): AddEntrepreneurModal(), Props, dynamic, EntrepreneurViewItem

## Knowledge Gaps
- **114 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 143 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `VoiceOnboardingModal.tsx` to `facilitator/page.tsx`, `plan/generate/route.ts`, `package.json`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `@supabase/supabase-js` connect `business-guide/generate/route.ts` to `package.json`, `VoiceOnboardingModal.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `@google/genai` connect `parse/route.ts` to `business-guide/generate/route.ts`, `plan/generate/route.ts`, `package.json`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _114 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `business-guide/generate/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._
- **Should `plan/generate/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12310606060606061 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._