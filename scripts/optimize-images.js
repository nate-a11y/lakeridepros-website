#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const PUBLIC_DIR = 'public';

/**
 * Optimize the logo image
 * Original: 3151x3190 (471KB) displayed at max 160px
 * Target: 320x323 for 2x display at 160px max width
 */
async function optimizeLogo() {
  const logoPath = join(PUBLIC_DIR, 'Color logo - no background.png');
  const optimizedPath = join(PUBLIC_DIR, 'logo-optimized.png');

  console.log('Optimizing logo...');

  try {
    const metadata = await sharp(logoPath).metadata();
    console.log(`Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Resize to 320px width (2x for 160px max display width)
    // Keep aspect ratio
    await sharp(logoPath)
      .resize(320, null, {
        fit: 'contain',
        withoutEnlargement: true
      })
      .png({
        quality: 90,
        compressionLevel: 9,
        effort: 10
      })
      .toFile(optimizedPath);

    const originalStats = await stat(logoPath);
    const optimizedStats = await stat(optimizedPath);

    const savedKB = ((originalStats.size - optimizedStats.size) / 1024).toFixed(2);
    const savedPercent = (((originalStats.size - optimizedStats.size) / originalStats.size) * 100).toFixed(1);

    console.log(`✓ Logo optimized:`);
    console.log(`  Original:  ${(originalStats.size / 1024).toFixed(2)} KB`);
    console.log(`  Optimized: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
    console.log(`  Saved:     ${savedKB} KB (${savedPercent}%)`);
    console.log(`  Output:    ${optimizedPath}`);

    return optimizedPath;
  } catch (error) {
    console.error('Error optimizing logo:', error.message);
    throw error;
  }
}

/**
 * Find and optimize large images in the media directory
 */
async function optimizeMediaImages() {
  console.log('\nChecking for large images in public/media...');

  const mediaDir = join(PUBLIC_DIR, 'media');

  try {
    const files = await readdir(mediaDir);
    const imageFiles = files.filter(file =>
      ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(file).toLowerCase())
    );

    for (const file of imageFiles) {
      const filePath = join(mediaDir, file);
      const stats = await stat(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);

      // Only process images larger than 100KB
      if (stats.size > 100 * 1024) {
        console.log(`\nOptimizing ${file} (${sizeKB} KB)...`);

        const metadata = await sharp(filePath).metadata();
        const outputPath = join(mediaDir, `optimized-${file}`);

        // Determine optimal format and settings
        const isPhoto = metadata.format === 'jpeg' || metadata.format === 'jpg';

        if (isPhoto) {
          // Convert to WebP for photos (better compression)
          const webpPath = outputPath.replace(/\.(jpe?g|png)$/i, '.webp');
          await sharp(filePath)
            .webp({
              quality: 85,
              effort: 6
            })
            .toFile(webpPath);

          const optimizedStats = await stat(webpPath);
          const savedKB = ((stats.size - optimizedStats.size) / 1024).toFixed(2);
          console.log(`  ✓ Saved ${savedKB} KB → ${webpPath}`);
        } else {
          // Optimize PNG
          await sharp(filePath)
            .png({
              quality: 85,
              compressionLevel: 9,
              effort: 10
            })
            .toFile(outputPath);

          const optimizedStats = await stat(outputPath);
          const savedKB = ((stats.size - optimizedStats.size) / 1024).toFixed(2);
          console.log(`  ✓ Saved ${savedKB} KB → ${outputPath}`);
        }
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('  No media directory found, skipping...');
    } else {
      console.error('Error processing media images:', error.message);
    }
  }
}

// Run optimizations
console.log('=== Image Optimization Script ===\n');

try {
  await optimizeLogo();
  await optimizeMediaImages();
  console.log('\n✓ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Review the optimized images');
  console.log('2. Replace original files if satisfied');
  console.log('3. Update image references in code if needed');
} catch (error) {
  console.error('\n✗ Optimization failed:', error.message);
  process.exit(1);
}
