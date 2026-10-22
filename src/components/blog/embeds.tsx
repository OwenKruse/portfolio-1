import {
  EpsilonDeltaFailure,
  EpsilonDeltaGame,
  EpsilonDeltaLinear,
  EpsilonDeltaQuadratic,
} from "@/components/blog/epsilon-delta";
import { EulerExplorer } from "@/components/blog/euler-explorer";
import { ProofLadderLinear, ProofLadderQuadratic } from "@/components/blog/proof-ladder";

// Interactive components a post can drop in with a line like
// {{embed:euler-explorer}} on its own in the Markdown.
const EMBEDS: Record<string, React.ComponentType> = {
  "euler-explorer": EulerExplorer,
  "epsilon-delta-game": EpsilonDeltaGame,
  "epsilon-delta-linear": EpsilonDeltaLinear,
  "epsilon-delta-quadratic": EpsilonDeltaQuadratic,
  "epsilon-delta-failure": EpsilonDeltaFailure,
  "proof-ladder-linear": ProofLadderLinear,
  "proof-ladder-quadratic": ProofLadderQuadratic,
};

const EMBED_PATTERN = /<p>\{\{embed:([a-z0-9-]+)\}\}<\/p>/g;

type Part = { type: "html"; html: string } | { type: "embed"; name: string };

export function splitEmbeds(html: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const match of html.matchAll(EMBED_PATTERN)) {
    parts.push({ type: "html", html: html.slice(last, match.index) });
    parts.push({ type: "embed", name: match[1] });
    last = match.index + match[0].length;
  }
  parts.push({ type: "html", html: html.slice(last) });
  return parts.filter((part) => part.type === "embed" || part.html.trim());
}

export function BlogEmbed({ name }: { name: string }) {
  const Embed = EMBEDS[name];
  if (!Embed) return null;
  // Break out of the 720px reading column so tools get room to breathe.
  return (
    <div className="relative left-1/2 my-12 w-[100vw] max-w-[1120px] -translate-x-1/2 px-4 sm:px-8">
      <Embed />
    </div>
  );
}
