import fs from "fs/promises";
import path from "path";

const CATALOGUE_NAME = "ADICON Broucher.pdf";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const filePath = path.join(process.cwd(), CATALOGUE_NAME);
  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${CATALOGUE_NAME}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Catalogue file not found.", { status: 404 });
  }
}
