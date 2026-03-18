import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      distinct: ["category"],
      select: {
        category: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/categories error:", error);
    return Response.json(
      { message: "Category жагсаалт авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}