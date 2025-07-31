import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from 'next-auth'
import {prisma} from "@/lib/prisma"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions : NextAuthOptions = {
    
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_SECRET,
        })
    ],
    
    session:{
        strategy: "jwt",
        maxAge: 5 * 60 * 60,    // 5 hours
        updateAge: 0,            // Always update the database
    },
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                throw new Error('No profile')
            }
            await prisma.user.upsert({
                where: {
                email: profile.email,
                },
                create: {
                email: profile.email,
                name: profile.name,
                },
                update: {
                name: profile.name,
                },
            })
            return true
        },
        
        async session({ session, token }:any) {
            if (token?.id && session.user) {
                // Add the user ID from the token to the session object
                session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user, account, profile }) {
            // replace token id with db generatd user id for the user
            if (profile) {
                const user = await prisma.user.findUnique({
                where: {
                    email: profile.email,
                },
                })
                if (!user) {
                throw new Error('No user found')
                }
                token.id = user.id
            }
            return token
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }