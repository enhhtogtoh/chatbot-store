import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keyword = body.keyword?.trim();

    if (!keyword) {
      return NextResponse.json(
        { message: "keyword шаардлагатай" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
          { brand: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } },
          { subcategory: { contains: keyword, mode: "insensitive" } },
          { tags: { has: keyword } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("POST /api/products/search error:", error);
    return NextResponse.json(
      { message: "Хайлт хийхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}