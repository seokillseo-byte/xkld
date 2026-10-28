#!/usr/bin/env python3
"""Dependency-free smoke checks for the static DuHocHaNoi public site."""
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "javascript", "data"}


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = set()
        self.links = []
        self.title_seen = False
        self.in_title = False
        self.description_seen = False
        self.lang = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if "id" in attrs:
            value = attrs["id"]
            if value in self.ids:
                self.duplicates.add(value)
            self.ids.add(value)
        for attr in ("href", "src"):
            value = attrs.get(attr)
            if value:
                self.links.append((tag, attr, value))
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description_seen = bool(attrs.get("content", "").strip())

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title_seen = True


def resolve_local_url(value, current_file):
    parsed = urlsplit(value)
    if parsed.scheme.lower() in SKIP_SCHEMES or value.startswith("//"):
        return None
    path = parsed.path
    if not path:
        return None
    if path.startswith("/"):
        candidate = ROOT / path.lstrip("/")
    else:
        candidate = current_file.parent / path
    if path.endswith("/") or candidate.is_dir():
        candidate = candidate / "index.html"
    return candidate.resolve()


def main():
    failures = []
    pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    if not pages:
        print("FAIL: no HTML pages found")
        return 1

    for page in pages:
        parser = PageParser()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as exc:
            failures.append(f"{page.relative_to(ROOT)}: cannot read/parse: {exc}")
            continue
        rel = page.relative_to(ROOT)
        if parser.lang != "vi":
            failures.append(f"{rel}: expected <html lang=\"vi\">")
        if not parser.title_seen:
            failures.append(f"{rel}: missing non-empty <title>")
        if page.name != "404.html" and not parser.description_seen:
            failures.append(f"{rel}: missing non-empty meta description")
        if parser.duplicates:
            failures.append(f"{rel}: duplicate id(s): {', '.join(sorted(parser.duplicates))}")
        for tag, attr, value in parser.links:
            if value.startswith("#"):
                anchor = value[1:]
                if anchor and anchor not in parser.ids:
                    failures.append(f"{rel}: missing in-page anchor #{anchor}")
                continue
            target = resolve_local_url(value, page)
            if target is not None and not target.exists():
                failures.append(f"{rel}: broken local {attr}={value}")

    if failures:
        print("Static site checks failed:")
        for failure in failures:
            print(f" - {failure}")
        return 1
    print(f"Static site checks passed: {len(pages)} HTML pages; local links, titles, descriptions, language and duplicate IDs checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
