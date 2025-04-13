export function contactLinksValidator(value) {
  const field = "contactLinks";

  const data = validateJSONFormat(value, field);
  validateArrayType(data, field);

  data.forEach((item, index) => {
    if (typeof item.platform != "string")
      throwItemFieldError(field, index, "platform");
    if (typeof item.link != "string")
      throwItemFieldError(field, index, "link");
  });

  return true;
}

export function experienceValidator(value) {
  const field = "experience";
  const data = validateJSONFormat(value, field);
  validateArrayType(data, field);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  data.forEach((item, index) => {
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
  const field = "skills";
  const data = validateJSONFormat(value, field);
  validateArrayType(data, field);

  data.forEach((item, index) => {
    if (typeof item != "string")
      throw new Error(`La habilidad en la posición ${index} no es de tipo string`);
  });

  return true;
}

export function educationValidator(value) {
  const field = "education";
  const data = validateJSONFormat(value, field);
  validateArrayType(data, field);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  data.forEach((item, index) => {
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
 * Interpreta el JSON en la cadena de entrada en caso de ser válido
 * o lanza un error en caso de ser incorrecto.
 * @param value Valor a probar como formato JSON.
 * @param field Campo que está siendo validado.
 */
function validateJSONFormat(value: string, field: string) {
  try {
    return JSON.parse(value);
  }
  catch(err) {
    throw new Error(`Se debe pasar un arreglo JSON para el campo '${field}'`);
  }
}

/**
 * Verifica que el tipo de dato de la entrada sea un array,
 * y lanza un error en caso de que no sea así.
 * @param data Datos a probar como arreglo.
 * @param field Campo que está siendo validado.
 */
function validateArrayType(data, field: string) {
  if (!Array.isArray(data)) {
    throw new Error(`Se debe pasar un arreglo JSON para el campo '${field}'`);
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