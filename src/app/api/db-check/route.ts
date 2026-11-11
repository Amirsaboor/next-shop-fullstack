import { connectToDatabase } from "@/lib/db/connect";

export async function GET() {
  try {
    await connectToDatabase();

    return Response.json({
      success: true,
      message: 'MongoDB connected successfully',
    });
  } catch (error) {
    console.error('Database connection failed:', error);

    return Response.json(
      {
        success: false,
        message: 'Database connection failed',
      },
      { status: 500 },
    );
  }
}
