import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    database: 'west_mart',
    user: 'root',
    password: '1111',
    connectionLimit: 5
});

export async function getUserList(): Promise<any> {
    let conn, rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query("SELECT * FROM user");
        return rows;
    } catch(err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}