import { createPool, Pool } from 'mysql2';
import ParameterizedQuery from './ParameterizedQuery';
import { promisify } from 'util';

const baselog = '[mysql]';
let pool;

const init = () => {
  const subBaselog = `${baselog}[init]`;

  try {
    pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.PORT),
    });

    console.log(`${subBaselog} Connection success`);
  } catch (e) {
    console.error(`${subBaselog} ❌ ERROR: ${e}`);
    throw new Error('Failed to initialized pool');
  }
};
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


/**
 * @param {string} query - Provide a valid SQL query
 * @param {string[] | Object} params - Provide the parameterized values used
 * in the query
 */
export const executeQuery = (query, params) : Promise<any> => {
  const subBaselog = `💻 🡪 ${baselog}[execute]`;

  try {
    if (!pool)
      init();

    console.log(`${subBaselog} query`, query);
    console.log(`${subBaselog} params`, params);

    return new Promise((resolve, reject) => {
      pool.query(query, params, (e, results) => {
        if (e) reject(e);
        else resolve(results);
      });
    });

  } catch (e) {
    console.error(`${subBaselog} ❌ ERROR: ${e}`);
    throw new Error('Failed to execute MySQL query');
  }
};
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * Ejecuta una serie de queries parametrizadas provistas como argumento en una sola
 * transacción SQL que hará rollback si una query falla.
 * @param parameterizedQueries Serie de queries a ejecutar.
 */
export const executeTransaction = async (parameterizedQueries: ParameterizedQuery[]) => {
  const subBaselog = `💻 🡪 ${baselog}[execute]`;
  let connection;

  try {
    if (!pool)
      init();
    const getConnection = promisify(pool.getConnection).bind(pool);

    connection = await getConnection();
  }
  catch (err) {
    console.error(`${subBaselog} ❌ ERROR: ${err}`);
    throw new Error('Failed to execute MySQL transaction');
  }

  const beginTransaction = promisify(connection.beginTransaction).bind(connection);
  const query = promisify(connection.query).bind(connection);
  const commit = promisify(connection.commit).bind(connection);
  const rollback = promisify(connection.rollback).bind(connection);

  try {
    await beginTransaction();
    console.log(`${subBaselog} transaction started`);

    for (const pq of parameterizedQueries) {
      console.log(`${subBaselog} query`, pq.query);
      console.log(`${subBaselog} params`, pq.params);
      await query(pq.query, pq.params);
    }

    await commit();
    console.log(`${subBaselog} transaction committed`);
  }
  catch (err) {
    await rollback();
    console.log(`${subBaselog} transaction rolled back`);
    console.error(`${subBaselog} ❌ ERROR: ${err}`);
    throw new Error('Failed to execute MySQL transaction');
  }
  finally {
    connection.release();
  }
}

// Cierre de las conexiones a BD cuando se interrumpe el proceso del server.
process.on("SIGINT", async() => {
  console.log("Cerrando conexiones MySQL");
  if (pool) {
    await pool.end();
    console.log("Conexiones cerradas, terminando proceso");
  }
  else {
    console.log("No se detectaron conexiones, terminando proceso");
  }
  process.exit(0);
});