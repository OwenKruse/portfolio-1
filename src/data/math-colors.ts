// One color per idea, shared by the LaTeX in posts and the interactive graphs,
// so ε is the same orange in an equation as it is on a chart.
export const MATH_COLORS = {
  epsilon: "#e8590c",
  delta: "#3157f6",
  limit: "#0f9d76",
  point: "#9b51e0",
  fail: "#d6336c",
} as const;

const hex = (color: string) => color.slice(1);

// KaTeX macros posts can use: $\eps$, $\del$, $\cL{5}$, $\ca{2}$ and so on.
// Colors go in without the "#", which KaTeX would read as a macro argument.
export const KATEX_MACROS = {
  "\\eps": `\\textcolor{${hex(MATH_COLORS.epsilon)}}{\\varepsilon}`,
  "\\del": `\\textcolor{${hex(MATH_COLORS.delta)}}{\\delta}`,
  "\\ceps": `\\textcolor{${hex(MATH_COLORS.epsilon)}}{#1}`,
  "\\cdel": `\\textcolor{${hex(MATH_COLORS.delta)}}{#1}`,
  "\\cL": `\\textcolor{${hex(MATH_COLORS.limit)}}{#1}`,
  "\\ca": `\\textcolor{${hex(MATH_COLORS.point)}}{#1}`,
  "\\cbad": `\\textcolor{${hex(MATH_COLORS.fail)}}{#1}`,
};
