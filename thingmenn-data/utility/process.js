export function getProcessArguments(defaultItems) {
  const config = {}

  if (process.argv.length > 3) {
    const customItems = process.argv.slice(2, process.argv.length)
    customItems.forEach((item) => (config[item] = true))
  } else {
    defaultItems.forEach((item) => (config[item] = true))
  }

  return config
}
