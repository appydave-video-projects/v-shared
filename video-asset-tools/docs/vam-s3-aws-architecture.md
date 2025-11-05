# VAM S3 Staging - AWS Architecture & Multi-Business Unit Strategy

**Created**: 2025-11-03
**Purpose**: Define AWS resource organization for multiple business units
**Related**: `vam-s3-staging-design.md` (main PRD)

---

## Business Context

### Current Business Units

| Business Unit | GitHub Repo | Project Count | Workflow Type | Collaboration Needs |
|---------------|-------------|---------------|---------------|---------------------|
| **AppyDave** | v-appydave | 111 | FliVideo | ✅ David ↔ Jan |
| **VOZ** | v-voz | 2 | Storyline | ✅ David ↔ Jan |
| **AITLDR** | v-aitldr | 2 | Storyline | ✅ David ↔ Jan |
| **Kiros** | v-kiros | 0 | TBD | 🔮 Future |
| **Beauty & Joy** | v-beauty-and-joy | 0 | TBD | 🔮 Future |
| **SupportSignal** | v-supportsignal | 0 | TBD | 🔮 Future |

**Key Insight**: All current collaboration is between **David and Jan only** across 3 active business units.

---

## AWS Architecture Options

### Option 1: Single Bucket with Prefixes (RECOMMENDED) ⭐

**Bucket name**: `video-projects` (simple, multi-brand)

**Structure**:
```
s3://video-projects/
└── staging/                              # Active collaboration (THIS FEATURE)
    ├── v-appydave/                       # AppyDave brand
    │   ├── b65-guy-monroe-marketing-plan/
    │   ├── b66-context-engineered-html-art/
    │   └── b67-vam-s3-staging/
    ├── v-voz/                            # VOZ client
    │   ├── boy-baker/
    │   └── the-point/
    └── v-aitldr/                         # AITLDR brand
        ├── appydave-advert/
        └── movie-posters/
```

**Note**: No "archive/" prefix needed - that's a future feature for Glacier integration (Phase 2)

**Pros**:
- ✅ **Simplest to manage**: One bucket, one lifecycle policy, one cost to monitor
- ✅ **Easiest IAM**: Single policy covers all brands
- ✅ **Cost efficient**: No duplicate charges for minimum storage tiers
- ✅ **Unified dashboard**: One place to see all projects
- ✅ **Shared tools**: Same Ruby scripts work across all brands
- ✅ **Single point of truth**: One registry, one manifest

**Cons**:
- ⚠️ All business units in same bucket (not isolated)
- ⚠️ Prefix-based access control (slightly more complex IAM)

**IAM Strategy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAllBrands",
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::video-projects"
    },
    {
      "Sid": "AllowStagingAccess",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::video-projects/staging/*"
    }
  ]
}
```

**Cost**: $2-5/month total (all brands combined)

---

### Option 2: Bucket Per Business Unit

**Structure**:
```
s3://video-projects/         # AppyDave brand
├── archive/appydave/
└── staging/v-appydave/

s3://voz-video-projects/              # VOZ client
├── archive/voz/
└── staging/v-voz/

s3://aitldr-video-projects/           # AITLDR brand
├── archive/aitldr/
└── staging/v-aitldr/
```

**Pros**:
- ✅ **Complete isolation**: Each business unit has own bucket
- ✅ **Independent billing**: Track costs per business unit
- ✅ **Simpler IAM**: No prefix-based policies needed
- ✅ **Separate access control**: Can grant different users per brand

**Cons**:
- ❌ **3x management overhead**: Configure 3 buckets, 3 policies, 3 lifecycle rules
- ❌ **Tool complexity**: Tools need to know which bucket to use
- ❌ **Higher cost**: $6-15/month (3x minimum charges)
- ❌ **No unified view**: Need to check multiple buckets

**Cost**: $2-5/month × 3 brands = $6-15/month

---

### Option 3: Hybrid - One Bucket Per Team (David+Jan)

**Structure**:
```
s3://davidjan-video-collab/           # David + Jan collaboration
└── staging/
    ├── v-appydave/
    ├── v-voz/
    └── v-aitldr/

s3://appydave-video-archive/          # Archival only (separate)
└── archive/
    ├── appydave/
    ├── voz/
    └── aitldr/
```

**Pros**:
- ✅ **Collaboration bucket isolated**: Staging separate from archival
- ✅ **Simple team access**: David + Jan have full access to collab bucket
- ✅ **Archival protected**: No accidental deletion of archived projects

**Cons**:
- ⚠️ Two buckets to manage (but simpler than 3+)
- ⚠️ Tools need to know which bucket for staging vs archival

**Cost**: $2-5/month (staging) + $2.50/month (archival) = $4.50-7.50/month

---

## Recommendation: Option 1 (Single Bucket) ⭐

### Why Single Bucket Wins

**Current reality**:
- Only 2 users: David and Jan
- Only 3 active business units
- No separate teams per business unit
- All collaboration is David ↔ Jan regardless of brand

**Future scalability**:
- If new collaborator added: Update IAM policy
- If business unit needs isolation: Use prefix-based IAM restrictions
- If costs need tracking: Use S3 cost allocation tags

**Simplicity wins**:
- 1 bucket to configure
- 1 lifecycle policy
- 1 IAM policy
- 1 cost to monitor
- Tools work universally

---

## AWS Setup Guide (Single Bucket)

### Step 1: Create S3 Bucket

**Bucket name**: `video-projects` (simple, multi-brand)

**Settings**:
```
Region: us-east-1 (or ap-southeast-1 for Asia)
Block public access: ✅ Enabled
Versioning: ❌ Disabled
Encryption: ✅ SSE-S3 (Amazon-managed)
Object Lock: ❌ Disabled
```

**Tags** (for cost tracking):
```
Environment: production
Purpose: video-staging
Owner: david
```

---

### Step 2: Create Lifecycle Policy

**Single lifecycle rule** (staging auto-cleanup only):

#### Staging Folder → Auto-Delete After 90 Days
```json
{
  "Rules": [
    {
      "Id": "CleanupStaging",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "staging/"
      },
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

**Apply via AWS Console**:
1. S3 Console → `video-projects` → Management tab
2. Create lifecycle rule → Add filter → Prefix: `staging/`
3. Set expiration: 90 days

**Note**: No Glacier transition needed for this bucket - Phase 2 (long-term archive) will use separate Glacier vault or bucket

---

### Step 3: Create IAM Policy

**Policy name**: `video-projects-full-access`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::video-projects"
    },
    {
      "Sid": "ManageAllObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:RestoreObject",
        "s3:GetObjectMetadata",
        "s3:PutObjectMetadata"
      ],
      "Resource": "arn:aws:s3:::video-projects/*"
    }
  ]
}
```

**Why not restrict by prefix?**
- David and Jan collaborate on **all brands**
- Simpler = fewer permission errors
- Can add prefix restrictions later if needed

---

### Step 4: Create IAM Users

**User 1**: `david-video-projects`
```
Username: david-video-projects
Attach policy: video-projects-full-access
Programmatic access: ✅ Yes (generate access keys)
Console access: ❌ No
```

**User 2**: `jan-video-projects`
```
Username: jan-video-projects
Attach policy: video-projects-full-access
Programmatic access: ✅ Yes (generate access keys)
Console access: ❌ No
```

**Save credentials**:
```bash
# David's .video-tools.env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=video-projects
S3_SYNC_USER=david

# Jan's .video-tools.env (different keys)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=video-projects
S3_SYNC_USER=jan
```

---

### Step 5: Test Access

**Test commands** (before building tools):

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1

# Test bucket access
aws s3 ls s3://video-projects/

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://video-projects/staging/test/test.txt

# Test download
aws s3 cp s3://video-projects/staging/test/test.txt downloaded.txt

# Test delete
aws s3 rm s3://video-projects/staging/test/test.txt

# Cleanup
rm test.txt downloaded.txt
```

**Expected result**: All commands succeed (no "Access Denied")

---

## Configuration Per Business Unit

### How Tools Know Which Brand

**Automatic detection** based on current directory:

```ruby
# In s3_sync_up.rb
def detect_brand
  current_path = Dir.pwd

  if current_path.include?('/v-appydave')
    'v-appydave'
  elsif current_path.include?('/v-voz')
    'v-voz'
  elsif current_path.include?('/v-aitldr')
    'v-aitldr'
  elsif current_path.include?('/v-kiros')
    'v-kiros'
  elsif current_path.include?('/v-beauty-and-joy')
    'v-beauty-and-joy'
  elsif current_path.include?('/v-supportsignal')
    'v-supportsignal'
  else
    raise "Could not detect brand from path: #{current_path}"
  end
end

def get_s3_prefix(brand, project_id)
  "staging/#{brand}/#{project_id}/"
end
```

**Example**:
```bash
# Working in v-appydave
cd /Users/davidcruwys/dev/video-projects/v-appydave
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65

# Tool automatically uses:
# S3 prefix: staging/v-appydave/b65-guy-monroe-marketing-plan/
```

**Override if needed**:
```bash
# Explicit brand specification
ruby s3_sync_up.rb b65 --brand v-voz
```

---

## Cost Tracking Per Business Unit

### S3 Cost Allocation Tags

**Tag all objects** with brand identifier:

```ruby
# When uploading to S3
s3.put_object(
  bucket: 'video-projects',
  key: "staging/v-appydave/b65/raw.mp4",
  body: file,
  tagging: "brand=appydave&project=b65&uploader=david"
)
```

**AWS Cost Explorer** can then show:
- Cost per brand (appydave, voz, aitldr)
- Cost per project (b65, b66, boy-baker)
- Cost per uploader (david, jan)

**Enable in AWS**:
1. AWS Console → Billing → Cost Allocation Tags
2. Activate tags: `brand`, `project`, `uploader`
3. Wait 24 hours for data to appear
4. Cost Explorer → Group by tag: `brand`

---

## Future: When to Split Buckets

**Trigger scenarios for separate buckets**:

### Scenario 1: Different Teams Per Business Unit
```
AppyDave team: David + Jan
VOZ team: David + Sarah
Kiros team: David + Alex + Marie
```
**Solution**: Create bucket per team, not per brand

### Scenario 2: Client Data Isolation Required
```
VOZ client requires:
- Separate AWS account
- Compliance audit trail
- No shared resources with other clients
```
**Solution**: VOZ gets own bucket (or own AWS account)

### Scenario 3: Cost Chargeback to Clients
```
Need to bill VOZ for their S3 usage
```
**Solution**: Separate bucket makes billing cleaner (or use cost allocation tags)

### Scenario 4: Exceeded Single Bucket Limits
```
S3 limits (unlikely to hit):
- 5,500 requests/second per prefix
- No limit on objects per bucket
```
**Solution**: Unlikely to need this for video collaboration

---

## Decision Matrix

| Criteria | Single Bucket | Per-Unit Bucket | Team Bucket |
|----------|--------------|----------------|-------------|
| **Simplicity** | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Cost** | $2-5/mo | $6-15/mo | $4.50-7.50/mo |
| **IAM Complexity** | Low | Medium | Low |
| **Scalability** | Good | Good | Good |
| **Isolation** | Prefix-based | Full | Team-based |
| **Cost Tracking** | Tags | Bucket-level | Bucket-level |
| **Tool Complexity** | Low | High | Medium |

**Recommendation**: Start with **Single Bucket**, split later if needed

---

## Implementation Checklist

### AWS Setup (One-Time, ~30 minutes)

- [ ] Create S3 bucket: `video-projects`
- [ ] Configure bucket settings (encryption, public access block)
- [ ] Create lifecycle rule: Archive → Glacier (180 days)
- [ ] Create lifecycle rule: Staging → Delete (90 days)
- [ ] Create IAM policy: `video-projects-full-access`
- [ ] Create IAM user: `david-video-projects`
- [ ] Generate access keys for David
- [ ] Save David's credentials to `.video-tools.env`
- [ ] Test AWS CLI access (upload, download, delete)
- [ ] Create IAM user: `jan-video-projects`
- [ ] Generate access keys for Jan
- [ ] Send Jan his credentials (secure method)
- [ ] Jan tests AWS CLI access

### Tool Development (Week 1-2)

- [ ] Build `s3_sync_up.rb` with auto-brand detection
- [ ] Build `s3_sync_down.rb` with auto-brand detection
- [ ] Build `s3_sync_status.rb`
- [ ] Build `s3_sync_cleanup.rb`
- [ ] Test across all brands (appydave, voz, aitldr)

### Documentation (Week 2)

- [ ] Update README.md with S3 staging workflow
- [ ] Update CLAUDE.md with quick commands
- [ ] Create troubleshooting guide

---

## Related Documentation

- `vam-s3-staging-design.md` - Main PRD (product requirements)
- `s3-integration-setup.md` - General S3 setup guide
- `roadmap.md` - Overall S3/Glacier implementation plan

---

**Decision**: ✅ Single Bucket (`video-projects`)
**Next Step**: Create bucket and IAM users
**Timeline**: 30 minutes AWS setup, then proceed to tool development
