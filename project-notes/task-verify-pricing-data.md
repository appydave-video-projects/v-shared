# Task: Verify AI Tool Pricing Data

**Created**: 2025-10-31
**For**: Jan
**Priority**: HIGH (URGENT)
**Related**: ai-model-research/pricing-data.json
**Status**: CRITICAL - Previous research was inaccurate

---

## Problem Identified

David reviewed the pricing research and found **significant inaccuracies**:

### Example: Hailuo AI
**What was reported**: Pro tier at $54.99/mo
**What is actual**:
- Standard: $14.99/mo
- Pro: $89/mo (monthly) OR $63/mo (annual)
- Master: $119.99/mo

**Issues**:
1. Wrong price ($54.99 vs $89)
2. Didn't distinguish monthly vs annual billing
3. Possibly mixed up tier names

### Root Cause
Research relied on **secondary sources** instead of visiting actual pricing pages.

---

## New Approach: Machine-Readable Data

A new JSON file has been created: `ai-model-research/pricing-data.json`

**Structure**:
```json
{
  "tools": [
    {
      "id": "tool-name",
      "pricingTiers": [
        {
          "name": "Pro",
          "monthly": {
            "price": 89.00,
            "currency": "USD",
            "billingCycle": "monthly"
          },
          "annual": {
            "price": 63.00,
            "pricePerMonth": 63.00,
            "totalAnnual": 756.00,
            "billingCycle": "annual"
          },
          "verificationStatus": "VERIFIED",
          "verificationDate": "2025-10-31",
          "verifiedBy": "David or Jan"
        }
      ]
    }
  ]
}
```

**Benefits**:
- Machine-readable (can generate reports automatically)
- Clear verification status
- Tracks monthly vs annual pricing
- Documents who verified and when

---

## Your Task

### Step 1: Verify Each Tool's Pricing Page

For each tool in `pricing-data.json`, you MUST:

1. **Visit the actual pricing page** (URLs provided in JSON)
2. **Take a screenshot** of the pricing page
3. **Record EXACT prices** for:
   - Monthly billing
   - Annual billing (if different from monthly)
   - Free tier details
   - Credit/token allocations
   - Feature differences between tiers

4. **Update JSON** with verified data:
   - Set `verificationStatus: "VERIFIED"`
   - Set `verificationDate: "2025-10-31"` (or actual date)
   - Set `verifiedBy: "Jan"`
   - Add notes for any clarifications

5. **Save screenshot** to:
   ```
   ai-model-research/pricing-screenshots/
   ├── hailuo-ai-2025-10-31.png
   ├── ideogram-2025-10-31.png
   ├── midjourney-2025-10-31.png
   └── ...
   ```

---

### Step 2: Tools to Verify (Priority Order)

#### HIGH Priority (Verify First)
1. **Hailuo AI** - Already known to be wrong
2. **Dreamina** - Chinese model, critical for recommendations
3. **LTX Studio** - Conflicting info about free tier (800 vs 8000 CS)
4. **Ideogram** - ✅ COMPLETED (verified by David 2025-10-31)

#### MEDIUM Priority
5. **Leonardo.ai**
6. **Higgsfield**
7. **Recraft**

#### LOW Priority (API-only, less critical)
9. **FLUX** - API pricing via Replicate/fal.ai
10. **Stable Diffusion** - API pricing varies by provider

---

### Step 3: Document Verification Process

Create: `ai-model-research/VERIFICATION-LOG.md`

**Format**:
```markdown
# Pricing Verification Log

## 2025-10-31

### Hailuo AI
- **URL**: https://hailuoai.com/pricing
- **Screenshot**: pricing-screenshots/hailuo-ai-2025-10-31.png
- **Findings**:
  - Standard: $14.99/mo (monthly only? or annual available?)
  - Pro: $89/mo (monthly) OR $63/mo (annual, saves $26/mo)
  - Master: $119.99/mo (monthly only? or annual available?)
- **Issues Found**:
  - Previous research had Pro at $54.99 (WRONG)
  - Previous research didn't note monthly vs annual
- **Status**: ✅ VERIFIED
- **Verified By**: Jan
- **Notes**: Need to check if Standard/Master have annual options too

### Ideogram
- **URL**: https://ideogram.ai/pricing
- **Screenshot**: pricing-screenshots/ideogram-2025-10-31.png
- **Findings**:
  - Free: Limited slow credits
  - Basic: $8/mo (monthly) OR $7/mo (annual, 12% discount)
  - Plus: $20/mo (monthly) OR $15/mo (annual, 25% discount)
  - Pro: $60/mo (monthly) OR $42/mo (annual, 30% discount)
- **Status**: ✅ VERIFIED
- **Verified By**: David
- **Notes**: Annual pricing offers significant discounts (12-30%)

### [Next tool]
...
```

---

## Acceptance Criteria

- [ ] All 10 tools verified by visiting actual pricing pages
- [ ] Screenshots saved for each tool
- [ ] `pricing-data.json` updated with verified data
- [ ] All verified entries have:
  - [ ] `verificationStatus: "VERIFIED"`
  - [ ] `verificationDate: "YYYY-MM-DD"`
  - [ ] `verifiedBy: "Jan"`
  - [ ] Both monthly AND annual pricing (if annual exists)
  - [ ] Free tier details (credits, limits, etc.)
  - [ ] Feature lists for each tier
- [ ] `VERIFICATION-LOG.md` created with findings
- [ ] Any conflicting information documented and resolved

---

## Critical Requirements

### 1. Primary Sources Only
- ❌ NO Wikipedia
- ❌ NO Reddit posts
- ❌ NO blog articles
- ❌ NO YouTube videos
- ✅ YES - Official pricing pages only

### 2. Monthly vs Annual Distinction
ALWAYS record both if available:
- Monthly billing price
- Annual billing price (per month)
- Total annual cost
- Discount percentage

### 3. Screenshot Everything
Screenshots are proof of verification. If pricing changes later, we have evidence of what it was.

### 4. Document Uncertainty
If something is unclear:
- Note it in JSON `"notes": "Unclear if annual pricing exists"`
- Add to verification log
- Ask David if critical

---

## Example: Ideogram (CORRECT Format)

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
        "currency": "USD",
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

---

## Common Pitfalls to Avoid

### ❌ Don't Assume
- Don't assume annual pricing exists if not shown
- Don't assume tier names are consistent across tools
- Don't assume "credits" mean the same thing across tools

### ❌ Don't Estimate
- Record exact prices, not estimates
- If a feature list is vague, copy the EXACT wording from the site

### ❌ Don't Skip Screenshots
- Screenshots are evidence
- Without them, we can't verify later

---

## Questions for David

If you encounter these situations, ask David:

1. **Pricing requires login** - Should I sign up for free trial to see pricing?
2. **Pricing in non-USD** - Convert to USD using what exchange rate?
3. **Enterprise pricing** - Do we care about "Contact Us" tiers?
4. **Regional pricing** - US pricing vs other countries - which to record?
5. **Promotional pricing** - "50% off for first month" - record promo or regular price?

---

## Timeline

**Target**: Complete within 2-3 days

- Day 1: High priority tools (Hailuo, Dreamina, LTX, Midjourney)
- Day 2: Medium priority tools (Leonardo, Higgsfield, Recraft)
- Day 3: Low priority tools (FLUX, Stable Diffusion) + documentation cleanup

---

## Deliverables

1. ✅ **pricing-data.json** - Fully verified (all tools marked "VERIFIED")
2. ✅ **VERIFICATION-LOG.md** - Documentation of verification process
3. ✅ **pricing-screenshots/** - Screenshots of all pricing pages
4. ✅ **Updated markdown reports** - Regenerated from JSON (optional, can do later)

---

## After Verification

Once JSON is verified, we can:
1. Generate accurate markdown reports
2. Build comparison tables
3. Create cost calculators
4. Make confident recommendations to David

But **first**, we need accurate source data. That's this task.

---

**Status**: Not Started
**Assigned**: Jan
**Due**: 2025-11-03 (3 days)
**Blocker**: None - can start immediately

---

## Jan's Progress

**Started**: [Date]

### Verification Status

- [ ] Hailuo AI
- [ ] Dreamina
- [ ] LTX Studio
- [x] Ideogram (verified by David)
- [ ] Leonardo.ai
- [ ] Higgsfield
- [ ] Recraft
- [ ] FLUX
- [ ] Stable Diffusion

### Issues Encountered

[Document any problems here]

### Questions for David

[List questions here]

---

## Completed

[Mark complete when all tools verified]
