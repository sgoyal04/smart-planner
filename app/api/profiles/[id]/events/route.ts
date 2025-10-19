import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";

{/* get, add events to a given profile */}

export async function GET(request: Request, {params}: {params: {id:string}}){
    const session = await getServerSession(authOptions);
    const resolvedParams = await params; 
    const profileId = resolvedParams.id;
    // const profileId = params.id;

    // Throw error if no profile id provided
    if(!profileId){
        return NextResponse.json({error:"Profile id not provided"}, {status: 400});
    }

    // Security access for the user information
    if(!session?.user?.id){
        return NextResponse.json({error: "Unathorized"}, {status: 401});
    }


    //Exrtact profile 
    const profile = await prisma.profile.findFirst({
        where: {
            id: profileId,
            userId: session.user.id
        },
        include: {
            events: {
                orderBy: {startTime: 'asc'}
            }
        }
    });

    //If profile does not exist, throw error
    if(!profile){
        return NextResponse.json({error: "Profile does not exist"}, {status: 404})
    }

    return NextResponse.json({events: profile.events ?? []})

}

export async function POST(request: Request, {params}: {params:{id:string}}){
    const session = await getServerSession(authOptions);
    const resolvedParams = await params; 
    const profileId = resolvedParams.id;
    // const profileId = params.id;

    // Throw error if no profile id provided
    if(!profileId){
        return NextResponse.json({error:"Profile id not provided"}, {status: 400});
    }

    // Security access for the user information
    if(!session?.user?.id){
        return NextResponse.json({error: "Unathorized"}, {status: 401});
    }
    
    if(request.headers.get("content-type") !== "application/json"){
        return NextResponse.json({ error: "Unsupported content type, JSON required" }, { status: 415 });
    }

    const body = await request.json();
    const {name, startTime, endTime, notes} = body;
    if(!name?.trim() || !startTime || !endTime){
        return NextResponse.json({error:"Fill all required fields."}, {status: 400});
    }
    if(new Date(startTime) >= new Date(endTime)){
        return NextResponse.json({error: "Start Time should be before End Time."}, {status:400});
    }
    try{
        const event = await prisma.event.create({
            data:{
                name:name.trim(),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes: notes || "",
                profileId: profileId
            }
        });
        return NextResponse.json({event});
    }
    catch(error){
        console.error('Database error:', error);
        return NextResponse.json({error: "Failed to create event."}, {status:500});
    }
}