export const themes = [
  { id: 'dark', label: '2026 Dark' },
  { id: 'light', label: '2026 Light' },
]

export function isSpaceImage(value) {
  return value === null || (
    typeof value === 'string' && value.length <= 100000 &&
    /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
  )
}

export async function prepareSpaceImage(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP image.')
  }
  if (file.size === 0 || file.size > 2 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 2 MB.')
  }
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch (cause) {
    throw new Error('This image could not be opened. Choose a valid image file.', { cause })
  }
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image processing is unavailable in this browser.')
    const side = Math.min(bitmap.width, bitmap.height)
    if (!side) throw new Error('This image has no pixels.')
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 128, 128)
    const image = canvas.toDataURL('image/png')
    if (!isSpaceImage(image)) throw new Error('This image could not be prepared for storage.')
    return image
  } finally {
    bitmap.close()
  }
}
