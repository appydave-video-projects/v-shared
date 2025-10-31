# AI Model Research - Quick Start Guide

**Last Updated**: 2025-10-30
**For**: David (high-level summary)
**Full Details**: See README.md, cost-analysis.md, platforms.md

---

## TL;DR - What You Need to Know

Jan researched **10 AI image/video generation tools** to find the **cheapest quality options** for movie production.

**Key Finding**: Four tools offer BOTH image AND video in one subscription (better value than separate tools).

---

## The Winners (Recommended for Testing)

### 🥇 Best Free Option: Dreamina (Chinese) 🇨🇳
- **Free**: 50 images/day (best free tier anywhere)
- **Quality**: #1 ranked on image quality leaderboards
- **Paid**: $19.9/month or $0.03/image API
- **Why**: Best free tier + API available + top quality
- **Test first**: Yes, heavily

### 🥈 Cheapest Hybrid: Higgsfield
- **Free**: 2 images + 5 videos/day
- **Paid**: $9/month (cheapest image+video combo)
- **Why**: Lowest entry price for both image and video
- **Test**: Yes

### 🥉 Best for Storyline Workflow: LTX Studio
- **Free**: 800 CS one-time (unclear if monthly)
- **Paid**: $15/month
- **Why**: Storyboard-first workflow matches v-voz projects perfectly
- **Test**: Yes, matches our workflow

---

## Quick Comparison Table

| Tool | Free Tier | Cheapest Paid | Image + Video? | API? | Priority |
|------|-----------|---------------|----------------|------|----------|
| **Dreamina** 🇨🇳 | 50 images/day | $19.9/mo or $0.03/image | ✅ Both | ✅ Yes | ⭐⭐⭐ HIGH |
| **Higgsfield** | 2 images + 5 videos/day | $9/mo | ✅ Both | Only $249/mo tier | ⭐⭐ MEDIUM |
| **LTX Studio** | 800 CS one-time | $15/mo | ✅ Both | Unclear | ⭐⭐ MEDIUM |
| **Ideogram** | 20 images/day | $7/mo | ❌ Image only | ❌ No | ⭐ LOW |
| **Midjourney** | None | $10/mo | ❌ Image only | ❌ No | ⭐ REFERENCE |
| **Leonardo.ai** | 150/day | $12/mo | ❌ Image only | ❌ No | ⭐ AVATARS |
| **FLUX** | Limited | $0.02-0.05/image | ❌ Image only | ✅ Yes | ⭐⭐ API TESTING |

---

## Cost Summary

### Testing Budget: $0
Can test **120+ free images/day** across all platforms:
- Dreamina: 50/day ⭐
- Recraft: 50/day
- Ideogram: 20/day
- Leonardo: 150 tokens/day
- Higgsfield: 2 images + 5 videos/day

**Total**: Enough to generate 100+ sample images for comparison without spending anything.

---

### Minimal Paid Budget: $7-16/month
- **$7/mo**: Ideogram only (if image-only sufficient)
- **$16/mo**: Ideogram ($7) + Higgsfield ($9) = text specialist + hybrid

---

### Recommended Budget: $20-30/month
**Option A**: Dreamina only ($19.9/mo)
- #1 quality
- Image + Video
- 🇨🇳 Chinese model

**Option B**: Ideogram + LTX Studio ($7 + $15 = $22/mo)
- Text rendering + storytelling workflow
- Matches v-voz projects

**Option C**: Ideogram + Leonardo + Higgsfield ($7 + $12 + $9 = $28/mo)
- Text + avatars + hybrid video
- Covers all use cases

---

## API vs SaaS - What's the Difference?

### SaaS (Web-Based Tools)
**Examples**: Midjourney, Ideogram, Leonardo.ai, LTX Studio
**How it works**: Log in to website, type prompt, download manually
**Pros**: Easy to use, no coding
**Cons**: Manual process, not scalable
**Best for**: Testing, low-volume projects (<50 images/month)

---

### API (Programmatic)
**Examples**: FLUX, Dreamina, Stable Diffusion
**How it works**: Script sends request, downloads automatically
**Pros**: Fully automated, scalable
**Cons**: Requires coding, pay-per-use can be unpredictable
**Best for**: High-volume projects (>100 images/month), batch processing

---

### Hybrid (Both SaaS + API)
**Examples**: Dreamina, Recraft
**How it works**: Test manually in web UI, then use API for production
**Best for**: v-voz storyline projects (test prompts manually, generate batches via API)

---

## Use Case Recommendations

### For v-voz (Storyline Projects - High Volume)
**Need**: 30-70 images per project, batch generation
**Recommended**: Dreamina API ($0.03/image) or LTX Studio ($15/mo)
**Why**: Storyline projects need many scene variations
**Cost**: 50 images × $0.03 = $1.50/project (API) or $15/mo flat (LTX)

---

### For v-aitldr (Brand Videos - Manual Quality Control)
**Need**: Careful curation, narrative storytelling
**Recommended**: LTX Studio ($15/mo) or Midjourney ($10/mo)
**Why**: Brand videos need manual iteration
**Cost**: Fixed $10-15/month

---

### For v-kiros / v-supportsignal (Client Work - Pixar Avatars)
**Need**: High quality, Pixar-style avatars, client approval
**Recommended**: Leonardo.ai ($12/mo) + Midjourney ($10/mo) = $22/mo
**Why**: Avatar specialist + quality standard
**Cost**: Fixed $22/month

---

## Quality Rankings (Expected - To Be Verified)

### Character Consistency
**Best**: FLUX (94.7%), Midjourney, Leonardo.ai

### Scene Consistency
**Best**: Midjourney, LTX Studio, FLUX

### Text Rendering
**Best**: Ideogram, Dreamina (94% accuracy)

### Photorealism
**Best**: Higgsfield Soul, Dreamina, Midjourney

### Pixar/3D Style
**Best**: Leonardo.ai, Midjourney, LTX Studio

### Video Quality
**Best**: LTX Studio (Veo 3), Hailuo AI (lip-sync)

---

## Next Steps (Jan's Work)

### Phase 1: Free Testing (This Week)
- [ ] Sign up for all free tiers
- [ ] Generate 100+ test images with same prompts
- [ ] Compare quality side-by-side
- [ ] Document findings

### Phase 2: API Testing (Next 2 Weeks)
- [ ] Test FLUX via Replicate
- [ ] Test Dreamina API
- [ ] Create working code examples
- [ ] Measure actual costs

### Phase 3: Budget Proposal (Week 3)
- [ ] Propose which tools to subscribe to
- [ ] Justify based on quality vs. cost
- [ ] Get your approval
- [ ] Subscribe and integrate into workflow

---

## Questions for David?

1. **GPU**: Do we have RTX 3060 for local Stable Diffusion testing?
2. **API Priority**: Automate via API or manual SaaS acceptable?
3. **Chinese Models**: Any access/preference issues with Dreamina/Hailuo?
4. **Max Budget**: What's the max monthly budget for subscriptions?
5. **Runway Gen-3**: Worth testing despite higher cost?
6. **Kling**: You mentioned this Chinese model - have access?

---

## Where to Find Details

- **README.md**: Overview and key findings
- **cost-analysis.md**: Detailed cost tables, GPU requirements, quality notes
- **platforms.md**: SaaS vs API breakdown, code examples, integration patterns
- **s3-setup-uat.md**: AWS S3 setup for large file storage
- **api-examples/**: Ready-to-run JavaScript code (needs API keys)

---

## Bottom Line

**Start with free tiers** (120+ images/day available for $0)
**Best value**: Dreamina (50 free/day + $0.03 API + #1 quality)
**If need manual workflow**: LTX Studio ($15/mo, matches v-voz workflow)
**If need API automation**: Dreamina API ($0.03/image, cheapest + best quality)

Jan will test all free tiers this week, then propose a budget based on actual quality comparison.

---

**Status**: Research complete, testing phase starting
**Next Update**: After free tier testing (1-2 weeks)
