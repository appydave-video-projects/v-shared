/**
 * AWS S3 Upload/Download Script
 *
 * Handles uploading large video files to S3 and downloading them back.
 * Useful for video files too large for Git (>50MB).
 *
 * Setup:
 * 1. Complete S3 UAT setup (see s3-setup-uat.md)
 * 2. npm install @aws-sdk/client-s3 dotenv
 * 3. Configure .env with AWS credentials
 *
 * Usage:
 * - Upload: node s3-upload.js <local-file>
 * - Download: node s3-upload.js --download <s3-key> <local-file>
 * - List: node s3-upload.js --list
 */

require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.AWS_BUCKET_NAME || 'v-shared-ai-research',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// Validate configuration
function validateConfig() {
  const missing = [];

  if (!CONFIG.accessKeyId) missing.push('AWS_ACCESS_KEY_ID');
  if (!CONFIG.secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file. See s3-setup-uat.md for setup instructions.');
    process.exit(1);
  }
}

// Create S3 client
const s3Client = new S3Client({
  region: CONFIG.region,
  credentials: {
    accessKeyId: CONFIG.accessKeyId,
    secretAccessKey: CONFIG.secretAccessKey,
  },
});

// ============================================================================
// UPLOAD FUNCTION
// ============================================================================

/**
 * Upload file to S3
 * @param {string} filePath - Local file path
 * @param {string} s3Key - S3 object key (optional, defaults to filename)
 * @returns {Promise<string>} S3 URL
 */
async function uploadFile(filePath, s3Key = null) {
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Get file stats
  const stats = fs.statSync(filePath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  // Default S3 key to filename if not provided
  if (!s3Key) {
    const filename = path.basename(filePath);
    const ext = path.extname(filename);
    const dir = ext === '.mp4' || ext === '.mov' ? 'videos' : 'images';
    s3Key = `${dir}/${Date.now()}-${filename}`;
  }

  console.log(`\n📤 Uploading to S3...`);
  console.log(`   File: ${path.basename(filePath)}`);
  console.log(`   Size: ${fileSizeMB} MB`);
  console.log(`   S3 Key: ${s3Key}`);

  try {
    // Read file
    const fileContent = fs.readFileSync(filePath);

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Upload command
    const command = new PutObjectCommand({
      Bucket: CONFIG.bucket,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
    });

    // Execute upload
    const startTime = Date.now();
    await s3Client.send(command);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Success
    const url = `https://${CONFIG.bucket}.s3.${CONFIG.region}.amazonaws.com/${s3Key}`;
    console.log(`\n✓ Upload successful!`);
    console.log(`  Duration: ${duration}s`);
    console.log(`  URL: ${url}`);
    console.log(`  Cost: ~$${(fileSizeMB * 0.005 / 1000).toFixed(6)} (PUT request)`);

    return url;

  } catch (error) {
    console.error(`\n❌ Upload failed: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// DOWNLOAD FUNCTION
// ============================================================================

/**
 * Download file from S3
 * @param {string} s3Key - S3 object key
 * @param {string} localPath - Local file path to save to
 * @returns {Promise<string>} Local file path
 */
async function downloadFile(s3Key, localPath) {
  console.log(`\n📥 Downloading from S3...`);
  console.log(`   S3 Key: ${s3Key}`);
  console.log(`   Local: ${localPath}`);

  try {
    // Download command
    const command = new GetObjectCommand({
      Bucket: CONFIG.bucket,
      Key: s3Key,
    });

    // Execute download
    const startTime = Date.now();
    const response = await s3Client.send(command);

    // Ensure output directory exists
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(localPath, buffer);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);

    // Success
    console.log(`\n✓ Download successful!`);
    console.log(`  Duration: ${duration}s`);
    console.log(`  Size: ${fileSizeMB} MB`);
    console.log(`  Saved to: ${localPath}`);
    console.log(`  Cost: ~$${(fileSizeMB * 0.0004 / 1000).toFixed(6)} (GET request)`);

    return localPath;

  } catch (error) {
    console.error(`\n❌ Download failed: ${error.message}`);

    if (error.name === 'NoSuchKey') {
      console.error(`   File not found in S3: ${s3Key}`);
      console.error(`   Use --list to see available files`);
    }

    throw error;
  }
}

// ============================================================================
// LIST FUNCTION
// ============================================================================

/**
 * List files in S3 bucket
 * @param {string} prefix - Optional prefix filter (e.g., 'videos/')
 */
async function listFiles(prefix = '') {
  console.log(`\n📂 Listing files in S3 bucket: ${CONFIG.bucket}`);
  if (prefix) {
    console.log(`   Prefix: ${prefix}`);
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: CONFIG.bucket,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('\n   No files found.');
      return;
    }

    console.log(`\n   Found ${response.Contents.length} files:\n`);
    console.log('   Key'.padEnd(60) + 'Size'.padEnd(12) + 'Modified');
    console.log('   ' + '-'.repeat(80));

    response.Contents.forEach(obj => {
      const key = obj.Key.padEnd(60);
      const sizeMB = (obj.Size / (1024 * 1024)).toFixed(2);
      const size = `${sizeMB} MB`.padEnd(12);
      const modified = obj.LastModified.toISOString().split('T')[0];
      console.log(`   ${key}${size}${modified}`);
    });

    // Calculate total size
    const totalSize = response.Contents.reduce((sum, obj) => sum + obj.Size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const monthlyCost = (totalSizeMB / 1024 * 0.023).toFixed(4);

    console.log('\n   ' + '-'.repeat(80));
    console.log(`   Total: ${totalSizeMB} MB (~$${monthlyCost}/month storage cost)\n`);

  } catch (error) {
    console.error(`\n❌ List failed: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function printUsage() {
  console.log(`
AWS S3 Upload/Download Tool
${'='.repeat(60)}

Usage:
  Upload file:
    node s3-upload.js <local-file> [s3-key]

  Download file:
    node s3-upload.js --download <s3-key> <local-file>

  List files:
    node s3-upload.js --list [prefix]

Examples:
  # Upload video (auto-generates S3 key)
  node s3-upload.js videos/test.mp4

  # Upload with custom S3 key
  node s3-upload.js videos/test.mp4 videos/higgsfield/test-001.mp4

  # Download video
  node s3-upload.js --download videos/higgsfield/test-001.mp4 local-test.mp4

  # List all videos
  node s3-upload.js --list videos/

  # List all files
  node s3-upload.js --list

Environment:
  Requires .env file with:
    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secret-key
    AWS_REGION=us-east-1
    AWS_BUCKET_NAME=v-shared-ai-research

  See s3-setup-uat.md for setup instructions.
${'='.repeat(60)}
  `);
}

async function main() {
  // Validate config
  validateConfig();

  const args = process.argv.slice(2);

  // No arguments - show usage
  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  try {
    // Download mode
    if (args[0] === '--download') {
      if (args.length < 3) {
        console.error('❌ Missing arguments for download');
        console.error('Usage: node s3-upload.js --download <s3-key> <local-file>');
        process.exit(1);
      }
      const s3Key = args[1];
      const localPath = args[2];
      await downloadFile(s3Key, localPath);
    }
    // List mode
    else if (args[0] === '--list') {
      const prefix = args[1] || '';
      await listFiles(prefix);
    }
    // Upload mode
    else {
      const filePath = args[0];
      const s3Key = args[1] || null;
      await uploadFile(filePath, s3Key);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

if (require.main === module) {
  main();
}

module.exports = {
  uploadFile,
  downloadFile,
  listFiles,
};
