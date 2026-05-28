"use client";

import React from "react";

type LatexNode = React.ReactNode;

interface PictureLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}

interface TableCell {
  align: "left" | "center" | "right";
  border: boolean;
  colSpan: number;
  content: string;
  rowSpan: number;
}

interface AsymptoteGraph {
  xLeft: number;
  xRight: number;
  yBottom: number;
  yTop: number;
  points: { x: number; y: number }[];
}

interface TableRow {
  bottomBorder: boolean;
  cells: TableCell[];
  topBorder: boolean;
}

const TEXT_COMMANDS: Record<string, keyof React.JSX.IntrinsicElements> = {
  emph: "em",
  textsuperscript: "sup",
  textit: "em",
  textbf: "strong",
  underline: "u",
};

const IGNORED_COMMANDS = new Set([
  "bigskip",
  "centerline",
  "documentclass",
  "hfill",
  "hrule",
  "itemsep",
  "label",
  "maketitle",
  "medskip",
  "newcommand",
  "noindent",
  "parindent",
  "renewcommand",
  "smallskip",
  "thispagestyle",
  "title",
  "usepackage",
  "vfill",
  "vspace",
]);

const MATH_ENVIRONMENTS = new Set([
  "align",
  "align*",
  "aligned",
  "array",
  "cases",
  "displaymath",
  "eqnarray",
  "eqnarray*",
  "equation",
  "equation*",
  "gather",
  "gather*",
  "gathered",
  "matrix",
  "multline",
  "multline*",
  "pmatrix",
  "smallmatrix",
  "split",
  "vmatrix",
]);

function findUnescaped(value: string, pattern: string, start: number) {
  let index = value.indexOf(pattern, start);

  while (index >= 0) {
    let slashCount = 0;
    for (let cursor = index - 1; cursor >= 0 && value[cursor] === "\\"; cursor--) {
      slashCount++;
    }

    if (slashCount % 2 === 0) return index;
    index = value.indexOf(pattern, index + pattern.length);
  }

  return -1;
}

function readMathSegment(value: string, index: number) {
  const starts: [string, string][] = [
    ["\\[", "\\]"],
    ["\\(", "\\)"],
    ["$$", "$$"],
    ["$", "$"],
  ];

  for (const [open, close] of starts) {
    if (!value.startsWith(open, index)) continue;

    const end = findUnescaped(value, close, index + open.length);
    if (end < 0) return null;

    return {
      content: value.slice(index, end + close.length),
      end: end + close.length,
    };
  }

  return null;
}

function parseNumber(value: string) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function readAsymptoteBlock(value: string, index: number) {
  const open = "[asy]";
  const close = "[/asy]";

  if (!value.startsWith(open, index)) return null;

  const end = value.indexOf(close, index + open.length);
  if (end < 0) return null;

  return {
    content: value.slice(index + open.length, end),
    end: end + close.length,
  };
}

function getAsymptoteRealValue(source: string, name: string) {
  const pattern = new RegExp(
    `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*=\\s*([-+]?\\d+(?:\\.\\d+)?)\\s*;`,
  );
  const match = source.match(pattern);

  return match ? parseNumber(match[1]) : null;
}

function evaluateSupportedAsymptoteFunction(source: string, x: number) {
  const functionMatch = source.match(
    /real\s+f\s*\(\s*real\s+x\s*\)\s*\{\s*return\s+([^;]+);?\s*\}/,
  );
  const expression = functionMatch?.[1]?.replace(/\s+/g, "");

  if (!expression) return null;

  const squareShiftMatch = expression.match(
    /^\(x([+-]\d+(?:\.\d+)?)\)\*\(x\1\)([+-]\d+(?:\.\d+)?)?$/,
  );
  if (squareShiftMatch) {
    const shift = parseNumber(squareShiftMatch[1]);
    const offset = squareShiftMatch[2] ? parseNumber(squareShiftMatch[2]) : 0;
    return (x + shift) * (x + shift) + offset;
  }

  const shiftedSquareMatch = expression.match(
    /^\(x([+-]\d+(?:\.\d+)?)\)\^2([+-]\d+(?:\.\d+)?)?$/,
  );
  if (shiftedSquareMatch) {
    const shift = parseNumber(shiftedSquareMatch[1]);
    const offset = shiftedSquareMatch[2] ? parseNumber(shiftedSquareMatch[2]) : 0;
    return (x + shift) * (x + shift) + offset;
  }

  return null;
}

function parseAsymptoteGraph(source: string): AsymptoteGraph | null {
  const yBottom = getAsymptoteRealValue(source, "lowery");
  const yTop = getAsymptoteRealValue(source, "uppery");

  if (yBottom === null || yTop === null || yTop <= yBottom) return null;

  const axesMatch = source.match(/rr_cartesian_axes\(\s*([-+.\d]+)\s*,\s*([^,]+)\s*,\s*lowery\s*,\s*uppery\s*\)/);
  const xLeft = axesMatch ? parseNumber(axesMatch[1]) : -5;
  const xRightExpression = axesMatch?.[2]?.trim();
  const xRight =
    xRightExpression === "f(lowery)"
      ? (evaluateSupportedAsymptoteFunction(source, yBottom) ?? 5)
      : xRightExpression
        ? parseNumber(xRightExpression)
        : 5;
  const reflected = /reflect\(\s*\(0\s*,\s*0\)\s*,\s*\(1\s*,\s*1\)\s*\)/.test(
    source,
  );
  const points: { x: number; y: number }[] = [];
  const steps = 120;

  for (let step = 0; step <= steps; step++) {
    const input = yBottom + ((yTop - yBottom) * step) / steps;
    const output = evaluateSupportedAsymptoteFunction(source, input);
    if (output === null) return null;
    points.push(reflected ? { x: output, y: input } : { x: input, y: output });
  }

  return { xLeft, xRight, yBottom, yTop, points };
}

function renderAsymptoteDiagram(source: string, key: string) {
  const graph = parseAsymptoteGraph(source);

  if (!graph) {
    return (
      <pre className="my-3 overflow-x-auto rounded bg-bg-light p-3 text-xs text-muted-foreground" key={key}>
        {source.trim()}
      </pre>
    );
  }

  const width = 420;
  const height = 260;
  const padding = 30;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const toSvgX = (x: number) =>
    padding + ((x - graph.xLeft) / (graph.xRight - graph.xLeft)) * plotWidth;
  const toSvgY = (y: number) =>
    padding + ((graph.yTop - y) / (graph.yTop - graph.yBottom)) * plotHeight;
  const path = graph.points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${toSvgX(point.x).toFixed(2)} ${toSvgY(point.y).toFixed(2)}`;
    })
    .join(" ");
  const xTicks = [];
  const yTicks = [];

  for (let x = Math.ceil(graph.xLeft); x <= Math.floor(graph.xRight); x++) {
    if (x !== 0) xTicks.push(x);
  }

  for (let y = Math.ceil(graph.yBottom); y <= Math.floor(graph.yTop); y++) {
    if (y !== 0) yTicks.push(y);
  }

  return (
    <div className="my-4 flex w-full justify-center overflow-x-auto" key={key}>
      <svg
        aria-label="Asymptote diagram"
        className="h-auto max-w-full rounded bg-background text-text"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        {xTicks.map((x) => (
          <line
            key={`x-grid-${x}`}
            stroke="currentColor"
            strokeOpacity="0.18"
            x1={toSvgX(x)}
            x2={toSvgX(x)}
            y1={padding}
            y2={height - padding}
          />
        ))}
        {yTicks.map((y) => (
          <line
            key={`y-grid-${y}`}
            stroke="currentColor"
            strokeOpacity="0.18"
            x1={padding}
            x2={width - padding}
            y1={toSvgY(y)}
            y2={toSvgY(y)}
          />
        ))}
        <line
          markerEnd="url(#asy-arrow)"
          stroke="currentColor"
          strokeWidth="1.5"
          x1={padding}
          x2={width - padding + 8}
          y1={toSvgY(0)}
          y2={toSvgY(0)}
        />
        <line
          markerEnd="url(#asy-arrow)"
          stroke="currentColor"
          strokeWidth="1.5"
          x1={toSvgX(0)}
          x2={toSvgX(0)}
          y1={height - padding}
          y2={padding - 8}
        />
        <defs>
          <marker
            id="asy-arrow"
            markerHeight="6"
            markerWidth="6"
            orient="auto-start-reverse"
            refX="5"
            refY="3"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
          </marker>
        </defs>
        <text fill="currentColor" fontSize="14" x={width - padding + 12} y={toSvgY(0) + 16}>
          x
        </text>
        <text fill="currentColor" fontSize="14" x={toSvgX(0) - 18} y={padding - 12}>
          y
        </text>
        <path d={path} fill="none" stroke="#ef4444" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function parsePictureLine(x: number, y: number, dx: number, dy: number, length: number) {
  const magnitude = Math.max(Math.abs(dx), Math.abs(dy), 1);
  return {
    x1: x,
    y1: y,
    x2: x + (dx / magnitude) * length,
    y2: y + (dy / magnitude) * length,
  };
}

function parsePictureLines(content: string) {
  const lines: PictureLine[] = [];
  const putLinePattern =
    /\\put\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\s*\{\s*\\line\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\s*\{\s*([-.\d]+)\s*\}\s*\}/g;
  const multiPutLinePattern =
    /\\multiput\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\s*\{\s*(\d+)\s*\}\s*\{\s*\\line\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\s*\{\s*([-.\d]+)\s*\}\s*\}/g;

  let putMatch: RegExpExecArray | null;
  while ((putMatch = putLinePattern.exec(content)) !== null) {
    lines.push(
      parsePictureLine(
        parseNumber(putMatch[1]),
        parseNumber(putMatch[2]),
        parseNumber(putMatch[3]),
        parseNumber(putMatch[4]),
        parseNumber(putMatch[5]),
      ),
    );
  }

  let multiPutMatch: RegExpExecArray | null;
  while ((multiPutMatch = multiPutLinePattern.exec(content)) !== null) {
    const x = parseNumber(multiPutMatch[1]);
    const y = parseNumber(multiPutMatch[2]);
    const stepX = parseNumber(multiPutMatch[3]);
    const stepY = parseNumber(multiPutMatch[4]);
    const count = Number(multiPutMatch[5]);
    const lineDx = parseNumber(multiPutMatch[6]);
    const lineDy = parseNumber(multiPutMatch[7]);
    const length = parseNumber(multiPutMatch[8]);

    for (let item = 0; item < count; item++) {
      lines.push({
        ...parsePictureLine(x + stepX * item, y + stepY * item, lineDx, lineDy, length),
        dashed: true,
      });
    }
  }

  return lines;
}

function renderPictureDisplay(mathContent: string, key: string) {
  const pictureMatch = mathContent.match(
    /\\begin\{picture\}\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)([\s\S]*?)\\end\{picture\}/,
  );

  if (!pictureMatch) return null;

  const width = parseNumber(pictureMatch[1]);
  const height = parseNumber(pictureMatch[2]);
  const originX = parseNumber(pictureMatch[3]);
  const originY = parseNumber(pictureMatch[4]);
  const lines = parsePictureLines(pictureMatch[5]);

  if (width <= 0 || height <= 0 || lines.length === 0) {
    return (
      <pre className="my-3 overflow-x-auto rounded bg-bg-light p-3 text-sm" key={key}>
        {pictureMatch[0]}
      </pre>
    );
  }

  return (
    <div className="my-4 flex w-full justify-center overflow-x-auto" key={key}>
      <svg
        aria-label="LaTeX picture"
        className="h-auto max-w-full text-text"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={Math.min(width / 4, 680)}
      >
        <g transform={`translate(${-originX} ${height + originY}) scale(1 -1)`}>
          {lines.map((line, index) => (
            <line
              key={index}
              stroke="currentColor"
              strokeDasharray={line.dashed ? "48 48" : undefined}
              strokeLinecap="square"
              strokeWidth={18}
              vectorEffect="non-scaling-stroke"
              x1={line.x1}
              x2={line.x2}
              y1={line.y1}
              y2={line.y2}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function readBalancedGroup(value: string, openIndex: number) {
  if (value[openIndex] !== "{") return null;

  let depth = 0;
  for (let index = openIndex; index < value.length; index++) {
    const char = value[index];
    if (char === "\\" && index + 1 < value.length) {
      index++;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") depth--;

    if (depth === 0) {
      return {
        content: value.slice(openIndex + 1, index),
        end: index + 1,
      };
    }
  }

  return null;
}

function readBalancedBracket(value: string, openIndex: number) {
  if (value[openIndex] !== "[") return null;

  let depth = 0;
  for (let index = openIndex; index < value.length; index++) {
    const char = value[index];
    if (char === "\\" && index + 1 < value.length) {
      index++;
      continue;
    }

    if (char === "[") depth++;
    if (char === "]") depth--;

    if (depth === 0) {
      return {
        content: value.slice(openIndex + 1, index),
        end: index + 1,
      };
    }
  }

  return null;
}

function skipLatexArguments(value: string, index: number, maxGroups = 1) {
  let cursor = index;
  let groupCount = 0;

  while (cursor < value.length) {
    while (/\s/.test(value[cursor] ?? "")) cursor++;

    if (value[cursor] === "[") {
      const bracket = readBalancedBracket(value, cursor);
      if (!bracket) return cursor;
      cursor = bracket.end;
      continue;
    }

    if (value[cursor] === "{" && groupCount < maxGroups) {
      const group = readBalancedGroup(value, cursor);
      if (!group) return cursor;
      cursor = group.end;
      groupCount++;
      continue;
    }

    return cursor;
  }

  return cursor;
}

function skipEnvironmentArguments(value: string, name: string, index: number) {
  return skipLatexArguments(value, index, name === "tabular" ? 1 : 0);
}

function findEnvironmentEnd(value: string, name: string, contentStart: number) {
  const pattern = new RegExp(
    `\\\\(?:begin|end)\\{${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\}`,
    "g",
  );
  pattern.lastIndex = contentStart;
  let depth = 1;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match[0].startsWith("\\begin")) depth++;
    else depth--;

    if (depth === 0) {
      return {
        content: value.slice(contentStart, match.index),
        end: pattern.lastIndex,
      };
    }
  }

  return null;
}

function splitTopLevelItems(value: string) {
  const items: { label: string | null; content: string }[] = [];
  let depth = 0;
  let itemStart = -1;
  let label: string | null = null;

  for (let index = 0; index < value.length; index++) {
    const char = value[index];

    if (char === "\\" && value.startsWith("\\item", index) && depth === 0) {
      if (itemStart >= 0) {
        items.push({
          label,
          content: value.slice(itemStart, index).trim(),
        });
      }

      index += "\\item".length;
      while (/\s/.test(value[index] ?? "")) index++;

      label = null;
      if (value[index] === "[") {
        const labelStart = index + 1;
        let labelDepth = 1;
        index++;
        while (index < value.length && labelDepth > 0) {
          if (value[index] === "[" && value[index - 1] !== "\\") labelDepth++;
          if (value[index] === "]" && value[index - 1] !== "\\") labelDepth--;
          index++;
        }
        label = value.slice(labelStart, index - 1);
      }

      itemStart = index;
      index--;
      continue;
    }

    if (char === "\\" && index + 1 < value.length) {
      index++;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") depth = Math.max(0, depth - 1);
  }

  if (itemStart >= 0) {
    items.push({ label, content: value.slice(itemStart).trim() });
  }

  return items.filter((item) => item.content.length > 0);
}

function splitRows(value: string) {
  return value
    .split(/\\\\(?:\[[^\]]*\])?/g)
    .map((row) => row.trim())
    .filter(Boolean);
}

function splitCells(value: string) {
  const cells: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === "\\" && index + 1 < value.length) {
      index++;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") depth = Math.max(0, depth - 1);

    if (char === "&" && depth === 0) {
      cells.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  cells.push(value.slice(start).trim());
  return cells;
}

function getTableAlignment(value: string) {
  if (value.includes("r")) return "right";
  if (value.includes("l")) return "left";
  return "center";
}

function getTableBorder(value: string) {
  return value.includes("|");
}

function parseMulticolumnCell(value: string): TableCell | null {
  const command = "\\multicolumn";
  if (!value.trimStart().startsWith(command)) return null;

  let cursor = value.indexOf(command) + command.length;
  const span = readBalancedGroup(value, cursor);
  if (!span) return null;

  cursor = span.end;
  const alignment = readBalancedGroup(value, cursor);
  if (!alignment) return null;

  cursor = alignment.end;
  const content = readBalancedGroup(value, cursor);
  if (!content) return null;

  const remaining = value.slice(content.end).trim();
  return {
    align: getTableAlignment(alignment.content),
    border: getTableBorder(alignment.content),
    colSpan: Math.max(1, Number(span.content) || 1),
    content: `${content.content}${remaining}`,
    rowSpan: 1,
  };
}

function parseMultirowCell(value: string): TableCell | null {
  const command = "\\multirow";
  if (!value.trimStart().startsWith(command)) return null;

  let cursor = value.indexOf(command) + command.length;
  const span = readBalancedGroup(value, cursor);
  if (!span) return null;

  cursor = span.end;
  const width = readBalancedGroup(value, cursor);
  if (!width) return null;

  cursor = width.end;
  const content = readBalancedGroup(value, cursor);
  if (!content) return null;

  const remaining = value.slice(content.end).trim();
  return {
    align: "center",
    border: false,
    colSpan: 1,
    content: `${content.content}${remaining}`,
    rowSpan: Math.max(1, Number(span.content) || 1),
  };
}

function parseTableCell(value: string): TableCell {
  const normalized = value.trim();
  return (
    parseMulticolumnCell(normalized) ??
    parseMultirowCell(normalized) ?? {
      align: "center",
      border: false,
      colSpan: 1,
      content: normalized,
      rowSpan: 1,
    }
  );
}

function parseTableRows(content: string) {
  const rows: TableRow[] = [];
  let pendingTopBorder = false;

  splitRows(content).forEach((rawRow) => {
    let row = rawRow.trim();
    const startsWithBorder = /^(?:\\hline\s*)+/.test(row);
    const endsWithBorder = /(?:\\hline\s*)+$/.test(row);

    if (startsWithBorder) {
      pendingTopBorder = true;
      if (rows.length > 0) rows[rows.length - 1].bottomBorder = true;
    }

    row = row
      .replace(/\\hline/g, "")
      .replace(/\\cline\{[^}]*\}/g, "")
      .trim();

    if (!row) {
      if ((startsWithBorder || endsWithBorder) && rows.length > 0) {
        rows[rows.length - 1].bottomBorder = true;
      }
      return;
    }

    rows.push({
      bottomBorder: endsWithBorder,
      cells: splitCells(row).map(parseTableCell),
      topBorder: pendingTopBorder,
    });
    pendingTopBorder = false;
  });

  return rows;
}

function normalizeText(value: string) {
  return value
    .replace(/\\begin\{document\}|\\end\{document\}/g, "")
    .replace(/\\qquad/g, "    ")
    .replace(/\\quad/g, "  ")
    .replace(/\\,/g, " ")
    .replace(/~+/g, " ")
    .replace(/``/g, '"')
    .replace(/''/g, '"');
}

function renderEnvironment(name: string, content: string, key: string) {
  if (name === "enumerate" || name === "itemize") {
    const items = splitTopLevelItems(content);

    return (
      <div className="my-3 flex flex-col gap-2" key={key}>
        {items.map((item, index) => {
          const marker =
            name === "itemize" ? "-" : (item.label ?? `${index + 1}.`);

          return (
            <div className="grid grid-cols-[1.75rem_1fr] gap-2" key={index}>
              <span className="text-right">{marker}</span>
              <div>{renderLatexNodes(item.content)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (name === "center") {
    return (
      <div className="my-3 text-center" key={key}>
        {renderLatexNodes(content)}
      </div>
    );
  }

  if (name === "tabular" || name === "array") {
    const rows = parseTableRows(content);

    return (
      <div className="my-3 overflow-x-auto" key={key}>
        <table className="mx-auto border-collapse">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                className={[
                  row.topBorder ? "border-t border-current" : "",
                  row.bottomBorder ? "border-b border-current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={rowIndex}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    className={[
                      "px-3 py-1 align-middle",
                      cell.border ? "border-x border-current" : "",
                      cell.align === "left" ? "text-left" : "",
                      cell.align === "right" ? "text-right" : "",
                      cell.align === "center" ? "text-center" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    colSpan={cell.colSpan}
                    key={cellIndex}
                    rowSpan={cell.rowSpan}
                  >
                    {renderLatexNodes(cell.content)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (["proof", "remark", "solution"].includes(name)) {
    return (
      <div className="my-3" key={key}>
        <span className="font-semibold capitalize">{name}. </span>
        {renderLatexNodes(content)}
      </div>
    );
  }

  return (
    <div className="my-3" key={key}>
      {renderLatexNodes(content)}
    </div>
  );
}

function renderCommand(command: string, value: string, index: number) {
  let cursor = index + command.length + 1;

  if (value[cursor] === "*") cursor++;
  while (/\s/.test(value[cursor] ?? "")) cursor++;

  if (command in TEXT_COMMANDS) {
    const group = readBalancedGroup(value, cursor);
    if (!group) return null;
    const Component = TEXT_COMMANDS[command];
    return {
      node: <Component>{renderLatexNodes(group.content)}</Component>,
      end: group.end,
    };
  }

  if (["section", "subsection", "subsubsection"].includes(command)) {
    const group = readBalancedGroup(value, cursor);
    if (!group) return null;
    const className =
      command === "section"
        ? "my-4 text-xl font-semibold"
        : "my-3 text-lg font-semibold";

    return {
      node: <h3 className={className}>{renderLatexNodes(group.content)}</h3>,
      end: group.end,
    };
  }

  if (command === "href") {
    const href = readBalancedGroup(value, cursor);
    const text = href ? readBalancedGroup(value, href.end) : null;
    if (!href || !text) return null;

    return {
      node: (
        <a
          className="text-primary underline"
          href={href.content}
          rel="noreferrer"
          target="_blank"
        >
          {renderLatexNodes(text.content)}
        </a>
      ),
      end: text.end,
    };
  }

  if (command === "multirow") {
    const rows = readBalancedGroup(value, cursor);
    const width = rows ? readBalancedGroup(value, rows.end) : null;
    const content = width ? readBalancedGroup(value, width.end) : null;
    if (!rows || !width || !content) return null;

    return {
      node: <>{renderLatexNodes(content.content)}</>,
      end: content.end,
    };
  }

  if (IGNORED_COMMANDS.has(command)) {
    return { node: null, end: skipLatexArguments(value, cursor, 2) };
  }

  return null;
}

export function renderLatexNodes(input: string): LatexNode[] {
  const value = normalizeText(input);
  const nodes: LatexNode[] = [];
  let buffer = "";

  const flush = (key: string) => {
    if (!buffer) return;
    const chunks = buffer.split(/(\\\\)/g);
    chunks.forEach((chunk, index) => {
      if (!chunk) return;
      nodes.push(chunk === "\\\\" ? <br key={`${key}-br-${index}`} /> : chunk);
    });
    buffer = "";
  };

  for (let index = 0; index < value.length; index++) {
    const asymptote = readAsymptoteBlock(value, index);
    if (asymptote) {
      flush(`text-${index}`);
      nodes.push(renderAsymptoteDiagram(asymptote.content, `asy-${index}`));
      index = asymptote.end - 1;
      continue;
    }

    const math = readMathSegment(value, index);
    if (math) {
      const picture = renderPictureDisplay(math.content, `picture-${index}`);
      if (picture) {
        flush(`text-${index}`);
        nodes.push(picture);
        index = math.end - 1;
        continue;
      }

      buffer += math.content;
      index = math.end - 1;
      continue;
    }

    if (value[index] !== "\\") {
      buffer += value[index];
      continue;
    }

    const envMatch = value.slice(index).match(/^\\begin\{([A-Za-z*]+)\}/);
    if (envMatch) {
      const rawName = envMatch[1];
      const name = rawName.replace(/\*$/, "");
      const contentStart = skipEnvironmentArguments(
        value,
        name,
        index + envMatch[0].length,
      );
      const env = findEnvironmentEnd(value, rawName, contentStart);
      if (env) {
        if (MATH_ENVIRONMENTS.has(rawName)) {
          buffer += value.slice(index, env.end);
          index = env.end - 1;
          continue;
        }

        flush(`text-${index}`);
        nodes.push(renderEnvironment(name, env.content, `env-${index}`));
        index = env.end - 1;
        continue;
      }

      if (name === "enumerate" || name === "itemize") {
        flush(`text-${index}`);
        nodes.push(
          renderEnvironment(name, value.slice(contentStart), `env-${index}`),
        );
        break;
      }
    }

    const commandMatch = value.slice(index).match(/^\\([A-Za-z]+)/);
    if (commandMatch) {
      const rendered = renderCommand(commandMatch[1], value, index);
      if (rendered) {
        flush(`text-${index}`);
        if (rendered.node) nodes.push(rendered.node);
        index = rendered.end - 1;
        continue;
      }
    }

    buffer += value[index];
  }

  flush("text-end");

  return nodes;
}

interface LatexStatementProps {
  value: string;
  className?: string;
}

export function LatexStatement({ value, className }: LatexStatementProps) {
  return <div className={className}>{renderLatexNodes(value)}</div>;
}
