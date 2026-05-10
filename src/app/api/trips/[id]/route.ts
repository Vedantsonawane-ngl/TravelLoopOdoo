import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tripId = params.id;

    // Verify ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { user: true }
    });

    if (!trip || trip.user.email !== session.user.email) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    // Delete the trip
    await prisma.trip.delete({
      where: { id: tripId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Trip Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
