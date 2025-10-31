# Jan Handoff - AI Model Research Data Quality Issues

**Date**: 2025-10-31
**From**: David
**To**: Jan
**Topic**: Critical issues found in AI model research - needs immediate correction

---

## Summary

David reviewed the AI model research you completed and found **serious data quality issues**. The pricing information is inaccurate, incomplete, and cannot be used for decision-making. This document explains the problems, the new approach, and what needs to be done.

---

## Problem #1: Inaccurate Pricing Data

### Example: Hailuo AI

**What was reported in your research:**
- Pro tier: $54.99/month

**What is actually on their website:**
- Standard: $14.99/mo
- **Pro: $89/mo (monthly) OR $63/mo (annual)**
- Master: $119.99/mo

### Issues Found
1. **Wrong price** - $54.99 vs $89 (off by $34)
2. **Didn't distinguish monthly vs annual** - Huge difference ($89 vs $63)
3. **Possibly mixed up tier names** - "Pro" reported as $54.99 but doesn't exist

**Root Cause**: You relied on secondary sources (blogs, Reddit, YouTube) instead of visiting the actual pricing pages.

---

## Problem #2: Missing Monthly vs Annual Distinction

### Example: Ideogram

Your research said:
- Basic: $7/mo
- Plus: $20/mo
- Pro: $60/mo

**What's missing:**
- Basic: $8/mo (monthly) OR $7/mo (annual - 12% discount)
- Plus: $20/mo (monthly) OR $15/mo (annual - 25% discount)
- Pro: $60/mo (monthly) OR $42/mo (annual - 30% discount)

**Impact**: Annual pricing can save 12-30% - that's a BIG difference for budget planning!

---

## Problem #3: Machine-Readable Data

David's feedback:
> "We're pretty good at creating data pages in markdown documents but a lot of this is just raw data and it should've been machine-readable instead."

**The Issue**:
- Your research is in markdown files with tables
- Cannot be queried, filtered, or processed by scripts
- Cannot generate dynamic reports
- Hard to verify completeness

---

## New Approach: JSON-First

### What We've Created

**File**: `ai-model-research/pricing-data.json`

This is a structured JSON file with:
- ✅ Exact pricing for monthly AND annual billing
- ✅ Verification status tracking
- ✅ Verification dates and who verified
- ✅ Free tier details with specific limits
- ✅ Feature lists per tier
- ✅ API availability and pricing
- ✅ Machine-readable for generating reports

### JSON Structure Example

```json
{
  "id": "ideogram",
  "name": "Ideogram",
  "pricingUrl": "https://ideogram.ai/pricing",
  "pricingTiers": [
    {
      "name": "Basic",
      "monthly": {
        "price": 8.00,
        "currency": "USD",
        "billingCycle": "monthly"
      },
      "annual": {
        "price": 7.00,
        "pricePerMonth": 7.00,
        "totalAnnual": 84.00,
        "billingCycle": "annual",
        "discount": "12%"
      },
      "credits": {
        "priority": 400,
        "priorityPeriod": "month",
        "slow": 100,
        "slowPeriod": "day"
      },
      "features": [
        "400 priority credits / month",
        "100 slow credits / day",
        "Queue multiple generations",
        "Edit in Canvas (no image upload)",
        "Quality export"
      ],
      "verificationStatus": "VERIFIED",
      "verificationDate": "2025-10-31",
      "verifiedBy": "David"
    }
  ]
}
```

**Benefits:**
1. Can automatically generate comparison tables
2. Can filter by price, features, verification status
3. Can generate HTML visualizations
4. Can track what's been verified vs what needs checking
5. Can query for specific information programmatically

---

## What You Need to Do

### Task: Verify ALL Pricing Data

**File**: `project-notes/task-verify-pricing-data.md`

**Priority**: HIGH (URGENT)

**Process** (for each tool):

1. **Visit the actual pricing page** (URLs in JSON)
2. **Take a screenshot** (save to `pricing-screenshots/`)
3. **Record EXACT prices**:
   - Monthly billing amount
   - Annual billing amount (if different)
   - Free tier specifics (daily/monthly limits)
   - Credits/tokens per tier
   - Feature differences
4. **Update JSON** with verified data
5. **Set verification fields**:
   ```json
   "verificationStatus": "VERIFIED",
   "verificationDate": "2025-10-31",
   "verifiedBy": "Jan"
   ```

### Tools to Verify (9 total)

**HIGH Priority:**
1. ✅ Ideogram - Already verified by David
2. ⏳ Hailuo AI - Known to be wrong
3. ⏳ Dreamina - Critical for recommendations
4. ⏳ LTX Studio - Conflicting info about free tier

**MEDIUM Priority:**
5. ⏳ Leonardo.ai
6. ⏳ Higgsfield
7. ⏳ Recraft

**LOW Priority (API-only):**
8. ⏳ FLUX
9. ⏳ Stable Diffusion

**EXCLUDED:**
- ❌ Midjourney - Removed per David's request ("we will never work with them")

---

## Critical Rules

### ✅ DO THIS

1. **Visit actual pricing pages only**
   - https://hailuoai.com/pricing
   - https://ideogram.ai/pricing
   - https://dreamina.com/pricing
   - etc.

2. **Screenshot everything**
   - Name: `tool-name-2025-10-31.png`
   - Save to: `pricing-screenshots/`
   - This is proof of verification

3. **Record BOTH monthly and annual**
   - If annual pricing exists, ALWAYS record it
   - Calculate discount percentage
   - Note which is better value

4. **Copy exact wording**
   - Features: Copy exact text from website
   - Don't paraphrase or interpret

5. **Document uncertainty**
   - If something is unclear, note it in `"notes": "..."`
   - Ask David if critical

### ❌ DON'T DO THIS

1. **Don't use secondary sources**
   - ❌ NO Wikipedia
   - ❌ NO Reddit
   - ❌ NO Blog posts
   - ❌ NO YouTube videos
   - ❌ NO "comparison websites"

2. **Don't guess or estimate**
   - If you can't find a price, mark it as `null`
   - Add note: `"notes": "Annual pricing not shown on website"`

3. **Don't skip screenshots**
   - Screenshots are mandatory
   - They're proof that you actually checked

4. **Don't batch verify without updating**
   - Update JSON immediately after verifying each tool
   - Commit to git regularly

---

## New Files Created

### 1. `pricing-data.json`
**Purpose**: Machine-readable pricing database
**Status**: Template created, needs verification
**Your task**: Fill in verified data

### 2. `pricing-visualizer.html`
**Purpose**: Interactive HTML visualization of pricing data
**Status**: Complete, ready to use
**How to use**:
1. Open `pricing-visualizer.html` in browser
2. It reads `pricing-data.json` automatically
3. Shows all tools in filterable cards
4. Highlights verified vs unverified tools
5. Shows stats: total tools, verified count, free tiers, API availability

**Features:**
- Filter by category (image-only vs hybrid)
- Filter by free tier availability
- Filter by API availability
- Filter by verification status
- Visual cards with pricing tiers
- Color-coded verification status
- Monthly vs annual pricing comparison

### 3. `task-verify-pricing-data.md`
**Purpose**: Detailed task instructions for verification
**Status**: Complete, ready to start
**Your task**: Follow the checklist, mark items complete

### 4. `VERIFICATION-LOG.md` (you need to create)
**Purpose**: Document your verification process
**Format**: See example in task file
**Your task**: Document findings as you verify each tool

### 5. `jan-handoff-2025-10-31.md` (this file)
**Purpose**: Knowledge transfer from David to Jan
**Status**: Complete

---

## Example: How Ideogram Was Verified

David verified Ideogram as an example. Here's what he did:

1. **Visited**: https://ideogram.ai/pricing
2. **Found**:
   - Free tier with limited slow credits
   - 3 paid tiers (Basic, Plus, Pro)
   - Each tier has monthly and annual pricing
   - Annual offers 12-30% discount
   - Specific credit allocations per tier

3. **Updated JSON** with:
   ```json
   {
     "name": "Basic",
     "monthly": {
       "price": 8.00,
       "billingCycle": "monthly"
     },
     "annual": {
       "price": 7.00,
       "pricePerMonth": 7.00,
       "totalAnnual": 84.00,
       "discount": "12%"
     },
     "credits": {
       "priority": 400,
       "priorityPeriod": "month",
       "slow": 100,
       "slowPeriod": "day"
     },
     "verificationStatus": "VERIFIED",
     "verificationDate": "2025-10-31",
     "verifiedBy": "David"
   }
   ```

4. **Result**: Ideogram is now marked as VERIFIED in the visualizer

---

## Why This Matters

### Bad Data = Bad Decisions

If David recommends a tool based on your research saying it's $15/mo, but it's actually $89/mo, that's a **HUGE** problem.

If you miss that annual billing saves 30%, David might overpay by **hundreds of dollars per year**.

### This is for Real Projects

- v-voz projects need 30-70 images each
- v-kiros and v-supportsignal need client-quality avatars
- v-aitldr needs professional brand videos

**These are real projects with real budgets.** The data needs to be accurate.

---

## Timeline

**Target**: Complete within 2-3 days

- **Day 1**: Verify Hailuo AI, Dreamina, LTX Studio, Leonardo.ai
- **Day 2**: Verify Higgsfield, Recraft, start API tools
- **Day 3**: Finish FLUX, Stable Diffusion, documentation cleanup

---

## Deliverables

By end of Day 3:

1. ✅ **pricing-data.json** - All tools marked "VERIFIED"
2. ✅ **VERIFICATION-LOG.md** - Process documentation
3. ✅ **pricing-screenshots/** - 9 screenshots (one per tool)
4. ✅ **Updated HTML visualizer** - Should show 100% verified

---

## Questions?

If you encounter:
- **Pricing requires login** - Ask David if you should sign up
- **Pricing in non-USD** - Ask David which exchange rate to use
- **Enterprise "Contact Us" pricing** - Ask David if we care
- **Regional pricing differences** - Ask David which region to record
- **Promotional pricing** - Ask David if we record promo or regular price

**Add questions to**: `task-verify-pricing-data.md` under "Jan's Progress" section

---

## Key Takeaways

### What Went Wrong
1. ❌ Used secondary sources instead of primary sources
2. ❌ Didn't distinguish monthly vs annual pricing
3. ❌ Data in markdown instead of machine-readable JSON
4. ❌ No verification tracking or proof (screenshots)
5. ❌ Inaccurate data (Hailuo AI $54.99 vs $89)

### What We're Doing Now
1. ✅ JSON-first for machine readability
2. ✅ Primary sources only (actual pricing pages)
3. ✅ Screenshots as proof of verification
4. ✅ Monthly AND annual pricing tracked
5. ✅ Verification status, dates, and who verified
6. ✅ HTML visualizer for easy exploration
7. ✅ Clear process documentation

### Your Action Items
1. Read `task-verify-pricing-data.md` (full instructions)
2. Start with Hailuo AI (we know it's wrong)
3. Visit pricing page, screenshot, update JSON
4. Mark as verified, commit to git
5. Move to next tool
6. Document in VERIFICATION-LOG.md as you go
7. Ask questions if uncertain

---

## File Locations

```
v-shared/
├── ai-model-research/
│   ├── pricing-data.json              # VERIFY THIS
│   ├── pricing-visualizer.html        # View this in browser
│   ├── VERIFICATION-LOG.md            # CREATE THIS
│   ├── pricing-screenshots/           # CREATE THIS FOLDER
│   │   ├── hailuo-ai-2025-10-31.png
│   │   ├── ideogram-2025-10-31.png
│   │   └── ... (7 more screenshots)
│   ├── README.md                      # Overview (update after verification)
│   ├── cost-analysis.md               # Details (regenerate from JSON later)
│   └── platforms.md                   # Platform info
└── project-notes/
    ├── task-verify-pricing-data.md    # YOUR MAIN TASK
    ├── task-ai-model-cost-research.md # Original task
    └── jan-handoff-2025-10-31.md      # THIS DOCUMENT
```

---

## Visual Workflow

```
1. Open browser
   ↓
2. Visit https://hailuoai.com/pricing
   ↓
3. Take screenshot (Cmd+Shift+4 on Mac)
   ↓
4. Save as: pricing-screenshots/hailuo-ai-2025-10-31.png
   ↓
5. Open pricing-data.json in editor
   ↓
6. Find "id": "hailuo-ai" section
   ↓
7. Update with EXACT pricing from website
   ↓
8. Set verificationStatus: "VERIFIED"
   ↓
9. Set verificationDate: "2025-10-31"
   ↓
10. Set verifiedBy: "Jan"
   ↓
11. Save JSON
   ↓
12. Open pricing-visualizer.html
   ↓
13. Verify Hailuo AI card shows VERIFIED ✅
   ↓
14. Git commit: "Verify Hailuo AI pricing"
   ↓
15. Move to next tool (Dreamina)
```

---

## Success Criteria

You're done when:
- [ ] All 9 tools have `verificationStatus: "VERIFIED"`
- [ ] All 9 tools have screenshots in `pricing-screenshots/`
- [ ] `VERIFICATION-LOG.md` documents all findings
- [ ] `pricing-visualizer.html` shows 9/9 verified
- [ ] Monthly AND annual pricing recorded (where available)
- [ ] Free tier details are complete
- [ ] Git commits show progression (1 commit per tool verified)

---

## Final Note from David

The quality of this data directly impacts our ability to make informed decisions about which AI tools to invest in. We're potentially spending $20-100+/month based on these recommendations.

**Take your time. Be thorough. Verify everything.**

If something seems odd or doesn't make sense, **ask questions** instead of guessing.

We'd rather have accurate data arrive in 3 days than inaccurate data arrive in 1 day.

---

**Status**: Ready to start
**Next Step**: Read `task-verify-pricing-data.md` and begin verification
**Questions**: Add to task file or contact David directly

---

**Last Updated**: 2025-10-31
**Handoff Complete**: Jan can begin verification work
