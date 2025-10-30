# AI Platform Categorization: SaaS vs API

**Created**: 2025-10-30
**Purpose**: Platform type categorization for integration and automation planning

---

## Quick Reference

| Category | Count | Tools |
|----------|-------|-------|
| **SaaS Only** | 5 | Midjourney, Ideogram, Leonardo.ai, LTX Studio, Hailuo AI |
| **API Available** | 4 | FLUX, Stable Diffusion, Dreamina (Seedream), Recraft |
| **API (High Cost)** | 1 | Higgsfield (Creator $249/mo) |

---

## Platform Type Breakdown

### SaaS-Only Platforms (No Affordable API)

#### Midjourney
- **Access**: Discord bot + Web UI
- **Interface**: Command-based (Discord) or click-based (web)
- **Automation**: No official API
- **Workarounds**: Unofficial Discord bot libraries (not recommended)
- **Best For**: Manual high-quality generation
- **Cost**: $10-60/month
- **Integration**: Manual download only

#### Ideogram
- **Access**: Web app
- **Interface**: Browser-based with remix functionality
- **Automation**: None
- **Best For**: Text rendering, typography
- **Cost**: 20 free/day, $7-60/month
- **Integration**: Manual download only

#### Leonardo.ai
- **Access**: Web interface + Mobile app
- **Interface**: Browser and iOS/Android
- **Automation**: No clear public API
- **Note**: Check if API recently launched
- **Best For**: Avatar creation, high-volume manual generation
- **Cost**: 150 free tokens/day, $12-60/month
- **Integration**: Manual download only

#### LTX Studio
- **Access**: Web-based, desktop-optimized
- **Interface**: Storyboard editor with shot-by-shot control
- **Automation**: API status unclear
- **Best For**: Narrative storytelling, v-voz workflow
- **Cost**: 800 CS free (one-time?), $15-125/month
- **Integration**: Manual export, PDF pitch decks

#### Hailuo AI 🇨🇳
- **Access**: Web + Mobile app
- **Interface**: Browser and mobile-friendly
- **Automation**: API mentioned but unverified
- **Note**: Need to verify which tiers include API
- **Best For**: Video with lip-sync, cinematic clips
- **Cost**: One-time free credits, $14.99-119.99/month
- **Integration**: Manual download (API unclear)

---

### API-Available Platforms

#### FLUX
- **API Providers**: Replicate, fal.ai, Together AI, others
- **Access**: REST API via multiple providers
- **Automation**: Full programmatic control
- **Best For**: Character consistency (94.7%), batch processing
- **Cost**: $0.02-0.05 per image (pay-per-use)
- **Integration**: Direct API calls

**Example API Endpoints**:
- Replicate: `https://api.replicate.com/v1/predictions`
- fal.ai: `https://fal.run/fal-ai/flux-kontext`
- Together AI: `https://api.together.xyz/v1/images/generations`

**Models**:
- FLUX.1 Kontext (character consistency)
- FLUX.1 Dev (general purpose)
- FLUX.1 Schnell (fast generation)

#### Stable Diffusion
- **API Providers**: Stability AI (official), Replicate, HuggingFace, RunPod, AWS SageMaker
- **Access**: REST API or local installation
- **Automation**: Full control (API or local)
- **Best For**: Custom ization, LoRA training, local deployment
- **Cost**: Free (local) or $0.01-0.03 per image (cloud)
- **Integration**: API calls or local Python scripts

**Popular Providers**:
- Stability AI: Official API
- Replicate: `stability-ai/sdxl`
- HuggingFace: Inference API
- Local: Automatic1111, ComfyUI

#### Dreamina/ByteDance (Seedream 4.0) 🇨🇳
- **API Provider**: BytePlus (official ByteDance API)
- **Access**: REST API + Web interface
- **Automation**: Full programmatic control
- **Best For**: #1 image quality, text rendering, batch generation
- **Cost**: **$0.03 per image** (API) or $19.9-69.9/month (SaaS)
- **Free Tier**: 150 credits/day (~50 images) via SaaS
- **Integration**: API calls OR manual download

**API Details**:
- Official: BytePlus API at $0.03/image
- 200 free images for new API users
- Supports text-to-image and image editing
- Up to 4K resolution

**Seedream 4.0 Features**:
- #1 ranked on text-to-image leaderboards
- 94% text rendering accuracy (English + Chinese)
- 2K images in 1.8 seconds

#### Recraft
- **API Provider**: fal.ai (partner API)
- **Access**: Web UI + API
- **Automation**: Both manual and programmatic
- **Best For**: Vector + raster, brand consistency
- **Cost**: 50 free/day, $12/month (SaaS) or pay-per-use (API)
- **Integration**: Web UI for manual, API for automation

**API Details**:
- Available via fal.ai: `fal.ai/models/recraft-v3`
- Supports both vector and raster generation
- 1 credit per raster, 2 credits per vector

---

### API Available (High Cost Tier)

#### Higgsfield
- **API Provider**: Higgsfield (Creator tier only)
- **Access**: Web + Mobile (SaaS), API at Creator tier
- **Automation**: Requires $249/month Creator subscription
- **Best For**: Cinematic video + Soul images (hybrid)
- **Cost**: $9-29.4/month (SaaS only), $249/month (with API)
- **Integration**: Manual download (low tiers) or API (Creator)

**Note**: API access at $249/month makes it impractical for budget-conscious projects. Use SaaS tier ($9/month) for manual generation.

---

## Integration Patterns

### Pattern 1: Manual SaaS Workflow
**Tools**: Midjourney, Ideogram, Leonardo.ai, LTX Studio

**Workflow**:
```
1. Generate in SaaS web UI
2. Download images/videos manually
3. Upload to project folder (v-shared)
4. Commit to git (images) or gitignore (videos)
```

**Pros**:
- Easy to use, no coding required
- Good for low-volume projects
- Manual quality control

**Cons**:
- Not scalable
- Manual process (time-consuming)
- No automation possible

**Best For**: Testing, prototyping, <50 generations/month

---

### Pattern 2: API Automation
**Tools**: FLUX, Stable Diffusion, Dreamina, Recraft

**Workflow**:
```
1. Script sends API request with prompt
2. API returns image URL or base64 data
3. Script downloads and saves to project folder
4. Automated git commit or S3 upload
```

**Pros**:
- Fully automated
- Scalable for high volume
- Can integrate with existing pipelines

**Cons**:
- Requires coding (JavaScript/Python)
- Need to manage API keys
- Pay-per-use costs can be unpredictable

**Best For**: High-volume projects (>100 generations/month), batch processing

**Example** (see `api-examples/image-generation.js`):
```javascript
// FLUX via Replicate API
const response = await replicate.run(
  "black-forest-labs/flux-kontext",
  { input: { prompt: "..." } }
);
```

---

### Pattern 3: Hybrid (Manual Testing + API Production)
**Tools**: Dreamina (has both), Recraft (has both)

**Workflow**:
```
1. Test prompts manually in SaaS UI
2. Refine prompts based on results
3. Use refined prompts in API for batch generation
4. Manual review + automated processing
```

**Pros**:
- Best of both worlds
- Quality control + automation
- Flexible workflow

**Cons**:
- More complex setup
- Need to learn both interfaces

**Best For**: Projects requiring quality + volume (v-voz storyline projects)

---

## Cost Implications by Platform Type

### SaaS Subscription Model
**Examples**: Midjourney ($10/mo), Ideogram ($7/mo), Leonardo ($12/mo)

**Pros**:
- Predictable monthly cost
- Usually unlimited (or high-limit) generations
- No coding required

**Cons**:
- Pay whether you use it or not
- No programmatic access
- Manual workflow

**Best When**: Consistent monthly usage, manual generation acceptable

---

### API Pay-Per-Use Model
**Examples**: FLUX ($0.02-0.05/image), Stable Diffusion ($0.01-0.03/image)

**Pros**:
- Pay only for what you use
- Perfect for variable usage
- Full automation

**Cons**:
- Unpredictable costs if high-volume
- Requires technical setup
- Need to manage API keys

**Best When**: Variable usage patterns, need automation

---

### Hybrid (SaaS + API)
**Examples**: Dreamina ($19.9/mo SaaS or $0.03/image API), Recraft ($12/mo SaaS or pay-per-use API)

**Pros**:
- Flexibility
- Can choose based on project needs
- API available when needed

**Cons**:
- More complex decision-making
- Need to track costs across both methods

**Best When**: Projects with mixed manual/automated needs

---

## Recommendations by Use Case

### Use Case: v-voz Storyline Projects (High-Volume Images)
**Needs**: Many scene variations, batch generation, storyboard frames

**Recommended**:
- **Primary**: Dreamina API ($0.03/image) - #1 quality, best API price
- **Backup**: FLUX via Replicate ($0.02-0.05/image) - character consistency
- **Manual Testing**: Dreamina SaaS (50 free/day)

**Why**: Storyline projects generate 30-70 images per video. API automation essential.

**Cost Estimate**: 50 images × $0.03 = $1.50 per project

---

### Use Case: v-aitldr Brand Videos (Medium-Volume)
**Needs**: Manual quality control, narrative storytelling, less frequent generation

**Recommended**:
- **Primary**: LTX Studio ($15/mo) - storyboard workflow
- **Alternative**: Midjourney ($10/mo) + LTX Studio ($15/mo) = $25

**Why**: Brand videos need careful manual curation. SaaS workflow acceptable.

**Cost**: Fixed $15-25/month regardless of usage

---

### Use Case: v-kiros / v-supportsignal (Client Work)
**Needs**: High quality, Pixar-style avatars, client approval workflow

**Recommended**:
- **Primary**: Leonardo.ai ($12/mo) - avatar specialist
- **Backup**: Midjourney ($10/mo) - quality standard
- **Optional**: Dreamina (50 free/day) - testing variations

**Why**: Client work needs manual iteration and approval. SaaS better than API.

**Cost**: $12-22/month

---

### Use Case: Testing & Exploration
**Needs**: Try many tools, no commitment

**Recommended**:
- **Free Tiers Only**: Dreamina (50/day), Recraft (50/day), Ideogram (20/day), Leonardo (150/day)

**Why**: Can test 100+ images daily for free across all platforms.

**Cost**: $0

---

## API Integration Priority

### Phase 1: Test Free SaaS Tiers
**Goal**: Understand quality without spending

**Tools**:
1. Dreamina (50 images/day) - highest priority
2. Recraft (50 images/day)
3. Ideogram (20 images/day)
4. Leonardo.ai (150 tokens/day)

**Deliverable**: Quality comparison, identify best tools

---

### Phase 2: Test API Tools
**Goal**: Create working code examples, measure costs

**Tools**:
1. **FLUX via Replicate** - character consistency
2. **Dreamina API** - #1 quality at $0.03/image
3. **Recraft via fal.ai** - vector + raster

**Deliverable**: Ready-to-run code in `api-examples/`

---

### Phase 3: Production Integration
**Goal**: Integrate chosen tool(s) into v-shared workflow

**Options**:
1. **High Volume**: Dreamina API + S3 storage
2. **Medium Volume**: SaaS tools + manual workflow
3. **Hybrid**: SaaS for testing, API for production

**Deliverable**: Production-ready scripts, documented workflow

---

## API Code Examples

### FLUX via Replicate (Image Generation)
**File**: `api-examples/image-generation.js`

**Cost**: ~$0.02-0.05 per image
**Best For**: Character consistency

```javascript
const Replicate = require("replicate");
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "black-forest-labs/flux-1-kontext",
  {
    input: {
      prompt: "A realistic portrait of a baker in a vintage kitchen",
      num_outputs: 1
    }
  }
);
```

---

### Dreamina/Seedream via BytePlus (Image Generation)
**File**: `api-examples/image-generation.js`

**Cost**: $0.03 per image (cheapest verified API)
**Best For**: #1 quality, text rendering

```javascript
// BytePlus API example
// Official docs: https://www.byteplus.com/en/product/Seedream

const response = await fetch("https://api.byteplus.com/v1/seedream", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.BYTEPLUS_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    prompt: "A realistic portrait of a baker",
    resolution: "2K"
  })
});
```

---

### Stable Diffusion via Replicate (Image Generation)
**File**: `api-examples/image-generation.js`

**Cost**: ~$0.01-0.03 per image
**Best For**: Customization, LoRA models

```javascript
const output = await replicate.run(
  "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
  {
    input: {
      prompt: "A realistic portrait of a baker in a vintage kitchen",
      width: 1024,
      height: 1024
    }
  }
);
```

---

## Authentication & API Keys

### Required API Keys

**For FLUX, Stable Diffusion**:
- Replicate API key: Sign up at replicate.com
- Free tier: Limited credits
- Paid: Pay-per-use

**For Dreamina (Seedream)**:
- BytePlus API key: Apply at byteplus.com
- Free tier: 200 images for new users
- Paid: $0.03 per image

**For Recraft**:
- fal.ai API key: Sign up at fal.ai
- Pay-per-use pricing

### Storing API Keys Securely

**Create `.env` file** (gitignored):
```
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx
BYTEPLUS_API_KEY=xxxxxxxxxxxx
FAL_KEY=xxxxxxxxxxxx
AWS_ACCESS_KEY_ID=xxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
```

**Load in scripts**:
```javascript
require('dotenv').config();
const apiKey = process.env.REPLICATE_API_TOKEN;
```

**Add to `.gitignore`**:
```
.env
*.env
```

---

## Next Steps

1. **Test all free SaaS tiers** (simultaneous)
2. **Sign up for API access** (Replicate, BytePlus)
3. **Create working code examples** (`api-examples/`)
4. **Measure actual costs** (track spend per image/video)
5. **Document findings** (update this file with real costs)
6. **Choose platform strategy** (SaaS, API, or hybrid)

---

**Last Updated**: 2025-10-30
**Status**: Platform categorization complete
**Next**: API code examples and testing
