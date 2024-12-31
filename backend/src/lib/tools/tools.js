export const getWeather = async ({ location }) => {
    return {
      location,
      temperature: 25,
    }
  }


export const createDoc = async ({ title, kind }) => {
  const id = generateUUID()
}