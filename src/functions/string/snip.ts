export interface SnipConfig {
  ellipsis?: boolean;
}

export function snip(
  text: string,
  maxLength: number,
  { ellipsis }: SnipConfig = {}
): string {
  if (text.length <= maxLength) {
    return text;
  }

  ellipsis = ellipsis ?? true;
  return text.slice(0, maxLength - ((ellipsis) ? 3 : 0)) + ((ellipsis) ? '...' : '');
}
