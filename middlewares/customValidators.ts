export function contactLinksValidator(value) {
  const field = "contactLinks";
  const arrayData = validateJSONArray(value, field);

  arrayData.forEach((item, index) => {
    if (typeof item.platform != "string")
      throwItemFieldError(field, index, "platform");
    if (typeof item.link != "string")
      throwItemFieldError(field, index, "link");
  });

  return true;
}

export function experienceValidator(value) {
  const field = "experience";
  const arrayData = validateJSONArray(value, field);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  arrayData.forEach((item, index) => {
    if (typeof item.position != "string")
      throwItemFieldError(field, index, "position");
    if (typeof item.company != "string")
      throwItemFieldError(field, index, "company");
    if (typeof item.startDate != "string" || !dateRegex.test(item.startDate))
      throwItemFieldError(field, index, "startDate");
    if (typeof item.endDate != "string" || !dateRegex.test(item.endDate))
      throwItemFieldError(field, index, "endDate");
    if (typeof item.description != "string")
      throwItemFieldError(field, index, "description");
  })

  return true;
}

export function skillsValidator(value) {
  const arrayData = validateJSONArray(value, "skills");

  arrayData.forEach((item, index) => {
    if (typeof item != "string")
      throw new Error(`La habilidad en la posición ${index} no es de tipo string`);
  });

  return true;
}

export function educationValidator(value) {
  const field = "education";
  const arrayData = validateJSONArray(value, field);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  arrayData.forEach((item, index) => {
    if (typeof item.title != "string")
      throwItemFieldError(field, index, "title");
    if (typeof item.organization != "string")
      throwItemFieldError(field, index, "organization");
    if (typeof item.startDate != "string" || !dateRegex.test(item.startDate))
      throwItemFieldError(field, index, "startDate");
    if (typeof item.endDate != "string" || !dateRegex.test(item.endDate))
      throwItemFieldError(field, index, "endDate");
    if (typeof item.description != "string")
      throwItemFieldError(field, index, "description");
  });

  return true;
}

/**
 * Verifica que el tipo de dato de la entrada sea un array o la representación
 * en JSON de un array para parsearlo, lanza un error si no se detecta un array.
 * @param data Datos a probar como arreglo.
 * @param fieldName Nombre del campo que está siendo validado.
 * @returns Arreglo ya validado y parseado de ser necesario.
 * @throws Un error personalizado indicando tipo incorrecto en el campo involucrado.
 */
function validateJSONArray(data: any, fieldName: string) {
  if (Array.isArray(data)) {
    return data;
  }
  else {
    try {
      const arrayData = JSON.parse(data);
      if (Array.isArray(arrayData)) {
        return arrayData;
      }
      else {
        throw new Error();
      }
    }
    catch(err) {
      throw new Error(`Se debe pasar un arreglo JSON para el campo '${fieldName}'`);
    }
  }
}

/**
 * Lanza un error para un elemento de arreglo con el índice y campo indicados.
 * @param field Campo que está siendo validado en general.
 * @param index Índice del elemento de arreglo involucrado.
 * @param subfield Subcampo del elemento de arreglo con problemas.
 */
function throwItemFieldError(field: string, index:number, subfield: string) {
  throw new Error(`En el campo '${field}', el item en la posición '${index}' tiene un error en el subcampo '${subfield}'`);
}