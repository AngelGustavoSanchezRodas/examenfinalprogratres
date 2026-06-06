import { NextResponse } from "next/server";
import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  server: process.env.DB_SERVER!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pool = await sql.connect(sqlConfig);
    // Asumimos que la primera columna es un ID o que hay una columna que indica el orden cronológico.
    // Usaremos "ORDER BY 1 ASC" como método genérico para ordenar por la primera columna si no conocemos la fecha exacta.
    // Idealmente, se debe ordenar por una columna como "Fecha_Hora" o "Id".
    const result = await pool.request().query(`
      SELECT * 
      FROM [dbo].[Chat_Mensaje] 
      ORDER BY 1 ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
