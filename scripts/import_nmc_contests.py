#!/usr/bin/env python3
"""Import NMC contests from valid_data.csv through the contests API."""

from __future__ import annotations

import argparse
import csv
import json
import random
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


QUESTIONS_PER_CONTEST = 12
SCRIPT_DIR = Path(__file__).resolve().parent
CSV_PATH = SCRIPT_DIR / "valid_data.csv"
API_URL = "https://numitz.vercel.app/api/contests"
START_NUMBER = 1
CONTEST_LIMIT: int | None = None
CONTEST_LENGTH_MINUTES = 180
DIFFICULTY = 800
POINTS = 1
DESCRIPTION = "NMC generated contest"
DRY_RUN = False


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import NMC contests from the hard-coded valid_data.csv path."
    )
    parser.add_argument(
        "-l",
        "--limit",
        type=int,
        default=CONTEST_LIMIT,
        help="Maximum number of contests to create.",
    )
    return parser.parse_args()


def first_start_time() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(microsecond=0) - timedelta(days=1)


def read_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        if not reader.fieldnames or len(reader.fieldnames) < 2:
            raise ValueError("CSV must have at least two columns.")

        description_field = reader.fieldnames[0]
        answer_field = reader.fieldnames[1]
        rows: list[dict[str, str]] = []

        for line_number, row in enumerate(reader, start=2):
            description = (row.get(description_field) or "").strip()
            answer = (row.get(answer_field) or "").strip()

            if not description or not answer:
                print(
                    f"Skipping row {line_number}: missing description or answer.",
                    file=sys.stderr,
                )
                continue

            rows.append(
                {
                    "description_latex": description,
                    "answer": answer,
                }
            )

    return rows


def problem_name(index: int) -> str:
    group = "A" if index < 6 else "B"
    number = (index % 6) + 1
    return f"{group}{number}"


def build_problem(row: dict[str, str], index: int) -> dict[str, Any]:
    name = problem_name(index)
    return {
        "id": "",
        "name": name,
        "submission_count": 0,
        "correct_submission_count": 0,
        "points": random.randint(10,50),
        "difficulty": DIFFICULTY,
        "likes": 0,
        "comments_num": 0,
        "tags": [],
        "description_latex": row["description_latex"],
        "description_html": None,
        "answer": row["answer"],
        "editorial": "",
        "index_in_contest": index,
    }


def build_contests(rows: list[dict[str, str]], limit: int | None) -> list[dict[str, Any]]:
    full_contest_count = len(rows) // QUESTIONS_PER_CONTEST
    if limit is not None:
        full_contest_count = min(full_contest_count, limit)

    contest_start = first_start_time()
    contest_end = contest_start + timedelta(minutes=CONTEST_LENGTH_MINUTES)
    contests: list[dict[str, Any]] = []

    for contest_offset in range(full_contest_count):
        contest_number = START_NUMBER + contest_offset
        chunk_start = contest_offset * QUESTIONS_PER_CONTEST
        chunk = rows[chunk_start : chunk_start + QUESTIONS_PER_CONTEST]

        contests.append(
            {
                "name": f"NMC {contest_number:02d}",
                "description": DESCRIPTION,
                "difficulty": DIFFICULTY,
                "start_date": contest_start.isoformat().replace("+00:00", "Z"),
                "end_date": contest_end.isoformat().replace("+00:00", "Z"),
                "length_in_minutes": CONTEST_LENGTH_MINUTES,
                "problems": [
                    build_problem(row, index) for index, row in enumerate(chunk)
                ],
            }
        )

    return contests


def post_contest(api_url: str, contest: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(contest).encode("utf-8")
    request = Request(
        api_url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    with urlopen(request, timeout=30) as response:
        response_body = response.read().decode("utf-8")
        return json.loads(response_body) if response_body else {}


def main() -> int:
    args = parse_args()

    if not CSV_PATH.exists():
        print(f"CSV file not found: {CSV_PATH}", file=sys.stderr)
        return 1

    rows = read_rows(CSV_PATH)
    contests = build_contests(rows, args.limit)
    leftover_count = len(rows) % QUESTIONS_PER_CONTEST

    if not contests:
        print("No full 12-question contests found in the CSV.", file=sys.stderr)
        return 1

    if leftover_count:
        print(
            f"Ignoring {leftover_count} leftover question(s) that do not make a full contest.",
            file=sys.stderr,
        )

    if DRY_RUN:
        for contest in contests:
            print(json.dumps(contest, indent=2, ensure_ascii=False))
        print(f"Dry run complete: {len(contests)} contest(s) prepared.", file=sys.stderr)
        return 0

    for contest in contests:
        try:
            result = post_contest(API_URL, contest)
        except HTTPError as error:
            error_body = error.read().decode("utf-8", errors="replace")
            print(
                f"Failed to create {contest['name']}: HTTP {error.code} {error_body}",
                file=sys.stderr,
            )
            return 1
        except URLError as error:
            print(f"Failed to reach {API_URL}: {error.reason}", file=sys.stderr)
            return 1

        contest_id = result.get("contest", {}).get("id", "unknown")
        print(f"Created {contest['name']} with id {contest_id}")

    print(f"Created {len(contests)} contest(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
