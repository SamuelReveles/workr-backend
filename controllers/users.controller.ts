import { RowDataPacket } from "mysql2";
import { executeQuery } from "../database/connection";

export const pong = (req, res) => {
    return res.status(200).json('pong');
}

export const fetchInfo = async (req, res) => {
    const query = "SELECT * FROM Users"
    const results: RowDataPacket[] = await executeQuery(query, null)
    console.log(results)

    return res.status(200).json("correct request");
}