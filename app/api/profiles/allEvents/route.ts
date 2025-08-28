import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";

export async function GET(request: Request){
    const session = await getServerSession(authOptions);
    // Security access for the user information
    if(!session?.user?.id){
        return NextResponse.json({error: "Unathorized"}, {status: 401});
    }

    const events = await prisma.event.findMany({
        where:{
            Profile:{
                userId: session.user.id,
            },
        },
        orderBy: {startTime:"asc"},
    });
    return NextResponse.json({events});
}