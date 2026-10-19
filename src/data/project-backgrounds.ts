export const PROJECT_BACKGROUNDS = [
  "/HJUL-0JboAA2B8I.jpeg",
  "/HLbcCm8aAAAnUyI.jpeg",
  "/HNCBjr9bYAAuV4U.jpeg",
  "/HJUL-mJaoAAKXRV.jpeg",
  "/HNCBkbHbQAAp-ul.jpeg",
  "/HLbcCm_aIAAPi5Q.jpeg",
  "/HJUWQshawAAP9BA.jpeg",
  "/HLbcCoNaEAEZRe8.jpeg",
  "/HNCBlcjaYAAnRhz.jpeg",
  "/HJUWXpUbYAAvEK7.jpeg",
  "/HLbcEOeaUAAFkMt.jpeg",
  "/HNCBoh7bIAAlVCE.jpeg",
] as const;

export function backgroundFor(key: string) {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return PROJECT_BACKGROUNDS[Math.abs(hash) % PROJECT_BACKGROUNDS.length];
}
