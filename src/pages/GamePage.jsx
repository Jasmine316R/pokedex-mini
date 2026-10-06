import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPokemonList } from "../api/pokemon.js";
import { GENERATIONS } from "../data/constants.js";
import { capitalize, getArtworkUrl, getIdFromUrl, pickRandom } from "../utils.js";

const STREAK_KEY = "pokedex-quiz-best";
const TIMER_SECONDS = 15; // seconds per round

/**
 * normalizeName – case-insensitive, strips hyphens/periods/spaces
 * so "Mr. Mime", "mr-mime", "mr mime" all match.
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[.\-\s]/g, "")
    .trim();
}

function GamePage() {
  const kanto = GENERATIONS[0];
  const [roster, setRoster] = useState([]);
  const [round, setRound] = useState(null);
  const [guess, setGuess] = useState(null); // chosen option or submitted text
  const [textInput, setTextInput] = useState("");
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(
    () => Number(localStorage.getItem(STREAK_KEY) || 0)
  );
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [mode, setMode] = useState("choice"); // "choice" | "text"
  const [isActive, setIsActive] = useState(true); // game active vs exited
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  /* ─── Load roster ─── */
  useEffect(() => {
    let isCurrent = true;
    fetchPokemonList(kanto.from, kanto.to)
      .then((results) => {
        if (!isCurrent) return;
        setRoster(results);
        beginRound(results);
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      });
    return () => {
      isCurrent = false;
    };
  }, [kanto.from, kanto.to]);

  /* ─── Countdown timer ─── */
  useEffect(() => {
    if (!round || guess) return;

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time's up — auto-reveal
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [round, guess]);

  function handleTimeout() {
    // Reveal the answer but count it as a miss
    setGuess("__timeout__");
    setStreak(0);
  }

  function beginRound(list) {
    const [answer, ...rest] = pickRandom(list, 4);
    const options = pickRandom([answer, ...rest], 4);
    setRound({ answer, options });
    setGuess(null);
    setTextInput("");
    setTimer(TIMER_SECONDS);
  }

  function startRound() {
    beginRound(roster);
  }

  /* ─── Multiple choice handler ─── */
  function choose(name) {
    if (guess) return;
    clearInterval(timerRef.current);
    setGuess(name);
    const correct = name === round.answer.name;
    updateStreak(correct);
  }

  /* ─── Text input handler ─── */
  function handleTextSubmit(e) {
    e.preventDefault();
    if (guess || !textInput.trim()) return;
    clearInterval(timerRef.current);

    const normalized = normalizeName(textInput);
    const answerNormalized = normalizeName(round.answer.name);
    const correct = normalized === answerNormalized;

    setGuess(correct ? round.answer.name : textInput.trim());
    updateStreak(correct);
  }

  function updateStreak(correct) {
    const nextStreak = correct ? streak + 1 : 0;
    setStreak(nextStreak);
    if (nextStreak > best) {
      setBest(nextStreak);
      localStorage.setItem(STREAK_KEY, String(nextStreak));
    }
  }

  /* ─── Focus text input on new round ─── */
  useEffect(() => {
    if (mode === "text" && !guess && inputRef.current) {
      inputRef.current.focus();
    }
  }, [round, mode, guess]);

  const revealed = Boolean(guess);
  const isCorrect =
    guess && guess !== "__timeout__" && normalizeName(guess) === normalizeName(round?.answer?.name || "");
  const artId = round ? getIdFromUrl(round.answer.url) : null;

  const heading = useMemo(() => {
    if (!guess) return "Who's that Pokémon?";
    if (guess === "__timeout__") return "Time's up!";
    return isCorrect ? "You caught it!" : "It got away…";
  }, [guess, isCorrect]);

  function exitGame() {
    setIsActive(false);
  }

  if (!isActive) {
    return (
      <section className="game-page">
        <h2>Thanks for playing!</h2>
        <p className="hero-copy">
          Final streak: {streak} · Best: {best}
        </p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <button
            type="button"
            className="search-button"
            onClick={() => {
              setIsActive(true);
              startRound();
            }}
          >
            Play again
          </button>
          <Link className="chip" to="/">
            Back to dex
          </Link>
        </div>
      </section>
    );
  }

  if (error) return <p className="status status-error">{error}</p>;
  if (!round) {
    return (
      <section className="game-page">
        {/* Skeleton loading for game */}
        <div className="skel-line" style={{ width: 120, margin: "0 auto 8px" }} />
        <div className="skel-line skel-title" style={{ width: "50%", margin: "0 auto 16px" }} />
        <div className="silhouette-stage skeleton-hero">
          <div className="skel-circle" style={{ width: 200, height: 200 }} />
        </div>
      </section>
    );
  }

  return (
    <section className="game-page">
      <p className="eyebrow">Mini game</p>
      <h2>{heading}</h2>
      <p className="hero-copy">
        Streak {streak} · Best {best}
      </p>

      {/* Timer bar */}
      {!revealed && (
        <div className="timer-bar-wrap" aria-label={`${timer} seconds remaining`}>
          <div
            className={`timer-bar ${timer <= 5 ? "is-critical" : ""}`}
            style={{ width: `${(timer / TIMER_SECONDS) * 100}%` }}
          />
          <span className="timer-text">{timer}s</span>
        </div>
      )}

      {/* Silhouette stage */}
      <div className={`silhouette-stage glass-card ${revealed ? "is-revealed" : ""}`}>
        <img
          src={getArtworkUrl(artId)}
          alt=""
          width={240}
          height={240}
          loading="lazy"
        />
        {revealed && (
          <p className="silhouette-name">{capitalize(round.answer.name)}</p>
        )}
      </div>

      {/* Mode toggle */}
      {!revealed && (
        <div className="game-mode-toggle">
          <button
            type="button"
            className={`chip ${mode === "choice" ? "is-on" : ""}`}
            onClick={() => setMode("choice")}
            aria-pressed={mode === "choice"}
          >
            Multiple Choice
          </button>
          <button
            type="button"
            className={`chip ${mode === "text" ? "is-on" : ""}`}
            onClick={() => setMode("text")}
            aria-pressed={mode === "text"}
          >
            Type Answer
          </button>
        </div>
      )}

      {/* Multiple choice options */}
      {mode === "choice" && (
        <div className="quiz-options">
          {round.options.map((pokemon) => {
            const isAnswer = pokemon.name === round.answer.name;
            const isPicked = guess === pokemon.name;
            let className = "quiz-option";
            if (revealed && isAnswer) className += " is-correct";
            if (revealed && isPicked && !isAnswer) className += " is-wrong";
            if (revealed && guess === "__timeout__" && isAnswer)
              className += " is-correct";
            return (
              <button
                key={pokemon.name}
                type="button"
                className={className}
                onClick={() => choose(pokemon.name)}
                disabled={revealed}
                aria-label={capitalize(pokemon.name)}
              >
                {capitalize(pokemon.name)}
              </button>
            );
          })}
        </div>
      )}

      {/* Text input mode */}
      {mode === "text" && !revealed && (
        <form className="game-text-form" onSubmit={handleTextSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Type the Pokémon's name…"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            aria-label="Your guess"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="search-button" disabled={!textInput.trim()}>
            Guess
          </button>
        </form>
      )}

      {/* Text mode result */}
      {mode === "text" && revealed && (
        <p className={`game-text-result ${isCorrect ? "is-correct" : "is-wrong"}`}>
          {guess === "__timeout__"
            ? `It was ${capitalize(round.answer.name)}!`
            : isCorrect
            ? "Correct!"
            : `Nope! It was ${capitalize(round.answer.name)}.`}
        </p>
      )}

      {/* Post-round actions */}
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        {revealed && (
          <>
            <button
              type="button"
              className="search-button"
              onClick={startRound}
            >
              Next round
            </button>
            <Link className="chip" to={`/pokemon/${round.answer.name}`}>
              Open dex entry
            </Link>
          </>
        )}
        <button type="button" className="chip" onClick={exitGame}>
          Exit game
        </button>
      </div>
    </section>
  );
}

export default GamePage;
