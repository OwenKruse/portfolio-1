// A small, safe parser for f(x, y) expressions typed by readers.
// No eval: input is tokenized, parsed by recursive descent, and compiled
// into closures. Supports implicit multiplication ("2xy", "x(y+1)"),
// ^ or ** for powers, and common functions with or without parentheses.

export type Fn2 = (x: number, y: number) => number;

export type ParseResult =
  | { ok: true; fn: Fn2 }
  | { ok: false; error: string; index: number };

const FUNCTIONS: Record<string, { arity: number; fn: (...args: number[]) => number }> = {
  sin: { arity: 1, fn: Math.sin },
  cos: { arity: 1, fn: Math.cos },
  tan: { arity: 1, fn: Math.tan },
  sec: { arity: 1, fn: (v) => 1 / Math.cos(v) },
  csc: { arity: 1, fn: (v) => 1 / Math.sin(v) },
  cot: { arity: 1, fn: (v) => 1 / Math.tan(v) },
  asin: { arity: 1, fn: Math.asin },
  acos: { arity: 1, fn: Math.acos },
  atan: { arity: 1, fn: Math.atan },
  arcsin: { arity: 1, fn: Math.asin },
  arccos: { arity: 1, fn: Math.acos },
  arctan: { arity: 1, fn: Math.atan },
  sinh: { arity: 1, fn: Math.sinh },
  cosh: { arity: 1, fn: Math.cosh },
  tanh: { arity: 1, fn: Math.tanh },
  exp: { arity: 1, fn: Math.exp },
  ln: { arity: 1, fn: Math.log },
  log: { arity: 1, fn: Math.log },
  log10: { arity: 1, fn: Math.log10 },
  log2: { arity: 1, fn: Math.log2 },
  sqrt: { arity: 1, fn: Math.sqrt },
  cbrt: { arity: 1, fn: Math.cbrt },
  abs: { arity: 1, fn: Math.abs },
  sign: { arity: 1, fn: Math.sign },
  floor: { arity: 1, fn: Math.floor },
  ceil: { arity: 1, fn: Math.ceil },
  min: { arity: 2, fn: Math.min },
  max: { arity: 2, fn: Math.max },
};

const CONSTANTS: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E };
const VARIABLES = new Set(["x", "y", "t"]);

// Longest names first so "exp" wins over "e" + "x" + "p".
const KNOWN_NAMES = [
  ...Object.keys(FUNCTIONS),
  ...Object.keys(CONSTANTS),
  ...VARIABLES,
].sort((a, b) => b.length - a.length);

type Token =
  | { type: "num"; value: number; index: number }
  | { type: "name"; value: string; index: number }
  | { type: "op"; value: string; index: number };

class ParseError extends Error {
  constructor(
    message: string,
    public index: number,
  ) {
    super(message);
  }
}

const OPERATORS: Record<string, string> = {
  "+": "+",
  "-": "-",
  "−": "-",
  "*": "*",
  "×": "*",
  "·": "*",
  "⋅": "*",
  "/": "/",
  "÷": "/",
  "^": "^",
  "(": "(",
  ")": ")",
  "[": "(",
  "]": ")",
  ",": ",",
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const match = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(input.slice(i));
      if (!match) throw new ParseError(`Unexpected "${ch}"`, i);
      tokens.push({ type: "num", value: parseFloat(match[0]), index: i });
      i += match[0].length;
      continue;
    }
    if (ch === "*" && input[i + 1] === "*") {
      tokens.push({ type: "op", value: "^", index: i });
      i += 2;
      continue;
    }
    if (ch === "²" || ch === "³") {
      tokens.push({ type: "op", value: "^", index: i });
      tokens.push({ type: "num", value: ch === "²" ? 2 : 3, index: i });
      i++;
      continue;
    }
    if (OPERATORS[ch]) {
      tokens.push({ type: "op", value: OPERATORS[ch], index: i });
      i++;
      continue;
    }
    if (/[a-zA-Zπ]/.test(ch)) {
      let run = /^[a-zA-Zπ]+/.exec(input.slice(i))![0];
      // Allow trailing digits only when they complete a name like log10.
      const withDigits = /^[a-zA-Zπ]+\d+/.exec(input.slice(i))?.[0];
      if (withDigits && FUNCTIONS[withDigits.toLowerCase()]) run = withDigits;
      // Split runs like "xy" or "xsin" into known names.
      let j = 0;
      const lower = run.toLowerCase();
      while (j < run.length) {
        const name = KNOWN_NAMES.find((n) => lower.startsWith(n, j));
        if (!name) {
          throw new ParseError(
            `Unknown name "${run}". Use x and y, or a function like sin, exp or sqrt.`,
            i + j,
          );
        }
        tokens.push({ type: "name", value: name, index: i + j });
        j += name.length;
      }
      i += run.length;
      continue;
    }
    throw new ParseError(`Unexpected "${ch}"`, i);
  }
  return tokens;
}

class Parser {
  private pos = 0;
  constructor(
    private tokens: Token[],
    private length: number,
  ) {}

  private peek() {
    return this.tokens[this.pos];
  }

  private isOp(value: string) {
    const token = this.peek();
    return token?.type === "op" && token.value === value;
  }

  private expect(value: string) {
    if (!this.isOp(value)) {
      const token = this.peek();
      throw new ParseError(
        token ? `Expected "${value}"` : `Missing "${value}"`,
        token?.index ?? this.length,
      );
    }
    this.pos++;
  }

  parse(): Fn2 {
    if (!this.tokens.length) throw new ParseError("Enter an expression", 0);
    const fn = this.sum();
    const extra = this.peek();
    if (extra) throw new ParseError(`Unexpected "${extra.value}"`, extra.index);
    return fn;
  }

  private sum(): Fn2 {
    let left = this.product();
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.tokens[this.pos++].value;
      const a = left;
      const b = this.product();
      left = op === "+" ? (x, y) => a(x, y) + b(x, y) : (x, y) => a(x, y) - b(x, y);
    }
    return left;
  }

  private startsImplicitFactor() {
    const token = this.peek();
    if (!token) return false;
    return token.type !== "op" || token.value === "(";
  }

  private product(): Fn2 {
    let left = this.unary();
    while (true) {
      if (this.isOp("*") || this.isOp("/")) {
        const op = this.tokens[this.pos++].value;
        const a = left;
        const b = this.unary();
        left = op === "*" ? (x, y) => a(x, y) * b(x, y) : (x, y) => a(x, y) / b(x, y);
      } else if (this.startsImplicitFactor()) {
        const a = left;
        const b = this.power();
        left = (x, y) => a(x, y) * b(x, y);
      } else {
        return left;
      }
    }
  }

  private unary(): Fn2 {
    if (this.isOp("-")) {
      this.pos++;
      const a = this.unary();
      return (x, y) => -a(x, y);
    }
    if (this.isOp("+")) {
      this.pos++;
      return this.unary();
    }
    return this.power();
  }

  private power(): Fn2 {
    const base = this.primary();
    if (this.isOp("^")) {
      this.pos++;
      const exponent = this.unary();
      return (x, y) => Math.pow(base(x, y), exponent(x, y));
    }
    return base;
  }

  private primary(): Fn2 {
    const token = this.peek();
    if (!token) throw new ParseError("Expression ends too early", this.length);

    if (token.type === "num") {
      this.pos++;
      const value = token.value;
      return () => value;
    }

    if (token.type === "op") {
      if (token.value === "(") {
        this.pos++;
        const inner = this.sum();
        this.expect(")");
        return inner;
      }
      throw new ParseError(`Unexpected "${token.value}"`, token.index);
    }

    this.pos++;
    const name = token.value;
    if (name === "x" || name === "t") return (x) => x;
    if (name === "y") return (_, y) => y;
    if (name in CONSTANTS) {
      const value = CONSTANTS[name];
      return () => value;
    }

    const { arity, fn } = FUNCTIONS[name];
    if (!this.isOp("(")) {
      // "sin x" or "sinx": apply to the next power-level term.
      if (arity !== 1) throw new ParseError(`${name} needs parentheses`, token.index);
      const arg = this.power();
      return (x, y) => fn(arg(x, y));
    }
    this.pos++;
    const args: Fn2[] = [this.sum()];
    while (this.isOp(",")) {
      this.pos++;
      args.push(this.sum());
    }
    this.expect(")");
    if (args.length !== arity) {
      throw new ParseError(
        `${name} takes ${arity} argument${arity === 1 ? "" : "s"}`,
        token.index,
      );
    }
    if (arity === 1) {
      const [a] = args;
      return (x, y) => fn(a(x, y));
    }
    const [a, b] = args;
    return (x, y) => fn(a(x, y), b(x, y));
  }
}

export function parseExpression(input: string): ParseResult {
  try {
    const fn = new Parser(tokenize(input), input.length).parse();
    return { ok: true, fn };
  } catch (error) {
    if (error instanceof ParseError) {
      return { ok: false, error: error.message, index: error.index };
    }
    throw error;
  }
}
