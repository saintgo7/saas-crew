const fs = require('fs')
const path = require('path')

const SRC = path.join(
  __dirname,
  '..',
  'node_modules',
  '@excalidraw',
  'excalidraw',
  'dist',
  'prod',
)
const DEST = path.join(__dirname, '..', 'public', 'excalidraw-assets')

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Only copy the fonts directory
const fontsSrc = path.join(SRC, 'fonts')
const fontsDest = path.join(DEST, 'fonts')

if (!fs.existsSync(fontsSrc)) {
  console.warn('[excalidraw-assets] fonts directory not found, skipping')
  process.exit(0)
}

if (fs.existsSync(fontsDest)) {
  fs.rmSync(fontsDest, { recursive: true })
}

copyDirSync(fontsSrc, fontsDest)

const count = fs.readdirSync(fontsDest).length
console.log(`[excalidraw-assets] copied ${count} font families to public/excalidraw-assets/fonts/`)
