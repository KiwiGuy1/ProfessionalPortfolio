import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactBody = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.collaborationRequest.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.collaborationRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
