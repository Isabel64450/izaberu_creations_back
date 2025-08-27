import mysql from "mysql2/promise"


const getPool=()=>{
    const pool = mysql.createPool({
        host:process.env.MARIA_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DB,
        waitForConnections: true,
        connectionLimit:10,
        queueLimit:0,
    })
    return pool
    
}
export default getPool