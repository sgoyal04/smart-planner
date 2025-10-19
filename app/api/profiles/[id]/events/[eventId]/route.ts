import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";

{/* edit an existing event. */}

export async function PUT(request:Request, {params}: {params:{id:string, eventId:string}}){
    const session = await getServerSession(authOptions);
    const resolvedParams = await params; 
    const profileId = resolvedParams.id;
    const eventId = resolvedParams.eventId;

    // Throw error if no profile id provided
    if(!profileId){
        return NextResponse.json({error:"Profile id not provided"}, {status: 400});
    }

    // Security access for the user information
    if(!session?.user?.id){
        return NextResponse.json({error: "Unathorized"}, {status: 401});
    }

    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({ error: "Unsupported content type, JSON required" }, { status: 415 });
    }
    
    const body = await request.json();
    const { name, startTime, endTime, notes } = body;

    // Validate event data
    if (!name || !startTime || !endTime) {
        return NextResponse.json({ error: "Event name, start time and end time are required" }, { status: 400 });
    }

    // Update the event in the database
    const updatedEvent = await prisma.event.update({
        where: {
            id: eventId,
            profileId: profileId,
        },
        data: {
            name,
            startTime,
            endTime,
            notes,
        },
    });

    return NextResponse.json({ event: updatedEvent });
}