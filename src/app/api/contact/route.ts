import clientPromise from "@/lib/mongodb";

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const body: ContactBody = await req.json();
    const { name, email, message } = body;

    await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to save message" }), {
      status: 500,
    });
  }
}
