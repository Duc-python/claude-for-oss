# First 30 upstream PRs — checklist

Goal: build toward **100 merged PRs** into repos you **do not own** (Claude for Open Source — Active contributors track).

Account to use: **`Duc-python` only**.

Progress tracker:

```text
https://github.com/search?q=author%3ADuc-python+type%3Apr+is%3Amerged+-user%3ADuc-python&type=issues
```

## Rules (read once)

1. Comment on the issue before coding: `I'd like to take this.`
2. One focused PR per issue. No drive-by refactors.
3. Follow the repo `CONTRIBUTING.md` / PR template.
4. Prefer **merged** over opened. Unmerged PRs do not count.
5. Spread across repos. Do not farm one low-signal backlog forever.
6. Skip security-sensitive / ToS-gray tools for this portfolio.

Cadence: **2–4 merged PRs/day** → ~30 in 1–2 weeks if maintainers are responsive.

---

## Batch A — docs / contributor UX (days 1–3)

| # | Repo | Issue | Type | URL |
| --- | --- | --- | --- | --- |
| 1 | `stolla-labs/stolla` | Add contributor guide + PR template | docs | https://github.com/stolla-labs/stolla/issues/5 |
| 2 | `stolla-labs/stolla` | Align frontend CI install/caching with root lockfile | CI | https://github.com/stolla-labs/stolla/issues/6 |
| 3 | `stolla-labs/stolla` | Add frontend type-checking as required CI check | CI | https://github.com/stolla-labs/stolla/issues/13 |
| 4 | `huggingface/transformers` | Docs: `overflow_to_sample_mapping` missing | docs | https://github.com/huggingface/transformers/issues/9059 |
| 5 | `huangyuhenghedy-max/robin-open` | Improve Windows/macOS quickstart verification | docs | https://github.com/huangyuhenghedy-max/robin-open/issues/4 |
| 6 | `pytorch/pytorch` | Unify naming in dynamo `object_protocol.py` | rename | https://github.com/pytorch/pytorch/issues/190702 |

> Large repos (#4, #6) may take longer to merge. Start the PR, then continue Batch B while waiting.

## Batch B — accessibility / UI polish (days 2–5)

| # | Repo | Issue | Type | URL |
| --- | --- | --- | --- | --- |
| 7 | `stolla-labs/stolla` | Skip link + main landmarks | a11y | https://github.com/stolla-labs/stolla/issues/33 |
| 8 | `stolla-labs/stolla` | Accessible labels on governance forms | a11y | https://github.com/stolla-labs/stolla/issues/34 |
| 9 | `stolla-labs/stolla` | Focus-visible styles on nav/actions | a11y | https://github.com/stolla-labs/stolla/issues/27 |
| 10 | `stolla-labs/stolla` | Full-width vote actions on mobile | UI | https://github.com/stolla-labs/stolla/issues/32 |
| 11 | `stolla-labs/stolla` | Fix mobile header / horizontal overflow | UI | https://github.com/stolla-labs/stolla/issues/2 |
| 12 | `stolla-labs/stolla` | Proposal form usable at 320px | UI | https://github.com/stolla-labs/stolla/issues/24 |
| 13 | `stolla-labs/stolla` | Prevent overflow from long IDs/addresses | UI | https://github.com/stolla-labs/stolla/issues/21 |

Cap yourself at **~8 PRs** in the same org unless merges are fast — then diversify.

## Batch C — small product fixes (days 4–8)

| # | Repo | Issue | Type | URL |
| --- | --- | --- | --- | --- |
| 14 | `stolla-labs/stolla` | Retryable RPC error on proposal list | UX | https://github.com/stolla-labs/stolla/issues/28 |
| 15 | `stolla-labs/stolla` | Retryable RPC error on community page | UX | https://github.com/stolla-labs/stolla/issues/35 |
| 16 | `stolla-labs/stolla` | Handle malformed/unknown proposal IDs | bug | https://github.com/stolla-labs/stolla/issues/26 |
| 17 | `DefNotArham/realtime-chatrooms` | Add invite links | feature | https://github.com/DefNotArham/realtime-chatrooms/issues/41 |
| 18 | `OrangePeachPink/sprout` | Rename `honest-empty` → `calm-empty` in tests | rename | https://github.com/OrangePeachPink/sprout/issues/1385 |
| 19 | `alimaandev/Friday` | Add `persist_async` to LongTermMemory | code | https://github.com/alimaandev/Friday/issues/18 |
| 20 | `sumamovva/probeagent` | Live progress + elapsed time during scan | UX | https://github.com/sumamovva/probeagent/issues/16 |

## Batch D — content / corpus style (days 5–10, optional filler)

Use only if Batches A–C stall. Still real merges, but **do not** make this your whole portfolio.

| # | Repo | Issue | Type | URL |
| --- | --- | --- | --- | --- |
| 21 | `open-fiction-corpus/open-fiction-corpus` | Pride and Prejudice backlog | content | https://github.com/open-fiction-corpus/open-fiction-corpus/issues/18 |
| 22 | `open-fiction-corpus/open-fiction-corpus` | Jane Eyre backlog | content | https://github.com/open-fiction-corpus/open-fiction-corpus/issues/19 |
| 23 | `open-fiction-corpus/open-fiction-corpus` | Dracula backlog | content | https://github.com/open-fiction-corpus/open-fiction-corpus/issues/21 |
| 24 | `open-fiction-corpus/open-fiction-corpus` | Great Gatsby backlog | content | https://github.com/open-fiction-corpus/open-fiction-corpus/issues/22 |
| 25 | `open-fiction-corpus/open-fiction-corpus` | The Moonstone backlog | content | https://github.com/open-fiction-corpus/open-fiction-corpus/issues/23 |

## Batch E — always-available playbook (fill to #30)

When a listed issue is taken/closed, replace with a fresh one:

```bash
# docs / first issues updated recently
gh search issues --label "good first issue" --state open --limit 20 "docs OR documentation OR typo OR readme"

# TypeScript / JS UI polish
gh search issues --label "good first issue" --language TypeScript --state open --limit 20

# Python small fixes
gh search issues --label "good first issue" --language Python --state open --limit 20
```

Or browse:

- https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+no%3Aassignee
- https://goodfirstissue.dev/

Pick issues that are:

| Prefer | Avoid |
| --- | --- |
| Clear acceptance criteria | Vague “improve performance” |
| Touches ≤3 files | Huge refactors |
| Has recent maintainer activity | Dead repos (no commits / replies in months) |
| Labels: `good first issue`, `documentation`, `bug` | Unlabeled mega-features |

Slots **26–30**: use the playbook above (write the issue URL into your own notes as you claim them).

---

## Daily loop

```text
1. Pick next open row in this list
2. Comment on the issue
3. Fork → branch → minimal fix → tests/docs if required
4. Open PR linking `Fixes #N`
5. Respond to review within 24h
6. When merged, check the progress search URL
```

## After 30

1. Recount external merged PRs.
2. Keep the same loop until **≥100**.
3. Then apply: https://claude.com/open-source-max  
   Attach the search URL + 5–10 best PRs (docs/CI/bugfix in active projects beat pure content dumps).

## Honesty check

This checklist accelerates **eligibility evidence**. It does not guarantee Anthropic approval. Quality and diversity of contributions matter.
