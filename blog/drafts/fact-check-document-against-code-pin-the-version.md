---
title: "Fact-checking a technical document against code: pin the code version first"
date: 2026-11-23
company: "Product management"
summary: "I asked an AI assistant to check a long research document against the source code. Its first list of errors was about fifteen items too long, because the code on my machine was a week old."
---

# Fact-checking a technical document against code: pin the code version first

A colleague sent me a long research document about how a core part of our product works today. Its first page said every section had been checked against the code. I asked an AI assistant to test that, and its first list of errors was about fifteen items too long.

The assistant split the document into four parts and gave each part to its own reader. Each reader opened the code and reported only the mismatches: the claim, the file and line, and what the code shows instead. They were told to ignore the document's own "verified" marks. The assistant then checked five of the most serious findings itself and reported them to me as confirmed errors.

Then I told it to run `git fetch`. The copies of the code on my machine were behind, and the document had been written against newer code than the assistant had read. Three of the five "confirmed" errors were not errors. The code they said was missing had been added after my copies were last updated. I had been handed a confident list of mistakes in a colleague's work, and a good part of it was my own stale checkout.

This is the order of work I use now:

1. Fetch before reading anything.
2. Take a read-only snapshot of the code at the document's date, so the working copy stays untouched:

```
git rev-list -1 --before="<date> 23:59" origin/develop
git archive <commit> src | tar -x -C <scratch folder>
```

3. Send each reader back to re-test its own findings on the snapshot, and to re-read any file that differs between the old copy and the snapshot.
4. Mark every finding "checked by hand" or "checked by a reader". A reader's report is another model's reading, so treat it as a lead.
5. List what was not checked. Hardware behavior cannot be read from code, and I had not opened the meeting minutes or the wiki pages the document cites. I wrote that down so the gaps do not look like approval.

The second pass left five real errors, about twenty claims that were too absolute or incomplete, and a short list of questions only a developer can answer. That is a list I can send to the author.

A fact-check compares two versions: the document and the code. If you do not know which code the author read, you cannot say that anything is wrong. You can only say it does not match the copy you have. So I now ask the author which commit they read, or I take the code as of the document's date, before I read the first claim.

The rule breaks when the author read a branch other than the main line. A snapshot by date is then still wrong, and only the author can tell you which one it was. For this document, that question is still open.
