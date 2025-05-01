import { generateUUID } from "../helpers/uuid";
import ParameterizedQuery from "./ParameterizedQuery";

/**
   * Método auxiliar para crear una query parametrizada enfocada a
   * borrar los registros de una tabla que tengan cierta referencia foránea.
   * @param table Tabla donde ser hará el borrado.
   * @param referenceName Nombre de la columna con referencia foránea.
   * @param referenceId Id de la referencia a considerar.
   * @returns Una ParameterizedQuery para el borrado deseado.
   */
  export function generateReferenceRecordsDeletionQuery(table, referenceName, referenceId) {
    return new ParameterizedQuery(
      `DELETE FROM ${table} WHERE ${referenceName} = ?`,
      [ referenceId ]
    );
  }

/**
   * Método auxiliar para generar una ParameterizedQuery adecuada para la inserción de
   * los datos contenidos en el JSON de entrada, para la tabla de BD indicada,
   * con la referencia dada y tomando las propiedades que se configuren por cada registro.
   * @param records Texto JSON o arreglo de objetos que contiene todos los registros a insertar.
   * @param table Tabla de la BD a la cual se hará la inserción.
   * @param referenceId Id del elemento al que referencia cada registro de esta colección.
   * @param getRecordProperties Callback que produzca una lista con las propiedades a incluir
   * por cada registro en el orden de columnas de la BD.
   * @returns Una ParameterizedQuery para la inserción de datos deseada.
   */
export function generateReferenceRecordsInsertionQuery(
  records: string | any[],
  table: string,
  referenceId: string,
  getRecordProperties: (listItem) => any[]
) {
  const recordsArray = Array.isArray(records) ? records : JSON.parse(records);
  let insertQuery = `INSERT INTO ${table} VALUES`;
  const insertParams = [];

  // Cada entrada de lista en el JSON se convertirá en un registro a insertar.
  for (const r of recordsArray) {
    // El primer parámetro de cada registro es un ID único.
    insertQuery += " (?, ";
    insertParams.push(generateUUID());

    // Por cada propiedad listada con el callback se agrega
    // un placeholder a la query de inserción y un parámetro a la lista.
    const properties = getRecordProperties(r);
    for (const p of properties) {
      insertQuery += "?, ";
      insertParams.push(p);
    }

    // El último parámetro de cada registro es la referencia involucrada.
    insertQuery += "?),";
    insertParams.push(referenceId);
  }

  insertQuery = insertQuery.substring(0, insertQuery.length - 1);
  return new ParameterizedQuery(insertQuery, insertParams);
}