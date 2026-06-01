import { getProjectContent } from "@/lib/projects";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const md = await getProjectContent(slug);
  return NextResponse.json({ slug, md });
}
