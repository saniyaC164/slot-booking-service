"use client";

import { useState } from "react";

export default function ProviderPage() {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    async function createSlot() {
        const providerId = prompt("Provider ID");

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
        } else {
            alert("Failed");
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Create Slot</h1>

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
        </div>
    );
}