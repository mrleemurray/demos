export function collectionShortcutIndex(event) {
  if (event.defaultPrevented || !event.ctrlKey || !event.altKey || event.metaKey || event.shiftKey ||
    event.isComposing || event.getModifierState?.('AltGraph')) return -1
  const digit = /^Digit[1-9]$/.test(event.code) ? event.code.slice(-1) : event.key
  return /^[1-9]$/.test(digit) ? Number(digit) - 1 : -1
}
