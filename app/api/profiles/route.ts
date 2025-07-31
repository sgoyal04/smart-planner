import {NextResponse} from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma} from "@/lib/prisma";

export async function GET(){
    const session = await getServerSession(authOptions);
    if (!session?.user?.email){
        return NextResponse.json({profiles: []}, {status: 401});
    }
    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
        include: {profiles: true},
    });
    return NextResponse.json({profiles: user?.profiles ?? []});
}

export async function POST(request: Request){
    const session = await getServerSession(authOptions);

    // If session, user or email does not exist, return an error.
    if (!session?.user?.email){
        return NextResponse.json({error: "Unauthorized"}, {status:401});
    }
    // Extract Profile name from request
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({ error: "Unsupported content type, JSON required" }, { status: 415 });
    }
    const body = await request.json();
    const name = body.name?.trim();
    if (!name) {
        return NextResponse.json({error: "Profile name required"}, {status: 400});
    }

    // Create a profile using user id from session
    const profile = await prisma.profile.create({
        data: {
            name,
            userId: session.user.id,
        },
    });
    return NextResponse.json({profile});
}

export async function DELETE(request: Request){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({error: "Unathorized"})
    }
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({ error: "Unsupported content type, JSON required" }, { status: 415 });
    }
    const body = await request.json();
    const profileId = body.id?.trim();
    const profile = await prisma.profile.findFirst(
        {where: {
            id:profileId,
            userId: session.user.id
        }}
    );
    if (!profile){
        return NextResponse.json({error: "Profile not found"}, {status: 404});
    }
    await prisma.profile.delete({
        where:{id:profileId}
    });
    return NextResponse.json({success:true});
}