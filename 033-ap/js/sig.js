const openYears = new Set(["1996", "1997", "1998"]);
const selectedYear = new URLSearchParams(window.location.search).get("year");
const puzzleFrame = document.querySelector("#if iframe");
const scoreSubmitModal = document.getElementById("score-submit-modal");
const scoreSubmitTime = document.getElementById("score-submit-time");
const scoreSubmitValue = document.getElementById("score-submit-value");
const scoreSubmitStatus = document.getElementById("score-submit-status");
let activePuzzle = null;
let scoreApiPromise = Promise.resolve(null);
let currentFirebaseUser = null;

$("#if").hide();

function toAmuseUid(firebaseUid) {
    const bytes = new TextEncoder().encode(firebaseUid);
    return crypto.subtle.digest("SHA-256", bytes).then((digest) =>
        Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
    );
}

function showYearPuzzle(amuseUid) {
    $("#list").hide();
    $("#if").show();

    const devanagariYear = Sanscript.t(selectedYear, "itrans", "devanagari");
    document.querySelector(".archive-heading-row h1.title").innerHTML =
        `${devanagariYear} <span class="archive-title-translation">(Volume)</span>`;

    const puzzleUrl = new URL("https://amuselabs.com/pmm/date-picker");
    puzzleUrl.searchParams.set("set", `sanskritbharatiusa-ap${selectedYear}`);
    puzzleUrl.searchParams.set("embed", "1");

    if (amuseUid) {
        puzzleUrl.searchParams.set("uid", amuseUid);
    }

    puzzleFrame.src = puzzleUrl.toString();
}

function formatTimeTaken(value) {
    if (value === undefined || value === null || value === "") return "Unavailable";
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) return "Unavailable";

    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

document.getElementById("score-submit-close").addEventListener("click", () => {
    scoreSubmitModal.hidden = true;
});

function setScoreSubmitStatus(message, status = "info") {
    scoreSubmitStatus.className = `zatam-game-status zatam-game-status-${status}`;
    scoreSubmitStatus.textContent = message;
}

function readAmuseMessage(message) {
    if (typeof message === "string") {
        try {
            return JSON.parse(message);
        } catch {
            return null;
        }
    }

    return message && typeof message === "object" ? message : null;
}

function parsePuzzleDate(value) {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value))) {
        const numericDate = Number(value);
        if (!Number.isFinite(numericDate)) return null;

        if (/^\d{8}$/.test(String(value))) {
            const year = Number(String(value).slice(0, 4));
            const month = Number(String(value).slice(4, 6)) - 1;
            const day = Number(String(value).slice(6, 8));
            const date = new Date(Date.UTC(year, month, day));
            return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day
                ? date
                : null;
        }

        const timestamp = numericDate < 100000000000 ? numericDate * 1000 : numericDate;
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
}

function getPuzzleLevel(data) {
    const puzzleId = data.id || activePuzzle?.id;
    const puzzleDate = parsePuzzleDate(data.date ?? activePuzzle?.date);
    if (!puzzleId || !puzzleDate) return null;

    const levelName = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(puzzleDate);

    return {
        levelId: String(puzzleId),
        levelName,
    };
}

function calculateLeaderboardScore(data) {
    const config = window.ANVISHYANTAM_SCORE_CONFIG;
    const hasAmuseScore = data.score !== undefined && data.score !== null && data.score !== "";
    const amuseScore = hasAmuseScore ? Number(data.score) : Number.NaN;
    const validAmuseScore = Number.isFinite(amuseScore) && amuseScore >= 0;
    const wordCompletionRatio = validAmuseScore
        ? Math.min(1, amuseScore / config.amuseScoreFullCreditThreshold)
        : 0;
    const wordScore = Math.round(config.wordCompletionMaxPoints * wordCompletionRatio);

    const timeTaken = Number(data.timeTaken);
    const timeBonus = Number.isFinite(timeTaken) && timeTaken >= 0 &&
        timeTaken < config.timeBonusThresholdSeconds
        ? Math.floor(
            (config.timeBonusThresholdSeconds - timeTaken) / config.timeBonusStepSeconds,
        ) * config.timeBonusPointsPerStep
        : 0;

    return {
        score: Math.min(config.maximumScore, wordScore + timeBonus),
        wordCompletionRatio,
        amuseScore: validAmuseScore ? amuseScore : null,
        wordScore,
        timeBonus,
    };
}

function isSameAmuseAttempt(metadata, entryKey, userUid, level, nativeScore, nativeTime, calculatedScore) {
    metadata = metadata || {};
    const sameScore = metadata.amuseCalculatedScore !== undefined
        ? Number(metadata.amuseCalculatedScore) === calculatedScore &&
            (!Number.isFinite(nativeScore) || Number(metadata.amuseNativeScore) === nativeScore)
        : Number.isFinite(nativeScore) && Number(metadata.amuseNativeScore) === nativeScore;

    return entryKey.includes(`_${userUid}_`) &&
        String(metadata.levelId || "") === level.levelId &&
        sameScore &&
        Number(metadata.amuseTimeTakenSeconds) === nativeTime;
}

async function reserveAmuseAttempt(userUid, level, nativeScore, nativeTime, calculatedScore) {
    const [{ db }, firestore] = await Promise.all([
        import("../../auth/api/firebase-config.js"),
        import("https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js"),
    ]);

    const signature = await toAmuseUid([
        userUid,
        level.levelId,
        Number.isFinite(nativeScore) ? nativeScore : "unavailable",
        nativeTime,
        calculatedScore,
    ].join("|"));
    const markerRef = firestore.doc(db, "leaderboards", "033-ap", "attemptDedupe", signature);

    const claim = await firestore.runTransaction(db, async (transaction) => {
        const marker = await transaction.get(markerRef);
        if (marker.exists()) {
            const markerData = marker.data();
            if (markerData.status === "submitted") return "duplicate";

            const ageMs = Date.now() - Number(markerData.createdAt || 0);
            if (ageMs < 120000) return "pending";
        }

        transaction.set(markerRef, {
            status: "pending",
            levelId: level.levelId,
            levelName: level.levelName,
            createdAt: Date.now(),
        });
        return "claimed";
    });

    return { claim, db, firestore, markerRef };
}

async function hasPriorMatchingSubmission(db, firestore, userUid, level, nativeScore, nativeTime, calculatedScore) {
    const history = await firestore.getDocs(
        firestore.collection(db, "leaderboards", "033-ap", "gameHistory"),
    );

    return history.docs.some((historyDoc) => {
        const attempts = historyDoc.data().attemptMeta || {};
        return Object.entries(attempts).some(([entryKey, metadata]) =>
            isSameAmuseAttempt(metadata, entryKey, userUid, level, nativeScore, nativeTime, calculatedScore),
        );
    });
}

async function markAmuseAttemptSubmitted(firestore, markerRef, source = "new-submission") {
    await firestore.setDoc(markerRef, {
        status: "submitted",
        source,
        submittedAt: Date.now(),
    }, { merge: true });
}

async function releaseAmuseAttempt(firestore, markerRef) {
    try {
        await firestore.deleteDoc(markerRef);
    } catch (error) {
        console.error("[033-ap] Unable to release the score submission lock:", error);
    }
}

async function submitCompletedPuzzle(data) {
    const level = getPuzzleLevel(data);
    const hasNativeScore = data.score !== undefined && data.score !== null && data.score !== "";
    const nativeScore = hasNativeScore ? Number(data.score) : Number.NaN;
    const hasNativeTime = data.timeTaken !== undefined && data.timeTaken !== null && data.timeTaken !== "";
    const nativeTime = hasNativeTime ? Number(data.timeTaken) : Number.NaN;
    const calculated = calculateLeaderboardScore(data);
    const correctness = data.completedCorrectly === true
        ? "Completed correctly"
        : data.completedCorrectly === false
            ? "Completed (not correct)"
            : "Completed";
    const timeText = formatTimeTaken(data.timeTaken);
    const puzzleId = data.id || activePuzzle?.id || "Unavailable";
    scoreSubmitTime.textContent = timeText;
    scoreSubmitValue.textContent = String(calculated.score);

    if (!level) {
        return;
    }

    let reservation = null;
    try {
        const scoreApi = await scoreApiPromise;
        if (!scoreApi || typeof scoreApi.submit !== "function") {
            throw new Error("Shared leaderboard is unavailable.");
        }

        if (currentFirebaseUser?.uid && Number.isFinite(nativeTime)) {
            reservation = await reserveAmuseAttempt(
                currentFirebaseUser.uid,
                level,
                nativeScore,
                nativeTime,
                calculated.score,
            );

            if (reservation.claim === "duplicate") {
                setScoreSubmitStatus("This exact result is already on the leaderboard; it was not submitted again.");
                return;
            }

            if (reservation.claim === "pending") {
                setScoreSubmitStatus("This result is already being saved in another session.");
                return;
            }

            if (await hasPriorMatchingSubmission(
                reservation.db,
                reservation.firestore,
                currentFirebaseUser.uid,
                level,
                nativeScore,
                nativeTime,
                calculated.score,
            )) {
                await markAmuseAttemptSubmitted(
                    reservation.firestore,
                    reservation.markerRef,
                    "existing-leaderboard-entry",
                );
                setScoreSubmitStatus("This exact result was already submitted; it was not added again.");
                return;
            }
        }

        const leaderboardScore = scoreApi.clampScore(calculated.score);
        setScoreSubmitStatus(`Saving your score... ${correctness}. Amuse score: ${Number.isFinite(nativeScore) ? nativeScore : "Unavailable"}; base ${calculated.wordScore}/80 plus ${calculated.timeBonus} time bonus.`, "info");
        scoreSubmitModal.hidden = false;
        // Amuse can replay a puzzle without sending a fresh PUZZLE_LOAD. Start
        // a new shared-score run after our per-attempt dedupe has approved it.
        scoreApi.reset();
        const result = await scoreApi.submit(leaderboardScore, {
            result: data.completedCorrectly === false ? "completed-incorrectly" : "completed",
            levelId: level.levelId,
            levelName: level.levelName,
            metrics: {
                amusePuzzleId: String(puzzleId),
                amuseTimeTakenSeconds: Number.isFinite(nativeTime) ? nativeTime : null,
                amuseNativeScore: Number.isFinite(nativeScore) ? nativeScore : null,
                amuseCalculatedScore: calculated.score,
                wordCompletionRatio: calculated.wordCompletionRatio,
                amuseWordScore: calculated.amuseScore,
                wordScore: calculated.wordScore,
                timeBonus: calculated.timeBonus,
                completedCorrectly: data.completedCorrectly,
            },
        });

        if (result?.ok) {
            if (reservation) {
                await markAmuseAttemptSubmitted(reservation.firestore, reservation.markerRef);
            }
            setScoreSubmitStatus(`Score saved to the leaderboard as ${leaderboardScore}/100 for ${level.levelName}.`, "success");
        } else if (result?.reason === "not-signed-in") {
            if (reservation) {
                await releaseAmuseAttempt(reservation.firestore, reservation.markerRef);
            }
            setScoreSubmitStatus("Sign in to save your score to the leaderboard.");
        } else if (result?.reason === "already-submitted") {
            if (reservation) {
                await markAmuseAttemptSubmitted(reservation.firestore, reservation.markerRef);
            }
            scoreSubmitModal.hidden = true;
        } else {
            if (reservation) {
                await releaseAmuseAttempt(reservation.firestore, reservation.markerRef);
            }
            setScoreSubmitStatus("Your score could not be saved.", "error");
        }
    } catch (error) {
        console.error("[033-ap] Leaderboard submission failed:", error);
        if (reservation?.claim === "claimed") {
            await releaseAmuseAttempt(reservation.firestore, reservation.markerRef);
        }
        scoreSubmitTime.textContent = timeText;
        scoreSubmitValue.textContent = String(calculated.score);
        scoreSubmitModal.hidden = false;
        setScoreSubmitStatus("The leaderboard score could not be saved.", "error");
    }
}

async function handleAmuseMessage(event) {
    if (!puzzleFrame || event.source !== puzzleFrame.contentWindow) return;

    let origin;
    try {
        origin = new URL(event.origin);
    } catch {
        return;
    }

    if (origin.protocol !== "https:" ||
        !(origin.hostname === "amuselabs.com" || origin.hostname.endsWith(".amuselabs.com"))) {
        return;
    }

    const data = readAmuseMessage(event.data);
    if (!data) return;

    if (data.type === "PUZZLE_SELECTED") {
        activePuzzle = null;
        scoreSubmitModal.hidden = true;
        return;
    }

    if (data.type === "PUZZLE_LOAD" || data.progress === "puzzleLoaded") {
        activePuzzle = {
            id: data.id || null,
            date: data.date ?? null,
        };
        scoreSubmitModal.hidden = true;
        scoreApiPromise.then((scoreApi) => scoreApi?.reset());
        return;
    }

    if (data.type !== "PUZZLE_COMPLETE" && data.progress !== "puzzleCompleted") return;
    await submitCompletedPuzzle(data);
}

window.addEventListener("message", (event) => {
    handleAmuseMessage(event).catch((error) => {
        console.error("[033-ap] Unable to handle Amuse Labs message:", error);
    });
});

if (openYears.has(selectedYear)) {
    scoreApiPromise = import("../../js/game-score.js")
        .then(({ initGameScore }) => {
            initGameScore({ gameId: "033-ap", gameName: "अन्विष्यन्तां पदानि" });
            return window.zatamScore;
        })
        .catch((error) => {
            console.error("[033-ap] Unable to initialize the leaderboard:", error);
            return null;
        });

    import("../../auth/api/firebase-config.js")
        .then(({ auth, onAuthStateChanged }) => {
            let authChangeVersion = 0;
            let firstAuthStateResolved = false;

            onAuthStateChanged(auth, async (user) => {
                const thisVersion = ++authChangeVersion;
                currentFirebaseUser = user || null;
                let amuseUid = null;

                if (user?.uid) {
                    try {
                        amuseUid = await toAmuseUid(user.uid);
                    } catch (error) {
                        console.error("Unable to create the Amuse Labs user ID:", error);
                    }
                }

                if (thisVersion !== authChangeVersion) return;

                if (!firstAuthStateResolved) {
                    firstAuthStateResolved = true;
                } else if (puzzleFrame.src) {
                    scoreSubmitModal.hidden = true;
                }

                showYearPuzzle(amuseUid);
            }, (error) => {
                console.error("Unable to read Firebase sign-in state:", error);
                currentFirebaseUser = null;
                if (!firstAuthStateResolved) {
                    firstAuthStateResolved = true;
                    showYearPuzzle(null);
                }
            });
        })
        .catch((error) => {
            console.error("Unable to initialize Firebase for puzzle progress:", error);
            showYearPuzzle(null);
        });
}
