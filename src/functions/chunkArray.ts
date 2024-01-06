function chunkArray<T>(myArray: T[], chunkSize: number) {
  const results: T[][] = []

  while (myArray.length > 0) {
    results.push(myArray.splice(0, chunkSize))
  }

  return results
}

export default chunkArray
