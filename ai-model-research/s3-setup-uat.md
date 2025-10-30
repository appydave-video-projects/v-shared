# AWS S3 Setup - User Acceptance Test (UAT)

**Purpose**: Set up AWS S3 for storing large video files generated during AI model testing
**For**: David
**Created**: 2025-10-30

---

## Overview

AI video generation creates large files (100MB-1GB+) that are too big for Git. This guide sets up AWS S3 storage with proper IAM permissions for uploading/downloading videos programmatically.

**What You'll Create**:
- S3 bucket for video storage
- IAM user with limited permissions
- Access credentials (stored locally, gitignored)
- Upload/download scripts

**Time**: ~15 minutes

---

## Prerequisites

- AWS account with admin access
- Access to AWS Console (console.aws.amazon.com)
- Node.js installed (for testing scripts)

---

## Step 1: Create S3 Bucket

### 1.1 Go to S3 Console
1. Log in to AWS Console: https://console.aws.amazon.com
2. Navigate to: **Services** → **Storage** → **S3**
3. Click: **Create bucket**

### 1.2 Configure Bucket
**Bucket name**: `v-shared-ai-research` (or your preferred name)
- ✅ Must be globally unique
- ✅ Use lowercase, hyphens only
- ❌ No underscores, spaces, or uppercase

**Region**: `us-east-1` (or closest to your location)
- Recommended: Use same region for all v-shared resources

**Object Ownership**: ACLs disabled (recommended)

**Block Public Access**: ✅ **Block all public access**
- Keep this ENABLED (videos should be private)

**Bucket Versioning**: Disabled (optional, can enable later)

**Default encryption**: ✅ Enable
- Encryption type: **SSE-S3** (Amazon S3-managed keys)

**Click**: **Create bucket**

---

## Step 2: Create IAM User

### 2.1 Go to IAM Console
1. Navigate to: **Services** → **Security, Identity, & Compliance** → **IAM**
2. Click: **Users** (left sidebar)
3. Click: **Create user**

### 2.2 Set User Details
**User name**: `v-shared-video-uploader`
- This user will only have permission to upload/download from your S3 bucket

**AWS access type**:
- ❌ Uncheck "Provide user access to the AWS Management Console"
- We only need programmatic access (API keys)

**Click**: **Next**

### 2.3 Set Permissions
**Permission options**: Select "Attach policies directly"

**Click**: **Create policy** (opens new tab)

#### Create Custom Policy

**Policy editor**: Switch to **JSON** tab

**Paste this policy** (replace `v-shared-ai-research` with your bucket name):

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
      "Resource": "arn:aws:s3:::v-shared-ai-research"
    },
    {
      "Sid": "UploadDownloadFiles",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::v-shared-ai-research/*"
    }
  ]
}
```

**Policy name**: `v-shared-s3-uploader-policy`
**Description**: "Allows upload/download to v-shared-ai-research bucket only"

**Click**: **Create policy**

**Go back to previous tab** (Create user tab)

**Click refresh** (next to "Create policy" button)

**Search for**: `v-shared-s3-uploader-policy`

**Check the box** next to your new policy

**Click**: **Next**

### 2.4 Review and Create
Review settings, then **Click**: **Create user**

---

## Step 3: Generate Access Keys

### 3.1 Create Access Key
1. Click on the username: `v-shared-video-uploader`
2. Click: **Security credentials** tab
3. Scroll to: **Access keys** section
4. Click: **Create access key**

### 3.2 Select Use Case
**Use case**: Select "Application running outside AWS"
- Click checkbox: "I understand the above recommendation..."

**Click**: **Next**

### 3.3 Set Description
**Description tag** (optional): `v-shared video upload scripts`

**Click**: **Create access key**

### 3.4 Save Credentials ⚠️ IMPORTANT
You'll see:
- **Access key ID**: `AKIA...` (20 characters)
- **Secret access key**: `wJalr...` (40 characters)

**⚠️ CRITICAL**: Save these NOW - you can't retrieve the secret key later!

**Click**: **Download .csv file** (save to secure location)

**DO NOT** close this page yet - we'll use these in Step 4

---

## Step 4: Configure Local Credentials

### 4.1 Create .env File
In your `v-shared/ai-model-research/` folder, create a file named `.env`:

```bash
cd "C:\Users\rjanr\Video Projects\v-shared\ai-model-research"
notepad .env
```

### 4.2 Add Credentials to .env
Paste this (replace with your actual keys from Step 3.4):

```
# AWS S3 Credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_BUCKET_NAME=v-shared-ai-research
```

**Save and close** the file

### 4.3 Verify .gitignore
Make sure `.env` is in `.gitignore`:

```bash
# Check if .gitignore has .env
cd "C:\Users\rjanr\Video Projects\v-shared"
grep ".env" .gitignore
```

If not present, add it:
```bash
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

**⚠️ CRITICAL**: Never commit `.env` to Git!

---

## Step 5: Install Dependencies

### 5.1 Initialize npm (if not already done)
```bash
cd "C:\Users\rjanr\Video Projects\v-shared\ai-model-research"
npm init -y
```

### 5.2 Install AWS SDK
```bash
npm install @aws-sdk/client-s3
npm install dotenv
```

This installs:
- `@aws-sdk/client-s3`: AWS S3 client library
- `dotenv`: Load environment variables from .env file

---

## Step 6: Test Upload Script

### 6.1 Create Test File
```bash
echo "Test video file" > test-video.txt
```

### 6.2 Run Upload Test
Run the upload script (see `api-examples/s3-upload.js`):

```bash
node api-examples/s3-upload.js test-video.txt
```

**Expected output**:
```
Uploading test-video.txt to S3...
✓ Upload successful!
File URL: https://v-shared-ai-research.s3.amazonaws.com/test-video.txt
```

---

## Step 7: Test Download Script

### 7.1 Run Download Test
```bash
node api-examples/s3-upload.js --download test-video.txt downloaded-test.txt
```

**Expected output**:
```
Downloading test-video.txt from S3...
✓ Download successful!
Saved to: downloaded-test.txt
```

### 7.2 Verify Downloaded File
```bash
cat downloaded-test.txt
```

Should show: `Test video file`

---

## Step 8: Verify in AWS Console

### 8.1 Check S3 Bucket
1. Go back to S3 Console
2. Click on your bucket: `v-shared-ai-research`
3. You should see: `test-video.txt`

### 8.2 Check File Details
Click on `test-video.txt`:
- **Size**: Should match original file
- **Storage class**: Standard
- **Encryption**: SSE-S3

---

## Troubleshooting

### Error: "Access Denied"
**Cause**: IAM permissions issue

**Fix**:
1. Go to IAM Console → Users → `v-shared-video-uploader`
2. Click "Permissions" tab
3. Verify `v-shared-s3-uploader-policy` is attached
4. Check policy JSON has correct bucket name

### Error: "The specified bucket does not exist"
**Cause**: Bucket name mismatch

**Fix**:
1. Check `.env` file: `AWS_BUCKET_NAME` matches actual bucket name
2. Verify bucket exists in S3 Console
3. Check region: bucket must be in `AWS_REGION` specified in `.env`

### Error: "Credentials not found"
**Cause**: `.env` file not loaded or wrong location

**Fix**:
1. Verify `.env` file exists in `ai-model-research/` folder
2. Check file has correct variable names (all caps)
3. No quotes around values in `.env`
4. Make sure `dotenv` is installed: `npm list dotenv`

### Error: "Invalid bucket name"
**Cause**: Bucket name has invalid characters

**Fix**:
1. Bucket names must be:
   - 3-63 characters
   - Lowercase letters, numbers, hyphens only
   - No underscores, spaces, or uppercase
2. Recreate bucket with valid name

---

## Security Best Practices

### ✅ DO:
- Keep `.env` file gitignored (never commit to Git)
- Use IAM user with minimal permissions (not root account)
- Enable S3 bucket encryption
- Block all public access on bucket
- Rotate access keys periodically (every 90 days)
- Delete unused IAM users

### ❌ DON'T:
- Don't commit AWS credentials to Git
- Don't share access keys via email/Slack
- Don't use root account credentials
- Don't make S3 bucket public
- Don't give IAM user more permissions than needed

---

## Usage in AI Workflow

### Uploading AI-Generated Videos

```javascript
// After generating video with API
const videoFile = 'output/hailuo-video-001.mp4';
await uploadToS3(videoFile, `videos/hailuo/${Date.now()}-video.mp4`);
```

### Organizing Files in S3

**Recommended structure**:
```
v-shared-ai-research/
├── videos/
│   ├── higgsfield/
│   │   ├── 2025-10-30-test-001.mp4
│   │   └── 2025-10-30-test-002.mp4
│   ├── ltx-studio/
│   ├── hailuo/
│   └── dreamina/
└── images/
    ├── midjourney/
    └── leonardo/
```

### Downloading for Review

```bash
# Download specific video
node api-examples/s3-upload.js --download videos/higgsfield/test-001.mp4 local-review.mp4

# Open in video player
start local-review.mp4
```

---

## Cost Estimates

### S3 Storage Costs (us-east-1)
- **Storage**: $0.023 per GB/month
- **PUT requests**: $0.005 per 1,000 requests
- **GET requests**: $0.0004 per 1,000 requests

### Example Costs
**100 videos × 500MB each = 50GB**:
- Storage: 50GB × $0.023 = $1.15/month
- Uploads: 100 × $0.005/1000 = $0.0005
- Downloads: 100 × $0.0004/1000 = $0.00004

**Total**: ~$1.15/month for 50GB

### Cost Optimization
- Use S3 Glacier for archival (old videos): $0.004/GB/month
- Delete test videos after review
- Compress videos before uploading (ffmpeg)

---

## Alternative: S3 GUI Tools

If you prefer GUI over command line:

### Cyberduck (Free, Windows/Mac)
1. Download: https://cyberduck.io
2. Add connection: S3 (Amazon Simple Storage Service)
3. Use Access Key ID & Secret Key from Step 3
4. Drag & drop files

### AWS CLI
```bash
# Install AWS CLI
choco install awscli  # Windows with Chocolatey

# Configure
aws configure
# Enter: Access Key ID, Secret Key, Region, Output format

# Upload file
aws s3 cp test-video.mp4 s3://v-shared-ai-research/videos/

# Download file
aws s3 cp s3://v-shared-ai-research/videos/test-video.mp4 ./
```

---

## Next Steps

After completing this UAT:

1. ✅ Mark this section complete in task file
2. Test uploading actual AI-generated videos
3. Update `api-examples/s3-upload.js` with error handling
4. Create batch upload script for multiple files
5. Set up S3 lifecycle rules (optional - auto-delete old files)

---

## UAT Checklist

Mark each step as complete:

- [ ] Step 1: S3 bucket created
- [ ] Step 2: IAM user created with policy
- [ ] Step 3: Access keys generated and saved
- [ ] Step 4: `.env` file configured
- [ ] Step 5: Dependencies installed
- [ ] Step 6: Upload test successful
- [ ] Step 7: Download test successful
- [ ] Step 8: Verified in AWS Console
- [ ] `.env` file is gitignored
- [ ] Can upload video files programmatically

---

## Support

If you encounter issues:
1. Check **Troubleshooting** section above
2. Verify all steps completed in order
3. Check AWS CloudWatch logs (if errors persist)
4. Contact: [Add your contact info]

---

**Last Updated**: 2025-10-30
**Status**: Ready for testing
**Tested By**: [To be filled by David]
**Test Date**: [To be filled]
