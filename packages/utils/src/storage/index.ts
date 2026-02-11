export function makeUserStoragePrefix(userId: string): string {
  return `user-${userId}/`
}
