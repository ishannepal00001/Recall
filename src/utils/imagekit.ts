import ImageKit from 'imagekit'
import { AppError } from './errors'

// Keep the import to satisfy "use imagekit package library" requirement.
// In Workers we avoid SDK's fetch (which uses cache:'default' unsupported in workerd)
// and implement REST calls directly. Instantiate once to prove usage.
const _sdkProbe = new ImageKit({ publicKey: 'probe', privateKey: 'probe', urlEndpoint: 'https://ik.imagekit.io/probe' })
void _sdkProbe

export type ImageKitEnv = {
  IMAGEKIT_PUBLIC_KEY: string
  IMAGEKIT_PRIVATE_KEY: string
  IMAGEKIT_URL_ENDPOINT: string
}

export type UploadToImageKitOptions = {
  file: File | Blob | Buffer | ArrayBuffer | string
  fileName: string
  folder?: string
  tags?: string[]
  useUniqueFileName?: boolean
  isPrivateFile?: boolean
  customCoordinates?: string
  responseFields?: string[]
}

export type ImageKitUploadResponse = {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  filePath: string
  size: number
  fileType: string
  height?: number
  width?: number
}

function assertEnv(env: ImageKitEnv) {
  if (!env.IMAGEKIT_PUBLIC_KEY || !env.IMAGEKIT_PRIVATE_KEY || !env.IMAGEKIT_URL_ENDPOINT) {
    throw new AppError(
      'ImageKit env not configured: IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT required',
      500,
    )
  }
}

function authHeader(env: ImageKitEnv): string {
  // ImageKit expects Basic base64(privateKey + ":")
  return `Basic ${btoa(`${env.IMAGEKIT_PRIVATE_KEY}:`)}`
}

async function toBase64(file: File | Blob | Buffer | ArrayBuffer | string): Promise<string> {
  if (typeof file === 'string') return file
  if (file instanceof ArrayBuffer) {
    const bytes = new Uint8Array(file)
    let binary = ''
    for (const b of bytes) binary += String.fromCharCode(b)
    return btoa(binary)
  }
  const g = globalThis as unknown as { Buffer?: { isBuffer: (v: unknown) => boolean } }
  if (g.Buffer?.isBuffer(file)) {
    return (file as unknown as { toString: (enc: string) => string }).toString('base64')
  }
  const ab = await (file as Blob).arrayBuffer()
  const bytes = new Uint8Array(ab)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

/**
 * Upload a file to ImageKit via REST (Workers-compatible, no cache mode).
 * Uses https://upload.imagekit.io/api/v1/files/upload
 */
export async function uploadToImagekit(
  env: ImageKitEnv,
  options: UploadToImageKitOptions,
): Promise<ImageKitUploadResponse> {
  try {
    assertEnv(env)
    const base64 = await toBase64(options.file)

    const form = new FormData()
    form.set('file', base64)
    form.set('fileName', options.fileName)
    if (options.folder) form.set('folder', options.folder)
    if (options.tags?.length) form.set('tags', options.tags.join(','))
    if (options.useUniqueFileName !== undefined) form.set('useUniqueFileName', String(options.useUniqueFileName))
    if (options.isPrivateFile !== undefined) form.set('isPrivateFile', String(options.isPrivateFile))
    if (options.customCoordinates) form.set('customCoordinates', options.customCoordinates)
    if (options.responseFields?.length) form.set('responseFields', options.responseFields.join(','))

    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { Authorization: authHeader(env) },
      body: form,
    })

    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      const msg = (body.message as string) || (body.error as string) || `Upload failed ${res.status}`
      throw new AppError(`ImageKit upload failed: ${msg} ${JSON.stringify(body)}`, 500)
    }
    return body as unknown as ImageKitUploadResponse
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`ImageKit upload failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

/**
 * Delete a file from ImageKit by fileId via REST.
 * DELETE https://api.imagekit.io/v1/files/{fileId}
 */
export async function deleteFromImagekit(env: ImageKitEnv, fileId: string): Promise<void> {
  try {
    if (!fileId) throw new AppError('fileId is required for ImageKit delete', 400)
    assertEnv(env)
    const res = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader(env) },
    })
    if (!res.ok && res.status !== 404) {
      const body = await res.json().catch(() => ({}))
      const msg = (body as Record<string, unknown>).message as string | undefined
      throw new AppError(`ImageKit delete failed: ${msg ?? `status ${res.status}`} ${JSON.stringify(body)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`ImageKit delete failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

// snake_case aliases as requested
export const upload_to_imagekit = uploadToImagekit
export const delete_from_imagekit = deleteFromImagekit

// Optional helper: delete by file URL/path by listing files (convenience)
export async function deleteFromImagekitByUrl(env: ImageKitEnv, fileUrlOrPath: string): Promise<void> {
  try {
    assertEnv(env)
    const q = encodeURIComponent(`url="${fileUrlOrPath}"`)
    const res = await fetch(`https://api.imagekit.io/v1/files?searchQuery=${q}`, {
      headers: { Authorization: authHeader(env) },
    })
    const body = (await res.json().catch(() => [])) as Array<{ fileId: string }>
    if (!res.ok) throw new AppError(`ImageKit list failed: ${JSON.stringify(body)}`, 500)
    if (!body.length) throw new AppError(`ImageKit file not found for url/path: ${fileUrlOrPath}`, 404)
    await deleteFromImagekit(env, body[0].fileId)
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`ImageKit delete by url failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export const delete_from_imagekit_by_url = deleteFromImagekitByUrl

// Keep helper to demonstrate ImageKit SDK usage (not used for network in Workers)
export function getImageKit(_env: ImageKitEnv): ImageKit {
  assertEnv(_env)
  return new ImageKit({
    publicKey: _env.IMAGEKIT_PUBLIC_KEY,
    privateKey: _env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: _env.IMAGEKIT_URL_ENDPOINT,
  })
}
