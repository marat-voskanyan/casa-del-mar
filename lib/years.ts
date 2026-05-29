/**
 * Auto-incrementing years of experience.
 * Casa del Mar founding date: September 10, 2019.
 * Increments automatically every September 10.
 */

export function getYearsExperience(): number {
  const foundingDate = new Date('2019-09-10')
  const today        = new Date()

  let years = today.getFullYear() - foundingDate.getFullYear()

  // If we haven't yet reached September 10 this year, subtract 1
  const anniversaryThisYear = new Date(today.getFullYear(), 8, 10) // Month 8 = September
  if (today < anniversaryThisYear) {
    years -= 1
  }

  return Math.max(years, 1) // never go below 1
}

export function getYearsDisplay(): string {
  return `${getYearsExperience()}+`
}
