export function damp(
  current: number,
  target: number,
  smoothing: number,
  delta: number
) {
  return current + (target - current) * (1 - Math.exp(-smoothing * delta));
}
