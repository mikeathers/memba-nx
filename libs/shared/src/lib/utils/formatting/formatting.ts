export const sentenceCase = (input: string | null | undefined) => {
  if (!input) {
    return ''
  }

  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
}
