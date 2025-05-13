"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = exports.executeQuery = void 0;
const mysql2_1 = require("mysql2");
const util_1 = require("util");
const baselog = '[mysql]';
let pool;
const init = () => {
    const subBaselog = `${baselog}[init]`;
    try {
        pool = (0, mysql2_1.createPool)({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.PORT),
        });
        console.log(`${subBaselog} Connection success`);
    }
    catch (e) {
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
const executeQuery = (query, params) => {
    const subBaselog = `💻 🡪 ${baselog}[execute]`;
    try {
        if (!pool)
            init();
        console.log(`${subBaselog} query`, query);
        console.log(`${subBaselog} params`, params);
        return new Promise((resolve, reject) => {
            pool.query(query, params, (e, results) => {
                if (e)
                    reject(e);
                else
                    resolve(results);
            });
        });
    }
    catch (e) {
        console.error(`${subBaselog} ❌ ERROR: ${e}`);
        throw new Error('Failed to execute MySQL query');
    }
};
exports.executeQuery = executeQuery;
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * Ejecuta una serie de queries parametrizadas provistas como argumento en una sola
 * transacción SQL que hará rollback si una query falla.
 * @param parameterizedQueries Serie de queries a ejecutar.
 */
const executeTransaction = (parameterizedQueries) => __awaiter(void 0, void 0, void 0, function* () {
    const subBaselog = `💻 🡪 ${baselog}[execute]`;
    let connection;
    try {
        if (!pool)
            init();
        const getConnection = (0, util_1.promisify)(pool.getConnection).bind(pool);
        connection = yield getConnection();
    }
    catch (err) {
        console.error(`${subBaselog} ❌ ERROR: ${err}`);
        throw new Error('Failed to execute MySQL transaction');
    }
    const beginTransaction = (0, util_1.promisify)(connection.beginTransaction).bind(connection);
    const query = (0, util_1.promisify)(connection.query).bind(connection);
    const commit = (0, util_1.promisify)(connection.commit).bind(connection);
    const rollback = (0, util_1.promisify)(connection.rollback).bind(connection);
    try {
        yield beginTransaction();
        console.log(`${subBaselog} transaction started`);
        for (const pq of parameterizedQueries) {
            console.log(`${subBaselog} query`, pq.query);
            console.log(`${subBaselog} params`, pq.params);
            yield query(pq.query, pq.params);
        }
        yield commit();
        console.log(`${subBaselog} transaction committed`);
    }
    catch (err) {
        yield rollback();
        console.log(`${subBaselog} transaction rolled back`);
        console.error(`${subBaselog} ❌ ERROR: ${err}`);
        throw new Error('Failed to execute MySQL transaction');
    }
    finally {
        connection.release();
    }
});
exports.executeTransaction = executeTransaction;
// Cierre de las conexiones a BD cuando se interrumpe el proceso del server.
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cerrando conexiones MySQL");
    if (pool) {
        yield pool.end();
        console.log("Conexiones cerradas, terminando proceso");
    }
    else {
        console.log("No se detectaron conexiones, terminando proceso");
    }
    process.exit(0);
}));
//# sourceMappingURL=connection.js.map