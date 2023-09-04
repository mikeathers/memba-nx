export const setItemInLocalStorage = <T>(key: string, value: T) => {
  if (window.localStorage) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getItemFromLocalStorage = <T>(key: string) => {
  if (window.localStorage) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(localStorage.getItem(key) ?? '') as T
  }
}

export const removeItemFromLocalStorage = (key: string) => {
  if (window.localStorage) {
    localStorage.removeItem(key)
  }
}
