export const temperatureToDisplay = (language: string, temperature: number | undefined): number | undefined => {
  if (typeof temperature !== 'number') return undefined

  const converted = language === 'en' ? (temperature * 9) / 5 + 32 : temperature

  return Math.round(converted * 10) / 10
}
