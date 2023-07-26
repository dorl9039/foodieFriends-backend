import pool from './db';

export const validateRecord = async (table: string, idType: string, id: string) => {
    if (!Number(id)) {
        return {isValid: false, status: 400, message: `id ${id} is invalid`};
    };

    const result = await pool.query(`SELECT * FROM ${table} WHERE ${idType} = $1`, [id]);
    
    if (result.rows.length < 1) {
        return {isValid: false, status: 404, message: `${table} with id ${id} was not found`};
    };

    return {isValid: true, status: null, message: null}
};