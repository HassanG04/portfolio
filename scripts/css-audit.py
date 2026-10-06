"""Audit CSS selectors with balanced blocks, grouped conditions and keyframe exclusion."""
from collections import Counter, defaultdict
from pathlib import Path
import fnmatch
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
TOKEN = re.compile(r'/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|[{};]')

def blocks(text):
    start = depth = 0
    for match in TOKEN.finditer(text):
        token = match.group()
        if token == "{" and depth == 0:
            head, body = text[start:match.start()].strip(), match.end()
            depth = 1
        elif token == "{":
            depth += 1
        elif token == "}":
            depth -= 1
            if depth == 0:
                yield head, text[body:match.start()]
                start = match.end()
        elif token == ";" and depth == 0:
            start = match.end()

def split_selectors(head):
    return re.split(r',\s*(?![^()]*\))', head)

def rules(text, context=()):
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    for head, body in blocks(text):
        head = re.sub(r'\s+', ' ', head).strip()
        if head.startswith(('@media', '@supports', '@container', '@layer')):
            yield from rules(body, context + (head,))
        elif not head.startswith('@'):
            for selector in split_selectors(head):
                yield context, selector.strip(), body

def audit():
    files = sorted((ROOT / 'css').glob('*.css'))
    contents = {p.name: p.read_text(encoding='utf-8') for p in files}
    entries = [(name, *row) for name, text in contents.items() for row in rules(text)]
    pairs, owners = Counter(), defaultdict(set)
    for name, context, selector, _ in entries:
        pairs[context, selector] += 1
        owners[selector].add(name)
    allow = json.loads((ROOT / 'scripts/css-allowlist.json').read_text(encoding='utf-8'))
    source = '\n'.join(p.read_text(encoding='utf-8') for folder, glob in [('', '*.html'), ('js', '*.js'), *[(r, '*.html') for r in ['AI','ML','DS','DA','DE']]] for p in (ROOT / folder).glob(glob))
    classes = set(re.findall(r'\.([A-Za-z_][\w-]*)', '\n'.join(e[2] for e in entries)))
    missing = sorted(c for c in classes if not re.search(r'(?<![\w-])'+re.escape(c)+r'(?![\w-])', source) and not any(fnmatch.fnmatch(c, p) for p in allow['dynamic_classes']))
    duplicates = [{'conditions': list(k[0]), 'selector': k[1], 'count': n} for k, n in pairs.items() if n > 1]
    cross = {k: sorted(v) for k, v in owners.items() if len(v) > 1}
    return dict(duplicate_pairs=len(duplicates), cross_file_duplicates=len(cross), important=sum(len(re.findall(r'!important\b', re.sub(r'/\*[\s\S]*?\*/','',t))) for t in contents.values()), unreferenced_classes=len(missing), duplicates=duplicates, cross_file=cross, unreferenced=missing)

if __name__ == '__main__':
    result = audit()
    if '--json' in sys.argv:
        print(json.dumps(result, indent=2))
    else:
        for key in ['duplicate_pairs','cross_file_duplicates','important','unreferenced_classes']:
            print(f'{key}={result[key]}')
        for item in result['duplicates'][:12]:
            print('DUP', item)
