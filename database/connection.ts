import { createPool } from 'mysql2';

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