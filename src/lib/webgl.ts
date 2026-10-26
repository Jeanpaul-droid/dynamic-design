let cached: boolean | null = null;

export function supportsWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    cached = Boolean(gl);
  } catch {
    cached = false;
  }
  return cached;
}
