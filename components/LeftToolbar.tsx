'use client';

import { useEffect, useState, useRef } from "react";

export default function LeftToolbar({ selectedId, setSelectedId, setMainProfileId }: { selectedId: string, setSelectedId: (id: string) => void , setMainProfileId: (id:string) => void}) {
    const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [menuOpen, setMenuOpen] = useState<string | null>(null); // Track which menu is open
    const inputRef = useRef<HTMLInputElement>(null);

    {/* Fetch profiles once to display profiles. */}
    useEffect(() => {
        async function fetchProfiles() {
            const res = await fetch("/api/profiles");
            if (res.ok) {
                const data = await res.json();
                setProfiles(data.profiles);
                if (data.profiles.length && !selectedId) {
                    setSelectedId(data.profiles[0].id);
                    setMainProfileId(data.profiles[0].id);
                }
            }
            setLoading(false);
        }
        fetchProfiles();
    }, []);

    {/* Display the input field if user is creating a new profile. */}
    useEffect(() => {
        if (adding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [adding]);

    {/* Stop displaying the toggle menu after user click elsewhere on the page. */}
    useEffect(() => {
        if (!menuOpen) return;

        function handleClickOutside(event: MouseEvent) {
            setMenuOpen(null);
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    {/* Add profile and update the local profiles list */}
    async function handleAddProfile() {
        if (!newProfileName.trim()) return;
        const res = await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newProfileName })
        });
        if (res.ok) {
            const data = await res.json();
            setProfiles((prev) => [...prev, data.profile]);
            setSelectedId(data.profile.id);
            setNewProfileName("");
            setAdding(false);
        }
    }

    {/* Delete a profile and update the profiles list. */}
    async function handleDeleteProfile(profileId: string) {
        try{
            if (profiles.length <= 1) {
            alert("Cannot delete the last profile");
            return;
        }
            if (profiles[0].id == profileId){
                alert("You cannot delete the main profile.");
                return;
            }
            
            if (confirm("All the events of this profile will be deleted as well.\nAre you sure you want to delete this profile?")) {
                const res = await fetch(`/api/profiles`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id:profileId})
                });
                if (res.ok) {
                    setProfiles(prev => prev.filter(p => p.id !== profileId));
                    if (selectedId === profileId) {
                        const remaining = profiles.filter(p => p.id !== profileId);
                        if (remaining.length > 0) {
                            setSelectedId(remaining[0].id);
                        }
                    }   
                }
            }
        }
        finally{setMenuOpen(null);}
        
    }

    {/* When user press esc, cancel creating a new profile */}
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleAddProfile();
        } else if (e.key === "Escape") {
            setAdding(false);
            setNewProfileName("");
        }
    }

    if (loading) return <div>Loading profiles...</div>;

    return (
        <aside className="flex flex-col h-screen w-48 bg-white p-4 sticky top-0 border-r border-gray-200">
            <div className="mb-4 font-bold text-gray-800 text-lg">Profiles</div>
            <div className="flex-1 flex flex-col gap-0">
                {profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className={`group relative flex items-center justify-between px-3 py-3 transition border-b border-gray-100
                        ${selectedId === profile.id ? "bg-blue-100 font-semibold text-gray-900" : "hover:bg-blue-100 text-gray-800"}
                        `}
                    >
                        <span 
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedId(profile.id)}
                        >
                            {profile.name}
                        </span>
                        
                        {/* Three vertical dots */}
                        <div className="relative">
                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity text-gray-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(menuOpen === profile.id ? null : profile.id);
                                }}
                            >
                                &#8942;
                            </button>

                            {/* Dropdown menu */}
                            {menuOpen === profile.id && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-24">
                                    <button
                                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md text-sm"
                                        onClick={() => handleDeleteProfile(profile.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {/* Adding new profile menu */}
                {adding ? (
                    <input 
                        ref={inputRef}
                        className="px-3 py-2 outline-none bg-white text-gray-900 border-b border-gray-100"
                        value={newProfileName}
                        onChange={e => setNewProfileName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setAdding(false)}
                        placeholder="Profile Name"
                        maxLength={32}
                    />
                ) : (
                    <div 
                        className="cursor-pointer px-3 py-3 text-gray-500 hover:bg-blue-100 flex items-center border-b border-gray-100"
                        onClick={() => setAdding(true)}
                        title="Add Profile"
                    > 
                        <span className="text-xl font-bold">+</span>
                        <span className="text-sm ml-2">Add Profile</span>
                    </div>
                )}
            </div>
        </aside>
    );
}