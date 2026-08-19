const STORAGE_KEY = "financialGoals";

function getGoals() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveGoals(goals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

document.getElementById("addGoalBtn").addEventListener("click", () => {
    const name = document.getElementById("goalName").value.trim();
    const target = parseFloat(document.getElementById("goalTarget").value);
    const current = parseFloat(document.getElementById("goalCurrent").value) || 0;
    const deadline = document.getElementById("goalDeadline").value;

    const errorMsg = document.getElementById("errorMsg");

    if (!name || !target || target <= 0) {
        errorMsg.textContent =
            "Enter at least a goal name and target amount.";
        errorMsg.style.display = "block";
        return;
    }

    errorMsg.style.display = "none";

    const goals = getGoals();

    goals.push({
        id: Date.now(),
        name,
        target,
        current,
        deadline
    });

    saveGoals(goals);

    document.getElementById("goalName").value = "";
    document.getElementById("goalTarget").value = "";
    document.getElementById("goalCurrent").value = "";
    document.getElementById("goalDeadline").value = "";

    renderGoals();
});

function removeGoal(id) {
    const goals = getGoals().filter(goal => goal.id !== id);

    saveGoals(goals);
    renderGoals();
}

function updateProgress(id, newAmount) {
    const goals = getGoals();

    const goal = goals.find(goal => goal.id === id);

    if (goal) {
        goal.current = parseFloat(newAmount) || 0;

        saveGoals(goals);
        renderGoals();
    }
}

function daysLeft(deadline) {
    if (!deadline) {
        return null;
    }

    const diff = new Date(deadline) - new Date();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderGoals() {
    const goals = getGoals();

    const list = document.getElementById("goalsList");

    list.innerHTML = "";

    if (goals.length === 0) {
        list.innerHTML =
            '<p style="color:#888;">No goals yet. Add one above.</p>';
        return;
    }

    goals.forEach(goal => {

        const pct = Math.min(
            (goal.current / goal.target) * 100,
            100
        ).toFixed(1);

        const remaining = goal.target - goal.current;

        const days = daysLeft(goal.deadline);

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>${goal.name}</h3>

                <button
                    onclick="removeGoal(${goal.id})"
                    style="background:var(--danger); color:#fff; padding:4px 8px; font-size:12px;"
                >
                    Remove
                </button>
            </div>

            <p>
                $${goal.current.toFixed(2)}
                of
                $${goal.target.toFixed(2)}
                (${pct}%)
            </p>

            <div
                style="
                    background:#2a2e3f;
                    border-radius:4px;
                    height:10px;
                    margin:8px 0;
                "
            >
                <div
                    style="
                        background:${pct >= 100 ? "var(--accent)" : "#3b82f6"};
                        width:${pct}%;
                        height:100%;
                        border-radius:4px;
                    "
                ></div>
            </div>

            <p style="font-size:13px; color:#888;">
                ${
                    remaining > 0
                        ? `$${remaining.toFixed(2)} remaining`
                        : "Goal reached! 🎉"
                }

                ${
                    days !== null
                        ? ` · ${days >= 0 ? days + " days left" : "deadline passed"}`
                        : ""
                }
            </p>

            <div style="margin-top:8px; display:flex; gap:6px;">

                <input
                    type="number"
                    placeholder="Update saved amount"
                    id="update-${goal.id}"
                    style="flex:1;"
                >

                <button
                    onclick="updateProgress(
                        ${goal.id},
                        document.getElementById('update-${goal.id}').value
                    )"
                >
                    Update
                </button>

            </div>
        `;

        list.appendChild(card);
    });
}

renderGoals();