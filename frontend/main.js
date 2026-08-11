const BACKEND_URL = "http://localhost:5000";

async function checkBackend() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/health`);

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        document.getElementById("welcome-msg").textContent =
            `Backend says: ${data.message}`;

    } catch (err) {
        document.getElementById("welcome-msg").textContent =
            "Backend not reachable";

        console.error("Backend error:", err);
    }
}

checkBackend();