function getFormData(object) {
  const formData = new FormData()
  Object.keys(object).forEach((key) => formData.append(key, object[key]))
  return formData
}

/**
 * @param {Array[any]} terms
 */
function findOneMatch(terms, f) {
  let result
  for (const term of terms) {
    result = f(term)
    if (result) {
      break
    }
  }
  return result
}
module.exports = { getFormData, findOneMatch }
