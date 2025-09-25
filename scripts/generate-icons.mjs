#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')
const iconsDir = path.join(publicDir, 'icons')

const srcArg = process.argv[2]
const src = srcArg ? path.resolve(process.cwd(), srcArg) : path.join(publicDir, 'logo.png')

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

async function generate() {
  if (!fs.existsSync(src)) {
    console.error(`Source image not found: ${src}\nProvide a square PNG or SVG. Example: node scripts/generate-icons.mjs public/logo.png`)
    process.exit(1)
  }

  await ensureDir(iconsDir)

  const sizes = [192, 512]
  const outputs = []

  for (const size of sizes) {
    const iconPath = path.join(iconsDir, `icon-${size}.png`)
    const maskablePath = path.join(iconsDir, `maskable-${size}.png`)

    // Standard icon: cover to square with transparent background
    outputs.push(
      sharp(src)
        .resize(size, size, { fit: 'cover', withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toFile(iconPath)
        .then(() => console.log('✓', path.relative(projectRoot, iconPath)))
    )

    // Maskable icon: add safe padding and solid background for maskability
    const padding = Math.round(size * 0.1)
    const canvasSize = size
    outputs.push(
      sharp({ create: { width: canvasSize, height: canvasSize, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
        .png()
        .composite([
          {
            input: await sharp(src)
              .resize(canvasSize - 2 * padding, canvasSize - 2 * padding, { fit: 'contain', withoutEnlargement: true })
              .png()
              .toBuffer(),
            top: padding,
            left: padding,
          },
        ])
        .png({ compressionLevel: 9 })
        .toFile(maskablePath)
        .then(() => console.log('✓', path.relative(projectRoot, maskablePath)))
    )
  }

  await Promise.all(outputs)
  console.log('All PWA icons generated into', path.relative(projectRoot, iconsDir))
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
