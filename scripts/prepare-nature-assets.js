const fs = require('fs')
const path = require('path')

const SOURCE_DIR = '/Users/johnpaulsandiego/Downloads/Ultimate Stylized Nature - May 2022/glTF'
const TARGET_DIR = path.join(__dirname, '..', 'public', 'models', 'nature')

const MODELS = [
  'BirchTree_1',
  'BirchTree_2',
  'BirchTree_3',
  'MapleTree_1',
  'MapleTree_2',
  'Bush',
  'Bush_Large',
  'Grass_Large',
  'Grass_Small',
  'Flower_1',
  'Flower_2',
  'DeadTree_1',
  'DeadTree_2',
]

function isNormalMap(name) {
  return /normal/i.test(name)
}

function walkAndReplaceTextureIndices(obj, indexMap) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => walkAndReplaceTextureIndices(item, indexMap))
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key === 'index' && typeof obj[key] === 'number' && indexMap.has(obj[key])) {
        obj[key] = indexMap.get(obj[key])
      } else {
        walkAndReplaceTextureIndices(obj[key], indexMap)
      }
    }
  }
}

function prepareModel(name) {
  const gltfPath = path.join(SOURCE_DIR, `${name}.gltf`)
  const binPath = path.join(SOURCE_DIR, `${name}.bin`)

  if (!fs.existsSync(gltfPath) || !fs.existsSync(binPath)) {
    console.warn(`Skipping ${name}: missing gltf or bin`)
    return
  }

  const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf8'))

  // Identify normal map images and textures
  const normalImageIndices = new Set()
  const normalTextureIndices = new Set()

  if (gltf.images) {
    gltf.images.forEach((img, idx) => {
      if (isNormalMap(img.name) || isNormalMap(img.uri)) {
        normalImageIndices.add(idx)
      }
    })
  }

  if (gltf.textures) {
    gltf.textures.forEach((tex, idx) => {
      if (normalImageIndices.has(tex.source)) {
        normalTextureIndices.add(idx)
      }
    })
  }

  // Remove normalTexture references from materials before reindexing
  if (gltf.materials) {
    gltf.materials.forEach((mat) => {
      if (mat.normalTexture !== undefined) {
        delete mat.normalTexture
      }
    })
  }

  // Build old -> new texture index map
  const textureIndexMap = new Map()
  const keptTextures = []

  if (gltf.textures) {
    gltf.textures.forEach((tex, oldIdx) => {
      if (!normalTextureIndices.has(oldIdx)) {
        textureIndexMap.set(oldIdx, keptTextures.length)
        keptTextures.push(tex)
      }
    })
    gltf.textures = keptTextures
  }

  // Build old -> new image index map
  const imageIndexMap = new Map()
  const keptImages = []

  if (gltf.images) {
    gltf.images.forEach((img, oldIdx) => {
      if (!normalImageIndices.has(oldIdx)) {
        imageIndexMap.set(oldIdx, keptImages.length)
        keptImages.push(img)
      }
    })
    gltf.images = keptImages
  }

  // Update texture sources to point to new image indices
  if (gltf.textures) {
    gltf.textures.forEach((tex) => {
      if (typeof tex.source === 'number') {
        tex.source = imageIndexMap.get(tex.source)
      }
    })
  }

  // Update all texture index references throughout the glTF
  walkAndReplaceTextureIndices(gltf, textureIndexMap)

  // Write modified glTF
  fs.mkdirSync(TARGET_DIR, { recursive: true })
  fs.writeFileSync(
    path.join(TARGET_DIR, `${name}.gltf`),
    JSON.stringify(gltf, null, 2),
  )

  // Copy bin
  fs.copyFileSync(binPath, path.join(TARGET_DIR, `${name}.bin`))

  // Copy kept images
  keptImages.forEach((img) => {
    const src = path.join(SOURCE_DIR, img.uri)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(TARGET_DIR, img.uri))
    } else {
      console.warn(`Missing image: ${img.uri}`)
    }
  })

  console.log(`Prepared ${name}`)
}

fs.rmSync(TARGET_DIR, { recursive: true, force: true })
MODELS.forEach(prepareModel)

const totalSize = fs
  .readdirSync(TARGET_DIR)
  .reduce((acc, file) => acc + fs.statSync(path.join(TARGET_DIR, file)).size, 0)
console.log(`\nTotal size in ${TARGET_DIR}: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
