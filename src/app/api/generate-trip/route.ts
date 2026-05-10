import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// A list of generic, high-quality activities to randomly pull from
const GENERIC_ACTIVITIES = [
  { title: "Explore the Historic Downtown", category: "Sightseeing", description: "Walk through the main plaza, admire the architecture, and take photos of iconic landmarks." },
  { title: "Dine at a Top-Rated Local Restaurant", category: "Food", description: "Experience authentic local cuisine and signature dishes." },
  { title: "Visit the Central Museum", category: "Activity", description: "Spend a few hours learning about the local history, art, and culture." },
  { title: "Relaxing Park Walk", category: "Sightseeing", description: "Enjoy a scenic stroll through the city's largest botanical garden or public park." },
  { title: "Coffee & Pastry Break", category: "Food", description: "Stop by a highly recommended cafe for a quick recharge." },
  { title: "Check-in to Accommodation", category: "Accommodation", description: "Arrive at your perfectly located hotel and settle in." },
  { title: "Evening Entertainment", category: "Activity", description: "Enjoy a local show, live music, or vibrant nightlife." },
  { title: "Shopping in the Arts District", category: "Sightseeing", description: "Browse local boutiques, artisan shops, and markets." },
  { title: "Sunset Viewpoint", category: "Sightseeing", description: "Head to the best panoramic viewpoint in the city for golden hour." }
];

export async function POST(req: Request) {
  try {
    const { destination, duration = 3, budget = "Standard", style = "Balanced" } = await req.json();

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // --- MOCK AI GENERATOR LOGIC ---
    // Instead of calling Gemini (since the API key is missing), we dynamically build a template

    const parsedDuration = parseInt(duration) || 3;
    
    // Create 'parsedDuration' number of stops
    const mockStops = Array.from({ length: parsedDuration }).map((_, index) => {
      // Pick 3-4 random activities for each day
      const dailyActivities = [];
      const numActivities = Math.floor(Math.random() * 2) + 3; // 3 or 4
      
      for(let i=0; i < numActivities; i++) {
        const randomAct = GENERIC_ACTIVITIES[Math.floor(Math.random() * GENERIC_ACTIVITIES.length)];
        
        // Scale cost based on Budget preference
        let baseCost = Math.floor(Math.random() * 40) + 10;
        if (budget === "Luxury") baseCost *= 3;
        if (budget === "Economy") baseCost = Math.floor(baseCost * 0.4);

        dailyActivities.push({
          title: randomAct.title,
          description: randomAct.description,
          category: randomAct.category,
          cost: baseCost
        });
      }

      return {
        city: destination.split(',')[0].trim(), // Extract just the city name
        country: destination.includes(',') ? destination.split(',')[1].trim() : destination,
        order: index + 1,
        activities: dailyActivities
      };
    });

    const mockTripData = {
      title: `${parsedDuration}-Day ${style} Adventure in ${destination.split(',')[0]}`,
      description: `Experience the perfect ${budget.toLowerCase()} getaway with a highly curated ${style.toLowerCase()} itinerary in ${destination}.`,
      coverImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop",
      stops: mockStops
    };

    // --- END MOCK LOGIC ---

    // Calculate Dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parsedDuration);

    // Save to Database using Prisma
    const newTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: mockTripData.title,
        description: mockTripData.description,
        startDate,
        endDate,
        coverImage: mockTripData.coverImage,
        stops: {
          create: mockTripData.stops.map((stop: any, index: number) => ({
            city: stop.city || "Unknown City",
            country: stop.country || "Unknown Country",
            order: index + 1,
            activities: {
              create: stop.activities.map((act: any) => ({
                title: act.title || "Activity",
                description: act.description || "",
                category: act.category || "Sightseeing",
                cost: parseFloat(act.cost) || 0,
                startTime: new Date(), 
              }))
            }
          }))
        }
      },
      include: {
        stops: {
          include: {
            activities: true
          }
        }
      }
    });

    // Artificially delay for 2 seconds so the beautiful loading animation on the frontend can play
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({ success: true, tripId: newTrip.id });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    require('fs').appendFileSync('debug.log', new Date().toISOString() + '\n' + (error.stack || error.message) + '\n\n');
    return NextResponse.json(
      { error: error.message || "Failed to generate trip", details: error.stack },
      { status: 500 }
    );
  }
}
