const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.ogg'];

export function isVideoSrc(src: string): boolean {
  const lower = src.toLowerCase();
  return VIDEO_EXTS.some((ext) => lower.endsWith(ext));
}
