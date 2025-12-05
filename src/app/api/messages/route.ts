import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Simple rate limiting store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(identifier);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count++;
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting per user
    if (!checkRateLimit(session.user.email)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Fetch all collaboration requests (messages), selecting only needed fields
    const messages = await prisma.collaborationRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(messages, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Don't leak error details
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
