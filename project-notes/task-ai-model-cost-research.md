# Task: AI Image/Video Model Cost & Quality Research

**Created**: 2025-10-30
**For**: Jan
**Priority**: High
**Related Repos**: v-shared (research applies to all video projects)
**Estimated Time**: 2-3 weeks (ongoing research)

## Goal

Find the **cheapest quality AI image/video generation tools** for movie production. We need to make movies cheaply this year while maintaining quality.

**Primary Metric**: Cost vs Quality (not just "best quality")

## Context

David gets asked for advice at AI meetups about these tools but doesn't have real hands-on experience. We need documented, tested information about:
- What tools/models exist
- What they cost
- How to use them (API/SaaS)
- Which ones are good enough for our video projects

## Constraints

- **US-only models** (Sora2, Cool Models v0.3) are expensive or inaccessible
- **Chinese models** (Kling, etc.) might be as good and cheaper - test these!
- **Budget**: Start free, propose budgets for paid testing (e.g., "I think we need $20 for X")
- **Access**: If you can't access something, document the API call - David can test with his credentials

## Research Areas

### 1. Image Generation Models

**Test & Document**:
- Model names and versions (DALL-E 3, Flux.1, Stable Diffusion 3, Chinese models, etc.)
- Platform type (SaaS like Leonardo AI, or API like Replicate)
- Cost per image (different resolutions)
- Quality for our use case (character consistency, realistic rendering)

**Deliverables**:
- Cost comparison table
- Quality assessment (subjective - David will tell you if it looks like shit)
- Ready-to-run code examples (JavaScript/cURL with placeholder for API key)

### 2. Video Generation Models

**Test & Document**:
- Model names and versions (Runway Gen-3, Kling, Luma, Pika, etc.)
- Platform type (SaaS vs API)
- Cost per video second (different lengths/quality)
- Quality for our use case (realistic animation, good physics)

**Deliverables**:
- Cost comparison table
- Quality assessment (subjective)
- Ready-to-run code examples (JavaScript/cURL with placeholder for API key)

### 3. AWS S3 Integration

**Why**: We need a way to store/retrieve large video files from S3.

**Research**:
- Downloadable tool (like Windows File Explorer for S3)
- OR JavaScript/Node.js scripts to upload/download files
- Document what AWS credentials you need (IAM permissions, access keys, etc.)

**Deliverable**: Simple User Acceptance Test (UAT) plan for David:
```markdown
1. Go to AWS Console → IAM
2. Create new user: video-projects-uploader
3. Attach policy: [specific policy name or JSON]
4. Generate access key
5. Save credentials in v-shared/.env (gitignored):
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
6. Test: Run `node upload-test.js` - should upload test file
```

**Goal**: David follows your plan, gets credentials, saves them to repo (gitignored), you can use them.

## Typical Usage Scenarios (For Cost Estimates)

Study these projects to understand usage patterns:
- **v-aitldr**: How many images/videos per project?
- **v-voz**: Storyline workflow - how many visual concepts?
- **v-kiros**: Rony project - how many scene variations?
- **v-supportsignal**: Future client work estimates

Then estimate monthly costs based on realistic usage.

## Folder Structure (Your Choice)

Create: `v-shared/ai-model-research/`

**Suggested** (but you decide):
```
v-shared/ai-model-research/
├── README.md                    # Overview, findings, recommendations
├── images/                      # Generated images (committed to git)
│   ├── dall-e-3/
│   ├── flux/
│   └── kling/
├── videos/                      # Generated videos (gitignored - show via Loom)
│   ├── runway-gen3/
│   └── kling/
├── cost-analysis.md             # Cost comparison tables
├── api-examples/
│   ├── image-generation.js      # Ready-to-run examples
│   ├── video-generation.js
│   └── s3-upload.js
├── platforms.md                 # SaaS vs API breakdown
└── s3-setup-uat.md              # David's setup instructions
```

**Images**: Commit to git
**Videos**: Gitignored, show David via Loom

Add to `.gitignore`:
```
# Video research outputs (too large for git)
ai-model-research/videos/
```

## Quality Metrics

**Subjective assessment** - David will tell you if it looks like shit.

**For Images**: Character consistency, realistic rendering, same character across multiple images
**For Videos**: Realistic animation, good physics, smooth motion

Compare side-by-side with same prompts across different tools.

## Code Examples Format

Provide **ready-to-run** examples that just need an API key:

**JavaScript example**:
```javascript
// image-generation.js - DALL-E 3 via OpenAI API
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Add your key to .env
});

async function generateImage(prompt) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024"
  });

  console.log(`Image URL: ${response.data[0].url}`);
  console.log(`Cost: ~$0.04 per image`);
}

// Test it
generateImage("A realistic portrait of a baker in a vintage kitchen");
```

**cURL example**:
```bash
# Replace YOUR_API_KEY with actual key
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A realistic portrait of a baker",
    "n": 1,
    "size": "1024x1024"
  }'
```

## Workflow

1. **Research & Test**: Try different tools (start free)
2. **Document**: Add findings to markdown files
3. **Generate Examples**: Save images to git, videos locally
4. **Cost Analysis**: Build comparison tables
5. **Code Examples**: Create ready-to-run scripts
6. **Budget Proposals**: When you hit paywalls, propose budgets to David
   - "I need $20 to test Runway Gen-3 for 100 seconds of video"
   - "I need $50/month for Replicate API to test multiple models"

## Acceptance Criteria

- [ ] Cost comparison table for image models (at least 5 models)
- [ ] Cost comparison table for video models (at least 3 models)
- [ ] Platform categorization (SaaS vs API)
- [ ] Ready-to-run JavaScript examples (image + video generation)
- [ ] Ready-to-run cURL examples (image + video generation)
- [ ] S3 upload/download solution with UAT plan for David
- [ ] Quality assessment notes (what works, what doesn't)
- [ ] Budget proposals for paid testing
- [ ] Generated image examples in git
- [ ] Generated video examples shown via Loom
- [ ] Documentation of Chinese models (Kling, etc.)

## Budget Approach

1. **Start free**: Use free tiers, trials, open-source models
2. **Document paywalls**: When you can't test something free, note it
3. **Propose budgets**: "David, I need $X to test Y because Z"
4. **Wait for approval**: Don't spend your own money
5. **Track spending**: Document actual costs in cost-analysis.md

## Priority

**Images and Videos are equally important.**

Focus on cost-effective options that are good enough for:
- AITLDR brand videos (narrative storytelling)
- VOZ client projects (professional quality)
- Kiros/SupportSignal (client deliverables)

## Questions?

Add questions to this file, commit, push. David will respond.

---

## Jan's Progress

**Started**: [Date when you start]

[Add your progress notes here]

### Findings So Far

[Document key findings as you go]

### Budget Requests

[List any budget requests here with justification]

### Blockers

[Anything blocking progress]

## Completed

[Mark complete when done - or this may be ongoing research]
