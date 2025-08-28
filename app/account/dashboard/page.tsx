'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import LeftToolbar from "@/components/LeftToolbar";
import Schedule from "@/components/Schedule";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [mainProfileId, setMainProfileId] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main content area with left sidebar and center content */}
      <div className="flex">
       
      <LeftToolbar selectedId={selectedProfileId} setSelectedId={setSelectedProfileId} setMainProfileId={setMainProfileId}/>
      <div className="h-screen w-screen">
        <Schedule selectedProfileId={selectedProfileId} mainProfileId={mainProfileId}/>
      </div>
      
        
      </div>
    </div>
  );
}