import { NextResponse } from "next/server";
import { getConnectionPool } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pool = await getConnectionPool();
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
