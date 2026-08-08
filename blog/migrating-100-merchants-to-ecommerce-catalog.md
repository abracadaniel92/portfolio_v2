---
title: "Migrating 100 merchants from a daily-deals platform to a real e-commerce catalog"
date: 2026-05-18
company: "Ananas.mk"
summary: "Fewer than 10% of the merchants moving off Grouper used the integration API built for the job. The other ninety-plus filled in a spreadsheet, and that is where five months of work actually happened."
---

# Migrating 100 merchants from a daily-deals platform to a real e-commerce catalog

Fewer than 10% of the roughly 100 merchants moving off Grouper onto
Ananas used Ananas's own integration API. The other ninety-plus did it
by filling in a spreadsheet, and that's where most of five months of
work actually happened.

Grouper was North Macedonia's Groupon clone: daily-deal listings, one
product at a time, submitted through a simple form. Ananas runs closer
to Amazon, merchants get a persistent storefront and a real catalog,
not a rotating deal. Moving a merchant from one to the other means
turning whatever they had into a catalog that can hold up to actual
fulfillment, and most of them had never needed one before.

## The obvious path, and who it didn't work for

The clean way to migrate a merchant is the API. Ananas already had one:
structured fields, validation on submit, nothing left to guess about
formatting. For a merchant with a developer, or even someone
comfortable writing a script against a REST endpoint, that's most of a
day's work and it's done correctly the first time. We offered it as the
default option for exactly that reason.

It didn't hold up against who these merchants actually were. Grouper's
merchant base had been selling one deal a week through a form, not
running a technical operation with anyone on staff who could write an
integration. Fewer than 10% of the roughly 100 merchants could actually
staff that path. Everyone else needed a way in that didn't require a
developer, so the fallback became the real migration path: export a
spreadsheet in Ananas's format, upload it, go live.

## What a deal-listing catalog looks like once you ask it to be a real one

The spreadsheet path is accessible in a way the API isn't. It's also
where years of Grouper's own product-listing habits stopped matching
what a real catalog needs, in ways that had nothing to do with anyone
making a data-entry mistake.

A shirt sold in five colors on Grouper was one deal, one SKU, one
photo, because nobody browsing a daily deal needed to pick a color from
a dropdown. Ananas needs one SKU per sellable variant, so a single
spreadsheet row was expected to become five, and there was no existing
process on the merchant's side that had ever produced that. Some
merchants had no SKU system at all, because a deal listing never
required one. Barcodes were the same story: nothing about running a
daily deal checks a product against a scanner in a warehouse, so a lot
of merchants simply had none to give us. Product photography was
inconsistent for the same underlying reason: some merchants sent one
photo meant to cover every color variant, a few sent none. And because
none of these merchants had ever needed to produce a structured export
before, some of the exports themselves were just slow to generate.

None of that is carelessness. It's what happens when a catalog built to
answer one question, "what's today's deal," gets asked to answer a
different one, "what exactly do you sell, in what quantity, in what
color, with what barcode."

## Five months, and a number that didn't move

The migration ran five months. About 60% of the files merchants
actually submitted needed manual correction on our side before they
were usable on the site, and that number held roughly steady for the
whole five months, regardless of how much upfront education we ran.

We built four things to keep that 60% from creeping toward 100%:

- A SKU generator that took one row describing N color variants and
  split it into N real SKUs automatically, instead of asking each
  merchant to do that by hand.
- People sent out in person to merchants who had no usable product
  photos, to get real ones taken.
- Onboarding sessions that walked merchants through Ananas's format
  and field requirements before they submitted a file, not after it
  came back rejected.
- A standing support process for merchants who didn't understand the
  new rules well enough to pull the right fields out of their own
  systems on their own.

Even with all four running, more than half of every batch that came in
still needed someone on our side to open the file and fix it before it
could go live. The education work didn't make the correction load go
away. What it did was keep the number from climbing past 60% as more
merchants came through, which, over five months and roughly 100
merchants, is the difference between a migration that finishes and one
that doesn't.

## What I'd change

The real regret isn't the tooling, it's that we found out what these
merchants needed one merchant at a time instead of learning it upfront
from all of them at once. The API sat underused for the same reason so
many spreadsheets came back broken. Most of these merchants never had
the technical background or support to use it, and we discovered that
fact over five months of submissions instead of in a single room
before the first file went out.

If I ran this again, I'd hold a workshop before picking a migration
path for anyone. Sit down with the merchants, understand how their
businesses actually produced product data, and work out an approach
the whole room agrees to and understands before anyone submits a file,
rather than one we chose for them and explained afterward. That's the
difference between spending five months teaching the rules one
correction at a time and spending a day agreeing on them once.
