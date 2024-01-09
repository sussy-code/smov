const allowedExtensionVersion = ["0.0.1"];

export function isAllowedExtensionVersion(version: string): boolean {
  return allowedExtensionVersion.includes(version);
}
