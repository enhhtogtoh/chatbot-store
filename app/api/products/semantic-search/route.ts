import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";
import { pineconeIndex } from "../../../lib/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { message: "query шаардлагатай" },
        { status: 400 }
      );
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const vector = embeddingResponse.data[0].embedding;

    const result = await pineconeIndex.query({
      vector,
      topK: 10,
      includeMetadata: true,
    });

    return NextResponse.json(result.matches, { status: 200 });
  } catch (error) {
    console.error("POST /api/products/semantic-search error:", error);
    return NextResponse.json(
      { message: "Semantic search хийхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}