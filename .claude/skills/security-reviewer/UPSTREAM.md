# Upstream and license

`security-reviewer` is **third-party, vendored unmodified**. It is not written for
this site and does not encode any of its conventions.

- **Upstream:** the `security-skills-claude-code` project, at
  `skills/Security Assessment/Security-automated-claude-skills/.claude/skills/security-reviewer/`.
  A local clone lives at `C:\Users\Admin\Desktop\Cursor\security-skills-claude-code`.
- **Vendored copy verified byte-identical to upstream:** 2026-08-07.

If you need to change its behavior for this repo, prefer updating from upstream
and layering repo-specific rules in `CLAUDE.md` instead of editing these files.
Once this copy diverges, it stops being refreshable and the note above becomes a
lie. Re-verify with:

```sh
diff -rq "../../../../security-skills-claude-code/skills/Security Assessment/Security-automated-claude-skills/.claude/skills/security-reviewer" .
```

The first-party skills in this folder (`brutalist-style`, `blog-post-writer`,
`text-checker-en`) are ours and carry no upstream.

---

MIT License

Copyright (c) 2026 Security Skills Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
