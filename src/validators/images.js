export function validateImages(input) {
  const validationErrors = {}

  if (!('title' in input) || input['title'].length == 0) {
    validationErrors['title'] = 'Add a title for your image'
  }

  if (!('description' in input) || input['description'].length == 0) {
    validationErrors['description'] = 'Add a description for your image'
  }

  if (!('price' in input) || input['price'].length == 0 ) {
    validationErrors['price'] = 'Add a price tag'
  }

  if (isNaN(input['price'])) {
    validationErrors['price'] = 'Price need to be in numbers';
  }
  return validationErrors
}