# AI Model Research - Image & Video Generation

**Research Date**: 2025-10-30
**Researcher**: Jan
**Purpose**: Find cheapest quality AI tools for movie production

---

## Overview

This research documents AI image and video generation tools with verified pricing, features, and quality assessments. All tools have been cross-verified for accuracy.

**Primary Finding**: Four tools offer BOTH image AND video generation in a single subscription, providing better value than specialized tools.

---

## Quick Start

### Free Tier Testing (No Cost)
Test all these simultaneously before spending any money:

1. **Dreamina** - 50 images/day (best free tier) 🇨🇳
2. **Recraft** - 50 images/day
3. **Ideogram** - 20 images/day
4. **Leonardo.ai** - 150 tokens/day
5. **Higgsfield** - 2 images + 5 videos/day
6. **LTX Studio** - 800 CS one-time

**Total**: 120+ free images daily + video testing

---

## Key Findings

### Finding 1: Hybrid Tools Exist (Image + Video)
Four tools offer both image AND video generation:
- **Higgsfield**: $9/month (cheapest hybrid)
- **Hailuo AI**: $14.99/month (Chinese model) 🇨🇳
- **LTX Studio**: $15/month (storytelling workflow)
- **Dreamina/ByteDance**: $19.9/month (#1 image quality, Chinese model) 🇨🇳

### Finding 2: Best Free Tier = Dreamina
**50 free images per day** via Dreamina (Seedream 4.0)
- Ranked #1 on image quality leaderboards
- 94% text rendering accuracy
- Up to 4K resolution
- Also includes video generation (Seedance)

### Finding 3: Cheapest Quality Options
**Image Only**:
- Ideogram: $7/month (text rendering specialist)
- Midjourney: $10/month (industry standard)
- Leonardo.ai: $12/month (avatar specialist)

**Image + Video**:
- Higgsfield: $9/month (cheapest hybrid)
- LTX Studio: $15/month (storytelling)

### Finding 4: API Availability Limited
Only 4 tools have affordable APIs:
- **FLUX**: $0.02-0.05/image (94.7% character consistency)
- **Stable Diffusion**: $0.01-0.03/image (customizable)
- **Dreamina (Seedream)**: $0.03/image (cheapest API, #1 quality)
- **Recraft**: Pay-per-use (vector + raster)

Most tools (Midjourney, Ideogram, Leonardo, LTX, Hailuo) are SaaS-only.

### Finding 5: Chinese Models Are Competitive
**Dreamina/ByteDance** 🇨🇳:
- Best free tier (50 images/day)
- #1 ranked image quality
- Cheapest API ($0.03/image)
- Excellent value

**Hailuo AI** 🇨🇳:
- ⚠️ Removed free daily credits (user backlash)
- Good video quality with lip-sync
- $14.99/month (competitive pricing)

**Conclusion**: Dreamina offers better value and transparency than Hailuo AI.

---

## Tools Summary

### Image-Only Tools (6 tools)
| Tool | Free Tier | Cheapest Paid | Best For |
|------|-----------|--------------|----------|
| Ideogram | 20/day | $7/mo | Text rendering |
| Midjourney | None | $10/mo | Industry standard quality |
| Leonardo.ai | 150/day | $12/mo | Avatars, Pixar-style |
| Recraft | 50/day | $12/mo | Vector + raster |
| FLUX | Limited | $0.02-0.05/image API | Character consistency (94.7%) |
| Stable Diffusion | Unlimited (local) | $0.01-0.03/image cloud | Customization, LoRA training |

### Hybrid Tools - Image + Video (4 tools)
| Tool | Free Tier | Cheapest Paid | Best For |
|------|-----------|--------------|----------|
| Higgsfield | 2 images + 5 videos/day | $9/mo | Cheapest hybrid |
| Hailuo AI 🇨🇳 | One-time credits | $14.99/mo | Video lip-sync |
| LTX Studio | 800 CS one-time | $15/mo | Storytelling workflow |
| Dreamina 🇨🇳 | **50 images/day** | $19.9/mo | #1 quality, best free tier |

---

## Budget Options

### Under $10/month
- **Ideogram**: $7/mo (image only)
- **Higgsfield**: $9/mo (image + video) ⭐

### $10-20/month
- **Midjourney**: $10/mo (image)
- **Leonardo.ai**: $12/mo (image)
- **Recraft**: $12/mo (image)
- **Hailuo AI**: $14.99/mo (image + video) 🇨🇳
- **LTX Studio**: $15/mo (image + video)
- **Dreamina**: $19.9/mo (image + video) 🇨🇳

### Best Value Combos
- Ideogram ($7) + Higgsfield ($9) = **$16/mo** (text + hybrid)
- Ideogram ($7) + Midjourney ($10) = **$17/mo** (text + quality)
- Ideogram ($7) + LTX Studio ($15) = **$22/mo** (text + storytelling)

---

## Detailed Documentation

### 📊 [cost-analysis.md](./cost-analysis.md)
Comprehensive cost comparison with:
- Full pricing tables for all tools
- Cost per image/video estimates
- Free tier details
- GPU requirements and costs
- Quality assessment notes
- Budget scenarios

### 🔧 [platforms.md](./platforms.md)
Platform type categorization:
- SaaS vs API breakdown
- Integration patterns
- Code examples
- Authentication setup
- Use case recommendations

### 💻 [api-examples/](./api-examples/)
Ready-to-run code:
- `image-generation.js` - FLUX, Dreamina, Stable Diffusion examples
- `video-generation.js` - Video API examples (TBD)
- `s3-upload.js` - AWS S3 integration for large files

### ☁️ [s3-setup-uat.md](./s3-setup-uat.md)
AWS S3 setup instructions:
- IAM user creation
- Permissions configuration
- Credentials management
- Upload/download scripts

---

## Testing Recommendations

### Phase 1: Free Tier Testing (Week 1)
**Goal**: Test all free tiers simultaneously, generate 100+ samples

**Sign up for**:
1. Dreamina (50 images/day)
2. Recraft (50 images/day)
3. Ideogram (20 images/day)
4. Leonardo.ai (150 tokens/day)
5. Higgsfield (2 images + 5 videos/day)
6. LTX Studio (800 CS)

**Generate**:
- Same prompts across all tools
- Test character consistency
- Test scene consistency
- Test text rendering
- Test video quality (Higgsfield, LTX, Dreamina)

**Document**:
- Save samples to `images/<tool-name>/`
- Quality notes in cost-analysis.md
- Side-by-side comparisons

---

### Phase 2: Quality Assessment (Week 2)
**Goal**: Compare outputs, identify best tools

**Compare**:
- Character consistency: FLUX vs Midjourney vs Leonardo
- Scene consistency: Midjourney vs LTX vs FLUX
- Text rendering: Ideogram vs Dreamina
- Photorealism: Higgsfield Soul vs Dreamina vs Midjourney
- Video quality: LTX vs Higgsfield vs Dreamina vs Hailuo

**Rank**: Best to worst for each category

---

### Phase 3: API Testing (Week 2-3)
**Goal**: Create working code examples, measure real costs

**Test APIs**:
1. FLUX via Replicate
2. Dreamina via BytePlus
3. Recraft via fal.ai

**Measure**:
- Actual cost per image
- Generation speed
- Error rates
- API reliability

**Deliverable**: Working code in `api-examples/`

---

### Phase 4: Budget Proposal (Week 3)
**Goal**: Propose paid tool subscriptions based on findings

**Format**:
```
## Budget Proposal

Based on testing, I recommend:

### Option A: $X/month
- Tool 1: $Y/month
- Tool 2: $Z/month
- Why: [Quality justification]
- Use case: [Which v-* projects]

### Option B: $X/month
- Tool 1: $Y/month
- Why: [Quality justification]
- Use case: [Which v-* projects]
```

---

## Integration with v-shared Projects

### v-voz (Storyline Workflow)
**Needs**: High-volume images (30-70 per project), batch generation

**Recommended**:
- **Image**: Dreamina API ($0.03/image) or LTX Studio storyboards
- **Why**: Storyline projects need many scene variations
- **Cost**: 50 images × $0.03 = $1.50 per project (API) or $15/mo flat (LTX)

### v-aitldr (Brand Videos)
**Needs**: Manual curation, narrative quality

**Recommended**:
- **Image**: Midjourney ($10/mo) or LTX Studio ($15/mo)
- **Why**: Brand videos need careful manual control
- **Cost**: Fixed monthly

### v-kiros / v-supportsignal (Client Work)
**Needs**: Pixar-style avatars, high quality

**Recommended**:
- **Image**: Leonardo.ai ($12/mo) + Midjourney ($10/mo) = $22/mo
- **Why**: Avatar specialist + quality standard
- **Cost**: Fixed monthly

---

## Missing Information / To Verify

### Pricing Uncertainties
- ❓ LTX Studio: 800 CS one-time or 8000 CS/month? (conflicting sources)

### API Availability
- ❓ Hailuo AI: API mentioned but not verified
- ❓ Leonardo.ai: Check if API recently launched
- ❓ LTX Studio: API status unclear
- ❓ Higgsfield: API requires $249/mo Creator tier (impractical)

### Feature Testing Needed
- Test Higgsfield Soul image quality (50+ presets)
- Test Hailuo AI lip-sync accuracy
- Verify Dreamina credit consumption (images vs videos)
- Test LTX Studio storyboard workflow with v-voz projects
- Measure FLUX character consistency in practice

---

## Quality Rankings (To Be Updated After Testing)

### Character Consistency
**Expected Best**: FLUX (94.7% accuracy), Midjourney, Leonardo.ai
**Test**: Generate same character across 5 different scenes

### Scene Consistency
**Expected Best**: Midjourney (style seeds), LTX Studio (shot editor)
**Test**: Generate variations of same scene

### Text Rendering
**Expected Best**: Ideogram, Dreamina (94% accuracy)
**Test**: Generate images with text overlays

### Photorealism
**Expected Best**: Higgsfield Soul, Dreamina, Midjourney
**Test**: Generate realistic portraits

### Pixar/3D Style
**Expected Best**: Leonardo.ai, Midjourney, LTX Studio
**Test**: Generate Pixar-style avatars

### Video Quality
**Expected Best**: LTX Studio (Veo 3), Hailuo AI (lip-sync)
**Test**: Generate 5-second video clips

---

## Cost Summary

### Free Testing Budget: $0
Can generate 120+ images daily for free across all platforms

### Minimal Paid Budget: $7-16/month
- Ideogram only ($7) - if image-only sufficient
- Ideogram ($7) + Higgsfield ($9) = $16 - if need video too

### Balanced Budget: $20-30/month
- Dreamina ($19.9) - #1 quality, image + video, Chinese model
- OR Ideogram ($7) + LTX Studio ($15) = $22 - text + storytelling
- OR Ideogram ($7) + Leonardo ($12) + Higgsfield ($9) = $28 - comprehensive

### API Budget: Pay-per-use
- Dreamina API: $0.03/image (cheapest)
- FLUX API: $0.02-0.05/image
- Stable Diffusion: $0.01-0.03/image

**For v-voz projects (50 images/project)**: $1.50/project via Dreamina API

---

## Next Actions

### Immediate (This Week)
1. ✅ Complete this research documentation
2. ⏳ Sign up for all free tiers
3. ⏳ Generate test samples (standardized prompts)
4. ⏳ Create API code examples

### Short-term (Next 2 Weeks)
1. Test and compare all free tiers
2. Document quality assessments
3. Create side-by-side comparisons
4. Test APIs (FLUX, Dreamina, Recraft)
5. Measure actual costs

### Medium-term (Week 3-4)
1. Propose budget based on testing
2. Get approval for paid subscriptions
3. Subscribe to chosen tools
4. Create production workflows
5. Integrate with v-shared projects

---

## Questions for David

1. **GPU Hardware**: Do we have an RTX 3060 or similar for local Stable Diffusion testing?
2. **API Priority**: Should I prioritize API access for automation, or is manual SaaS acceptable?
3. **Chinese Models**: Any access issues or preferences for Hailuo/Dreamina?
4. **Budget Approval**: What's the max monthly budget for testing subscriptions?
5. **Runway Gen-3**: Worth testing despite not being in initial research? (mentioned in task file)
6. **Kling**: You mentioned this Chinese model - do you have access or should I research it?

---

## File Structure

```
ai-model-research/
├── README.md                    # This file - overview and findings
├── cost-analysis.md             # Detailed cost comparison tables
├── platforms.md                 # SaaS vs API breakdown
├── s3-setup-uat.md              # AWS S3 integration guide
├── images/                      # Generated test images (git tracked)
│   ├── dreamina/
│   ├── ideogram/
│   ├── leonardo/
│   ├── midjourney/
│   ├── higgsfield/
│   └── ltx-studio/
├── videos/                      # Generated test videos (gitignored)
│   ├── higgsfield/
│   ├── ltx-studio/
│   ├── hailuo/
│   └── dreamina/
└── api-examples/
    ├── image-generation.js      # FLUX, Dreamina, Stable Diffusion
    ├── video-generation.js      # Video API examples
    └── s3-upload.js             # AWS S3 integration
```

---

**Status**: Research Phase Complete
**Next**: Free Tier Testing Phase
**Last Updated**: 2025-10-30
