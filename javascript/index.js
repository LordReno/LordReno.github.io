const professions = ["Artificial Intelligence", "Computer Science", "Game Development", "Web Development", "Simulation"];
let index = 0;
const typingElement = document.getElementById('aboutProfession');

const timelineRoot = document.getElementById("careerTimeline");

function animateText(text) {
    const chWidth = `${text.length}ch`;

    typingElement.style.setProperty('--text-width', chWidth);
    typingElement.style.animation = 'none';
    void typingElement.offsetWidth;

    typingElement.textContent = text;
    typingElement.style.animation = `typing 3s steps(${text.length}, end) forwards, blink 0.7s step-end infinite`;

    setTimeout(() => {
        typingElement.style.animation = 'none';
        void typingElement.offsetWidth;

        typingElement.style.animation = `deleting 2s steps(${text.length}, end) forwards, blink 0.7s step-end infinite`;

        setTimeout(() => {
            index = (index + 1) % professions.length;
            animateText(professions[index]);
        }, 2000);

    }, 4000);
}

if (timelineRoot) {
    const cardsWrap = timelineRoot.querySelector(".career-timeline__cards");
    const ticksWrap = timelineRoot.querySelector("#timelineTicks");
    const rail      = timelineRoot.querySelector(".career-timeline__rail");
    const cards     = [...timelineRoot.querySelectorAll(".career-card")];

    const monthValue = (raw) => {
        if (!raw || raw.toLowerCase() === "present") {
            const now = new Date();
            return now.getFullYear() * 12 + now.getMonth();
        }
        const [year, month] = raw.split("-").map(Number);
        return year * 12 + (month - 1);
    };

    const minMonth    = Math.min(...cards.map((c) => monthValue(c.dataset.start)));
    const maxMonth    = Math.max(...cards.map((c) => monthValue(c.dataset.end)));
    const totalMonths = Math.max(maxMonth - minMonth + 1, 1);
    const pxPerMonth  = 34;
    const CARD_GAP    = 12;   // minimum px gap between cards in the same lane
    const BOTTOM_PAD  = 20;   // extra space below the last card
    const timelineHeight = Math.max(totalMonths * pxPerMonth, 900);

    // ── 1. Compute raw top / height for every card ──────────────────────────
    const cardMeta = cards.map((card) => {
        const start = monthValue(card.dataset.start);
        const end   = monthValue(card.dataset.end);
        const top   = ((maxMonth - end) / totalMonths) * timelineHeight;
        const h     = Math.max(((end - start + 1) / totalMonths) * timelineHeight, 170);
        return { card, start, end, top, height: h, lane: Number(card.dataset.lane) };
    });

    // ── 2. Set CSS order for mobile (newest first) ───────────────────────────
    cardMeta.forEach((m) => {
        m.card.style.setProperty("--mobile-order", String(maxMonth - m.start));
    });

    // ── 3. Per-lane collision resolution (push overlapping cards downward) ───
    [0, 1].forEach((lane) => {
        const lc = cardMeta
            .filter((m) => m.lane === lane)
            .sort((a, b) => a.top - b.top);

        for (let i = 0; i < lc.length - 1; i++) {
            const needed = lc[i].top + lc[i].height + CARD_GAP;
            if (lc[i + 1].top < needed) lc[i + 1].top = needed;
        }
    });

    // ── 4. Grow container to fit all pushed cards ────────────────────────────
    const maxBottom  = Math.max(...cardMeta.map((m) => m.top + m.height));
    const finalHeight = Math.max(timelineHeight, maxBottom + BOTTOM_PAD);

    cardsWrap.style.minHeight = `${finalHeight}px`;
    rail.style.minHeight      = `${finalHeight}px`;

    // ── 5. Apply positions + build coloured segments on the rail ────────────
    cardMeta.forEach(({ card, top, height }) => {
        card.style.setProperty("--top",    `${top}px`);
        card.style.setProperty("--height", `${height}px`);

        const segment = document.createElement("div");
        segment.className = "timeline-segment";
        segment.style.top    = `${top}px`;
        segment.style.height = `${Math.max(height, 18)}px`;
        segment.style.setProperty("--accent", getComputedStyle(card).getPropertyValue("--accent"));
        ticksWrap.appendChild(segment);

        const toggleBtn = card.querySelector(".career-card__toggle");

        const activate   = () => { card.classList.add("is-active");    segment.classList.add("is-active"); };
        const deactivate = () => { if (!card.classList.contains("is-expanded")) { card.classList.remove("is-active"); segment.classList.remove("is-active"); } };

        const toggleExpand = () => {
            const wasExpanded = card.classList.contains("is-expanded");

            cards.forEach((other) => {
                other.classList.remove("is-expanded", "is-active");
                const ob = other.querySelector(".career-card__toggle");
                if (ob) ob.textContent = "More details";
            });
            ticksWrap.querySelectorAll(".timeline-segment").forEach((s) => s.classList.remove("is-active"));

            if (!wasExpanded) {
                card.classList.add("is-expanded", "is-active");
                segment.classList.add("is-active");
                if (toggleBtn) toggleBtn.textContent = "Hide details";
            }
        };

        card.addEventListener("mouseenter", activate);
        card.addEventListener("mouseleave", deactivate);
        card.addEventListener("focusin",    activate);
        card.addEventListener("focusout",   deactivate);

        if (toggleBtn) {
            toggleBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleExpand(); });
        }
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".career-card__toggle")) toggleExpand();
        });
    });

    // ── 6. Year tick labels — anchored to the first card of each year ────────
    // (uses the POST-collision top values so labels stay aligned with their cards)
    const yearFirstTop = {};
    cardMeta.forEach(({ start, top }) => {
        const yr = Math.floor(start / 12);
        if (!(yr in yearFirstTop) || top < yearFirstTop[yr]) {
            yearFirstTop[yr] = top;
        }
    });

    Object.entries(yearFirstTop)
        .sort(([a], [b]) => Number(b) - Number(a))
        .forEach(([year, top]) => {
            const tick = document.createElement("div");
            tick.className = "timeline-tick";
            tick.style.top = `${top}px`;
            tick.innerHTML = `<span>${year}</span>`;
            ticksWrap.appendChild(tick);
        });
}

animateText(professions[index]);
