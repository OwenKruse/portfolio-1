import { KATEX_MACROS, MATH_COLORS as C } from "@/data/math-colors";
import katex from "katex";

type Turn = { who: "You" | "Skeptic" | "Opponent"; picks: string; note: string };

const tex = (source: string) => katex.renderToString(source, { macros: { ...KATEX_MACROS }, throwOnError: false });

const GAMES: { title: string; turns: Turn[]; win: string }[] = [
  {
    title: "Proving the limit is L",
    turns: [
      { who: "Skeptic", picks: "\\eps > 0", note: "Any tolerance at all." },
      { who: "You", picks: "\\del > 0", note: "Can depend on ε." },
      { who: "Skeptic", picks: "x", note: "Any x in the window. You have to survive every one." },
    ],
    win: "You win if f(x) lands inside the band.",
  },
  {
    title: "Proving the limit is not L",
    turns: [
      { who: "You", picks: "\\eps > 0", note: "One well-chosen tolerance." },
      { who: "Opponent", picks: "\\del > 0", note: "Any window at all." },
      { who: "You", picks: "\\cbad{x}", note: "One point in their window. Can depend on ε and δ." },
    ],
    win: "You win if f(x) escapes the band.",
  },
];

// The same three moves in both games, with the players swapped.
export function NegationTurns() {
  return (
    <figure className="mx-auto grid max-w-[880px] gap-4 sm:grid-cols-2">
      {GAMES.map((game, g) => (
        <div
          key={game.title}
          className="rounded-[24px] border border-black/[0.08] bg-white p-5 text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)]"
        >
          <p className="text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">{g === 0 ? "The original game" : "The negated game"}</p>
          <p className="mt-1 text-[18px] tracking-[-0.02em]">{game.title}</p>
          <ol className="mt-4 space-y-2">
            {game.turns.map((turn, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-[14px] border p-3"
                style={
                  turn.who === "You"
                    ? { borderColor: "#11121033", background: "#f6d9b438" }
                    : { borderColor: "#0000000f", background: "#fbfbfa" }
                }
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#111210]/[0.06] text-[12px] font-medium text-[#5f655d]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-[15px]">
                    <span className={turn.who === "You" ? "font-semibold" : "text-[#5f655d]"}>{turn.who} picks</span>
                    <span className="text-[17px]" dangerouslySetInnerHTML={{ __html: tex(turn.picks) }} />
                  </p>
                  <p className="mt-0.5 text-[13px] leading-[1.45] text-[#6f7177]">{turn.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[14px] font-medium" style={{ color: g === 0 ? C.limit : C.fail }}>
            {game.win}
          </p>
        </div>
      ))}
    </figure>
  );
}
