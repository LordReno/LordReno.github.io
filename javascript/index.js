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

    // Wait for typing to finish, then pause, then delete
    setTimeout(() => {
        typingElement.style.animation = 'none';
        void typingElement.offsetWidth;

        typingElement.style.animation = `deleting 2s steps(${text.length}, end) forwards, blink 0.7s step-end infinite`;

        setTimeout(() => {
            index = (index + 1) % professions.length;
            animateText(professions[index]);
        }, 2000); // Wait for delete to complete

    }, 4000); // 3s typing + 1s pause
}

if (timelineRoot) {
    const cardsWrap = timelineRoot.querySelector(".career-timeline__cards");
    const ticksWrap = timelineRoot.querySelector("#timelineTicks");
    const rail = timelineRoot.querySelector(".career-timeline__rail");
    const cards = [...timelineRoot.querySelectorAll(".career-card")];

    const monthValue = (raw) => {
        if (!raw || raw.toLowerCase() === "present") {
            const now = new Date();
            return now.getFullYear() * 12 + now.getMonth();
        }
        const [year, month] = raw.split("-").map(Number);
        return year * 12 + (month - 1);
    };

    const minMonth = Math.min(...cards.map((card) => monthValue(card.dataset.start)));
    const maxMonth = Math.max(...cards.map((card) => monthValue(card.dataset.end)));
    const totalMonths = Math.max(maxMonth - minMonth + 1, 1);
    const pxPerMonth = 34;
    const CARD_GAP = 12;    // minimum pixel gap between cards in the same lane
    const BOTTOM_PAD = 20;  // extra space at the bottom of the timeline
    const timelineHeight = Math.max(totalMonths * pxPerMonth, 900);

    // --- Compute raw top / height for every card ---
    const cardMeta = cards.map((card) => {
        const start = monthValue(card.dataset.start);
        const end   = monthValue(card.dataset.end);
        const top   = ((maxMonth - end) / totalMonths) * timelineHeight;
        const h     = Math.max(((end - start + 1) / totalMonths) * timelineHeight, 170);
        return { card, start, end, top, height: h, lane: Number(card.dataset.lane) };
    });

    // --- Per-lane collision resolution (push overlapping cards downward) ---
    [0, 1].forEach((lane) => {
        const lane_cards = cardMeta
            .filter((m) => m.lane === lane)
            .sort((a, b) => a.top - b.top);

        for (let i = 0; i < lane_cards.length - 1; i++) {
            const cur = lane_cards[i];
            const nxt = lane_cards[i + 1];
            const needed = cur.top + cur.height + CARD_GAP;
            if (nxt.top < needed) {
                nxt.top = needed;
            }
        }
    });

    // --- Grow container if any card now sticks out the bottom ---
    const maxBottom = Math.max(...cardMeta.map((m) => m.top + m.height));
    const finalHeight = Math.max(timelineHeight, maxBottom + BOTTOM_PAD);

    cardsWrap.style.minHeight = `${finalHeight}px`;
    rail.style.minHeight     = `${finalHeight}px`;

    // --- Apply positions and build segments ---
    cardMeta.forEach(({ card, top, height }) => {
        card.style.setProperty("--top",    `${top}px`);
        card.style.setProperty("--height", `${height}px`);

        const segment = document.createElement("div");
        segment.className = "timeline-segment";
        segment.style.top    = `${top}px`;
        segment.style.height = `${Math.max(height, 18)}px`;
        segment.style.setProperty("--accent", getComputedStyle(card).getPropertyValue("--accent"));
        ticksWrap.appendChild(segment);

        const toggleButton = card.querySelector(".career-card__toggle");

        const activate = () => {
            card.classList.add("is-active");
            segment.classList.add("is-active");
        };

        const deactivate = () => {
            if (!card.classList.contains("is-expanded")) {
                card.classList.remove("is-active");
                segment.classList.remove("is-active");
            }
        };

        const toggleExpand = () => {
            const isExpanded = card.classList.contains("is-expanded");

            cards.forEach((otherCard) => {
                otherCard.classList.remove("is-expanded");
                otherCard.classList.remove("is-active");
                const otherButton = otherCard.querySelector(".career-card__toggle");
                if (otherButton) otherButton.textContent = "More details";
            });

            [...ticksWrap.querySelectorAll(".timeline-segment")].forEach((seg) => {
                seg.classList.remove("is-active");
            });

            if (!isExpanded) {
                card.classList.add("is-expanded");
                card.classList.add("is-active");
                segment.classList.add("is-active");
                if (toggleButton) toggleButton.textContent = "Hide details";
            }
        };

        card.addEventListener("mouseenter", activate);
        card.addEventListener("mouseleave", deactivate);
        card.addEventListener("focusin", activate);
        card.addEventListener("focusout", deactivate);

        if (toggleButton) {
            toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();
                toggleExpand();
            });
        }

        card.addEventListener("click", (event) => {
            if (!event.target.closest(".career-card__toggle")) {
                toggleExpand();
            }
        });
    });

    const startYear = Math.floor(minMonth / 12);
    const endYear   = Math.floor(maxMonth / 12);

    for (let year = endYear; year >= startYear; year--) {
        const yearMonth = year * 12 + 11;
        const top = ((maxMonth - yearMonth) / totalMonths) * timelineHeight;

        if (top >= 0 && top <= finalHeight) {
            const tick = document.createElement("div");
            tick.className = "timeline-tick";
            tick.style.top = `${top}px`;
            tick.innerHTML = `<span>${year}</span>`;
            ticksWrap.appendChild(tick);
        }
    }
}

// Start the first animation
animateText(professions[index]);
