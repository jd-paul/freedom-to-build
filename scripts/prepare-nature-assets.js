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

  // Remove normalTexture references from materials
  if (gltf.materials) {
    gltf.materials.forEach((mat) => {
      if (mat.normalTexture !== undefined) {
        delete mat.normalTexture
      }
    })
  }

  // Filter out normal textures and images, keep remaining images URIs to copy
  const keptImages = []
  const imageIndexMap = new Map()

  if (gltf.images) {
    gltf.images.forEach((img, idx) => {
      if (!normalImageIndices.has(idx)) {
        imageIndexMap.set(idx, keptImages.length)
        keptImages.push(img)
      }
    })
    gltf.images = keptImages
  }

  const keptTextures = []
  const textureIndexMap = new Map()

  if (gltf.textures) {
    gltf.textures.forEach((tex, idx) => {
      if (!normalTextureIndices.has(idx)) {
        textureIndexMap.set(idx, keptTextures.length)
        keptTextures.push({ ...tex, source: imageIndexMap.get(tex.source) })
      }
    })
    gltf.textures = keptTextures
  }

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

MODELS.forEach(prepareModel)

const totalSize = fs
  .readdirSync(TARGET_DIR)
  .reduce((acc, file) => acc + fs.statSync(path.join(TARGET_DIR, file)).size, 0)
console.log(`\nTotal size in ${TARGET_DIR}: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
