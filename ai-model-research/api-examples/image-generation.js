/**
 * AI Image Generation API Examples
 *
 * This file contains ready-to-run examples for:
 * - FLUX via Replicate API
 * - Dreamina (Seedream 4.0) via BytePlus API
 * - Stable Diffusion via Replicate API
 *
 * Setup:
 * 1. npm install replicate dotenv
 * 2. Create .env file with API keys (see README.md)
 * 3. Run: node image-generation.js
 */

require('dotenv').config();
const Replicate = require('replicate');
const fs = require('fs');
const https = require('https');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Output directory for generated images
  outputDir: path.join(__dirname, '..', 'images'),

  // Test prompt (use same prompt across all tools for comparison)
  testPrompt: "A realistic portrait of a baker in a vintage kitchen, warm lighting, professional photography",

  // API Keys (loaded from .env)
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  BYTEPLUS_API_KEY: process.env.BYTEPLUS_API_KEY,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Download image from URL to local file
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Ensure output directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Calculate cost and log results
 */
function logResult(tool, startTime, cost, outputPath) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✓ ${tool} Complete`);
  console.log(`  Time: ${duration}s`);
  console.log(`  Cost: ~$${cost.toFixed(4)}`);
  console.log(`  File: ${outputPath}`);
}

// ============================================================================
// FLUX VIA REPLICATE API
// ============================================================================

/**
 * Generate image using FLUX.1 Kontext (best for character consistency)
 * Cost: ~$0.02-0.05 per image
 * Best for: Character consistency (94.7% accuracy), instruction-based editing
 */
async function generateWithFLUX(prompt) {
  console.log('\n🎨 Generating with FLUX.1 Kontext via Replicate...');

  if (!CONFIG.REPLICATE_API_TOKEN) {
    console.error('❌ REPLICATE_API_TOKEN not found in .env file');
    return null;
  }

  const startTime = Date.now();
  const replicate = new Replicate({
    auth: CONFIG.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-1-kontext",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 100
        }
      }
    );

    // Download image
    const outputDir = path.join(CONFIG.outputDir, 'flux');
    ensureDir(outputDir);
    const timestamp = Date.now();
    const filename = `flux-${timestamp}.png`;
    const filepath = path.join(outputDir, filename);

    await downloadImage(output[0], filepath);

    // Log results
    logResult('FLUX', startTime, 0.035, filepath);

    return filepath;

  } catch (error) {
    console.error('❌ FLUX Error:', error.message);
    return null;
  }
}

// ============================================================================
// STABLE DIFFUSION VIA REPLICATE API
// ============================================================================

/**
 * Generate image using Stable Diffusion XL
 * Cost: ~$0.01-0.03 per image
 * Best for: Customization, LoRA models, cost-effective generation
 */
async function generateWithStableDiffusion(prompt) {
  console.log('\n🎨 Generating with Stable Diffusion XL via Replicate...');

  if (!CONFIG.REPLICATE_API_TOKEN) {
    console.error('❌ REPLICATE_API_TOKEN not found in .env file');
    return null;
  }

  const startTime = Date.now();
  const replicate = new Replicate({
    auth: CONFIG.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      }
    );

    // Download image
    const outputDir = path.join(CONFIG.outputDir, 'stable-diffusion');
    ensureDir(outputDir);
    const timestamp = Date.now();
    const filename = `sdxl-${timestamp}.png`;
    const filepath = path.join(outputDir, filename);

    await downloadImage(output[0], filepath);

    // Log results
    logResult('Stable Diffusion XL', startTime, 0.02, filepath);

    return filepath;

  } catch (error) {
    console.error('❌ Stable Diffusion Error:', error.message);
    return null;
  }
}

// ============================================================================
// DREAMINA (SEEDREAM 4.0) VIA BYTEPLUS API
// ============================================================================

/**
 * Generate image using Seedream 4.0 (ByteDance)
 * Cost: $0.03 per image (cheapest API, #1 quality)
 * Best for: #1 ranked quality, text rendering (94% accuracy), 4K images
 *
 * NOTE: This is a placeholder - actual BytePlus API implementation
 * requires signup at https://www.byteplus.com/en/product/Seedream
 */
async function generateWithDreamina(prompt) {
  console.log('\n🎨 Generating with Seedream 4.0 via BytePlus...');

  if (!CONFIG.BYTEPLUS_API_KEY) {
    console.error('❌ BYTEPLUS_API_KEY not found in .env file');
    console.log('ℹ️  Sign up at: https://www.byteplus.com/en/product/Seedream');
    return null;
  }

  const startTime = Date.now();

  try {
    // BytePlus API endpoint (verify actual endpoint from docs)
    const response = await fetch('https://api.byteplus.com/v1/seedream/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.BYTEPLUS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        resolution: '2K',  // Supports up to 4K
        num_images: 1,
        style: 'photorealistic'
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Download image (adjust based on actual API response format)
    const imageUrl = data.images[0].url;
    const outputDir = path.join(CONFIG.outputDir, 'dreamina');
    ensureDir(outputDir);
    const timestamp = Date.now();
    const filename = `seedream-${timestamp}.png`;
    const filepath = path.join(outputDir, filename);

    await downloadImage(imageUrl, filepath);

    // Log results
    logResult('Dreamina (Seedream 4.0)', startTime, 0.03, filepath);

    return filepath;

  } catch (error) {
    console.error('❌ Dreamina Error:', error.message);
    console.log('ℹ️  Note: This is a placeholder implementation.');
    console.log('ℹ️  Actual API may differ - check BytePlus documentation.');
    return null;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Test all APIs with the same prompt
 */
async function testAllAPIs() {
  console.log('='.repeat(60));
  console.log('AI Image Generation API Testing');
  console.log('='.repeat(60));
  console.log(`\nPrompt: "${CONFIG.testPrompt}"\n`);

  // Ensure output directory exists
  ensureDir(CONFIG.outputDir);

  // Test each API
  const results = {
    flux: await generateWithFLUX(CONFIG.testPrompt),
    sdxl: await generateWithStableDiffusion(CONFIG.testPrompt),
    dreamina: await generateWithDreamina(CONFIG.testPrompt)
  };

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const successful = Object.values(results).filter(r => r !== null).length;
  console.log(`\n✓ Generated ${successful}/3 images successfully`);

  if (results.flux) {
    console.log(`\nFLUX: ${results.flux}`);
    console.log('  - Best for: Character consistency (94.7%)');
    console.log('  - Cost: ~$0.035/image');
  }

  if (results.sdxl) {
    console.log(`\nStable Diffusion: ${results.sdxl}`);
    console.log('  - Best for: Customization, cost-effective');
    console.log('  - Cost: ~$0.02/image');
  }

  if (results.dreamina) {
    console.log(`\nDreamina: ${results.dreamina}`);
    console.log('  - Best for: #1 quality, text rendering');
    console.log('  - Cost: $0.03/image (cheapest API)');
  }

  console.log('\n' + '='.repeat(60));
  console.log('Next Steps:');
  console.log('1. Compare image quality side-by-side');
  console.log('2. Test character consistency (generate same character 5x)');
  console.log('3. Measure actual costs vs estimates');
  console.log('4. Document findings in cost-analysis.md');
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// RUN
// ============================================================================

// Check if running directly (not imported)
if (require.main === module) {
  testAllAPIs().catch(console.error);
}

// Export functions for use in other scripts
module.exports = {
  generateWithFLUX,
  generateWithStableDiffusion,
  generateWithDreamina,
  downloadImage,
  ensureDir
};
