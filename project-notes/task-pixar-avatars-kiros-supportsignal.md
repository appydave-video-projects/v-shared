# Task: Pixar-Style Avatars for Kiros & SupportSignal

**Created**: 2025-10-30
**For**: Jan
**Priority**: Medium
**Related Repos**: v-kiros, v-supportsignal
**Estimated Time**: 1-2 days

## Goal

Create **Pixar-style avatar images** for:
- **Justina** (Kiros)
- **Angela** (SupportSignal)

These avatars will be used in video projects and need to be recognizable as the actual people while maintaining a consistent, professional Pixar aesthetic.

## Context

We tested multiple styles (claymation, realistic, Pixar) and **Pixar looked the best**:
- ✅ Pixar style is beautiful and professional
- ❌ Claymation looked too childish
- ❌ Realistic/semi-realistic felt wrong

**Problem with current Kiros image**: The existing Pixar-style image doesn't look like Justina (wasn't recognized as her).

**Problem with SupportSignal**: We have a good Pixar example, but it might not be Angela, or we need a fresh version.

## Reference Material

### Style Reference
Check existing work in: `v-supportsignal/pixar/` folder

Use these as **style references** when prompting AI tools. The Pixar style there is what we want to replicate.

### Source Photos

**Kiros (Justina)**:
1. Visit Kiros educational website to find photos of Justina
2. Screenshot/download reference photos
3. Store in `v-kiros/reference-photos/justina/` (gitignored if large)

**SupportSignal (Angela)**:
1. Check if we already have reference photos in v-supportsignal
2. If not, ask David for photos
3. Store in `v-supportsignal/reference-photos/angela/` (gitignored if large)

## Style Requirements

**Pixar aesthetic**:
- Stylized but recognizable facial features
- Warm, friendly, professional vibe
- Consistent art style between both avatars
- High quality, usable for video thumbnails and intros

**Key**: The avatars must be **recognizable** as Justina and Angela while being in Pixar style.

## Deliverables

### 1. Avatar Images

**Kiros - Justina**:
- Filename: `v-kiros/avatars/justina-pixar-v1.png`
- Format: PNG, transparent background preferred
- Resolution: At least 1024x1024
- Variations: Create 2-3 versions for David to choose from

**SupportSignal - Angela**:
- Filename: `v-supportsignal/avatars/angela-pixar-v1.png`
- Format: PNG, transparent background preferred
- Resolution: At least 1024x1024
- Variations: Create 2-3 versions for David to choose from

### 2. Process Documentation

Create: `v-shared/ai-model-research/pixar-avatar-process.md`

Document:
- Which AI tool you used (DALL-E 3, Midjourney, Flux, etc.)
- Prompts that worked well
- Cost per avatar
- Process steps (so we can create more avatars later)

**Example format**:
```markdown
# Pixar Avatar Generation Process

## Tool: DALL-E 3 via ChatGPT Plus

## Prompt Template:
"Create a Pixar-style 3D character portrait of [description of person].
Professional, warm, friendly expression. Studio lighting.
Pixar animation style like characters from Up or Inside Out.
[Specific features: hair color, glasses, etc.]"

## Cost: $0 (included in ChatGPT Plus subscription)

## Steps:
1. Upload reference photo
2. Use prompt template with specific person details
3. Generate 3-4 variations
4. Refine best option
5. Upscale if needed
```

### 3. Style Reference Sheet

Create: `v-shared/ai-model-research/pixar-style-reference.md`

Include:
- Screenshots of the good Pixar examples from v-supportsignal
- What makes them work (consistent features, style notes)
- Do's and Don'ts for Pixar style

## Tools to Use

**Recommended** (use what works best):
- **DALL-E 3** via ChatGPT Plus (if you have access) - Good for Pixar style
- **Midjourney** v6 (if accessible) - Excellent for stylized characters
- **Leonardo AI** - Has Pixar/3D character presets
- **Flux** via Replicate - Open source, might be cheaper

**Note**: This ties into Task #1 (AI Model Research). Document costs and quality here too!

## Workflow

### Phase 1: Research & Setup (2-4 hours)
1. Find reference photos of Justina (Kiros website)
2. Confirm Angela reference photos (ask David if needed)
3. Review existing Pixar examples in v-supportsignal
4. Choose AI tool for generation

### Phase 2: Generation (4-6 hours)
1. Generate Justina avatars (2-3 variations)
2. Generate Angela avatars (2-3 variations)
3. Save to respective repos
4. Show David via Loom for feedback

### Phase 3: Refinement (2-4 hours)
1. Based on David's feedback, refine chosen versions
2. Create final versions
3. Document process

### Phase 4: Documentation (1-2 hours)
1. Write process documentation
2. Create style reference sheet
3. Note costs and tool used

## Folder Structure

**v-kiros**:
```
v-kiros/
├── avatars/
│   ├── justina-pixar-v1.png
│   ├── justina-pixar-v2.png
│   └── justina-pixar-v3.png
└── reference-photos/          # Gitignored (or small files ok)
    └── justina/
        └── reference-1.jpg
```

**v-supportsignal**:
```
v-supportsignal/
├── avatars/
│   ├── angela-pixar-v1.png
│   ├── angela-pixar-v2.png
│   └── angela-pixar-v3.png
├── pixar/                     # Existing examples (review these!)
└── reference-photos/          # Gitignored
    └── angela/
```

**v-shared** (documentation):
```
v-shared/ai-model-research/
├── pixar-avatar-process.md
└── pixar-style-reference.md
```

## Acceptance Criteria

- [ ] Found reference photos of Justina from Kiros website
- [ ] Confirmed reference photos for Angela
- [ ] Generated 2-3 Pixar-style variations for Justina
- [ ] Generated 2-3 Pixar-style variations for Angela
- [ ] Avatars are recognizable as the actual people
- [ ] Consistent Pixar style across both avatars
- [ ] Showed variations to David via Loom
- [ ] Refined based on feedback
- [ ] Saved final versions to respective repos (PNG, 1024x1024+)
- [ ] Documented process in v-shared
- [ ] Documented costs
- [ ] Created style reference sheet

## Quality Check

Before showing David, ask yourself:
1. Would David recognize these people from the avatars?
2. Do both avatars look like they're from the same Pixar movie?
3. Are they professional enough for client-facing video content?
4. Is the quality high enough for video thumbnails?

If any answer is "no", iterate before sharing.

## Budget

**Start free/cheap**:
- If you have ChatGPT Plus, use DALL-E 3 (included)
- Try free tiers of Leonardo AI or similar
- Use open-source tools via Replicate

**If you need paid access**: Propose budget to David with justification.

## Notes

- **Keep both clients consistent** - Same style, same quality
- This is for **professional client work**, not experiments
- The avatars will be used in actual video projects
- Justina and Angela need to be recognizable

## Questions?

Add questions here, commit, push. David will respond.

---

## Jan's Progress

**Started**: [Date]

[Add your progress notes here]

### Tool Used

[Which AI tool you ended up using and why]

### Challenges

[Any issues encountered]

### Variations Created

[Link to Loom showing the variations]

## Completed

[Mark complete when David approves final versions]
