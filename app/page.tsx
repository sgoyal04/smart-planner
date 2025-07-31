import Toolbar from "@/components/Toolbar";

export default function Home() {
  return (
    <div>
      <Toolbar />
      <main className="flex items-center justify-center min-h-screen -mt-16">
        <h1 className="text-center text-4xl md:text-6xl font-bold">
          Stay Organized with Smart Planner
        </h1>
      </main>
    </div>
  );
}
