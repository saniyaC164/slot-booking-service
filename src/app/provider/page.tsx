"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProviderPage() {
    const { data: session, status } = useSession();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    async function createSlot() {
        const providerId = session?.user?.id;

        if (!providerId) {
            alert("Not authenticated");
            return;
        }

        const res = await fetch("/api/slots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                providerId,
                startTime,
                endTime,
            }),
        });

        if (res.ok) {
            alert("Slot created");

            setStartTime("");
            setEndTime("");
        } else {
            const error = await res.json();
            alert(error.error || "Failed to create slot");
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Provider Dashboard</h1>

            <p>
                <strong>Status:</strong> {status}
            </p>

            <h2>Create Slot</h2>

            <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
            />

            <br />
            <br />

            <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
            />

            <br />
            <br />

            <button onClick={createSlot}>
                Create Slot
            </button>

            <hr style={{ margin: "2rem 0" }} />

            <h2>Current Session</h2>

            <pre
                style={{
                    background: "#f4f4f4",
                    padding: "1rem",
                    overflow: "auto",
                }}
            >
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    );
}