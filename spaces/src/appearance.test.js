import assert from 'node:assert/strict'
import { afterEach, suite, test, vi } from 'vitest'
import { prepareSpaceImage } from './appearance.js'

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0u0AAAAASUVORK5CYII='

suite('Collection image preparation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('rejects unsupported, empty, and oversized uploads before decoding', async () => {
    const decode = vi.fn()
    vi.stubGlobal('createImageBitmap', decode)
    await assert.rejects(prepareSpaceImage(new File(['svg'], 'icon.svg', { type: 'image/svg+xml' })), /PNG, JPEG, or WebP/)
    await assert.rejects(prepareSpaceImage(new File([], 'empty.png', { type: 'image/png' })), /2 MB/)
    await assert.rejects(prepareSpaceImage(new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' })), /2 MB/)
    assert.equal(decode.mock.calls.length, 0)
  })

  test('center-crops and downsizes images to a small PNG for persistent avatars', async () => {
    const bitmap = { width: 120, height: 80, close: vi.fn() }
    const drawImage = vi.fn()
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap))
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage })
    const encode = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function (type) {
      assert.equal(type, 'image/png')
      assert.equal(this.width, 128)
      assert.equal(this.height, 128)
      return image
    })
    assert.equal(await prepareSpaceImage(new File(['pixels'], 'wide.jpg', { type: 'image/jpeg' })), image)
    assert.deepEqual(drawImage.mock.calls[0], [bitmap, 20, 0, 80, 80, 0, 0, 128, 128])
    assert.equal(encode.mock.calls.length, 1)
    assert.equal(bitmap.close.mock.calls.length, 1)
  })

  test('reports corrupt images and releases decoded images when canvas processing fails', async () => {
    const decode = vi.fn().mockRejectedValue(new Error('Invalid image'))
    vi.stubGlobal('createImageBitmap', decode)
    const file = new File(['broken'], 'broken.png', { type: 'image/png' })
    await assert.rejects(prepareSpaceImage(file), /could not be opened/)
    const bitmap = { width: 20, height: 20, close: vi.fn() }
    decode.mockResolvedValue(bitmap)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    await assert.rejects(prepareSpaceImage(file), /processing is unavailable/)
    assert.equal(bitmap.close.mock.calls.length, 1)
  })
})
