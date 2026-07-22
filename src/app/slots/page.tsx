"use client";

import { useEffect, useState } from "react";

export default function SlotsPage() {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        fetch("/api/slots")
            .then((res) => res.json())
            .then((data) => setSlots(data));
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Available Slots</h1>

            {slots.length === 0 ? (
                <p>No slots available</p>
            ) : (
                slots.map((slot: any) => (
                    <div
                        key={slot.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <p>
                            <strong>Provider:</strong> {slot.provider.name}
                        </p>

                        <p>
                            <strong>Start:</strong>{" "}
                            {new Date(slot.startTime).toLocaleString()}
                        </p>

                        <p>
                            <strong>End:</strong>{" "}
                            {new Date(slot.endTime).toLocaleString()}
                        </p>

                        <button>Book</button>
                    </div>
                ))
            )}
        </div>
    );
}