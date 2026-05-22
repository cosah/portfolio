import os, re, fnmatch

src_root = 'src'
asset_files = set()
for root, dirs, files in os.walk('src/assets'):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), 'src/assets').replace(os.sep, '/')
        asset_files.add(rel)

referenced = set()
glob_dirs = set()
for root, dirs, files in os.walk(src_root):
    if 'assets' in root.split(os.sep):
        continue
    for f in files:
        if not f.endswith(('.jsx', '.js', '.css', '.html')):
            continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        for m in re.finditer(r"""['\"]\.\.\/assets\/([^'\"?]+)(\?[^'\"]*)?['\"]""", content):
            referenced.add(m.group(1))
        for m in re.finditer(r"""import\.meta\.glob\(['\"]\.\.\/assets\/([^'\"]+)['\"]""", content):
            glob_dirs.add(m.group(1))

glob_matched = set()
for pattern in glob_dirs:
    pat_dir, pat_name = os.path.split(pattern)
    for af in asset_files:
        af_dir, af_name = os.path.split(af)
        if af_dir == pat_dir and fnmatch.fnmatch(af_name, pat_name):
            glob_matched.add(af)

used = referenced | glob_matched
unused = asset_files - used

print(f"Total assets: {len(asset_files)}")
print(f"Referenced explicitly: {len(referenced)}")
print(f"Matched by glob: {len(glob_matched)}")
print(f"Unused: {len(unused)}")
print()
print("--- UNUSED FILES ---")
for u in sorted(unused):
    print(u)
