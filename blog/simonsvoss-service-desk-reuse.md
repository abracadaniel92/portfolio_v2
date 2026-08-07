# Avoiding 60 Jira Service Desk licenses for a beta-testing program

SimonsVoss needed around 60 people able to work bug reports and
feature requests coming in from beta testers on a new web app. Buying
that many Jira Service Desk seats was never seriously on the table,
because I'd already solved this exact shape of problem somewhere else.

## The same reasoning, transplanted

The reasoning that killed the idea of buying seats was the same one
that killed it at the last place I built this: a paid seat buys
visibility into a queue, not a route into a sprint. Sixty people able
to look at a bug report doesn't get that bug report estimated,
assigned, or scheduled. It just means sixty people can watch it sit
there. What actually needed to happen was the same thing as before,
clone every incoming item into a project the dev team already worked
in, so a bug report became a normal piece of backlog the moment it
existed.

## What traveled, and what didn't

The core of it moved over unchanged. Automation one still cloned
every new Service Desk item into the matching regular project the
moment it was created. Automation two still cloned comments in both
directions, with the same convention protecting internal notes: a
comment that starts with the word "Internal" stays on the dev-facing
side and never crosses back to the person who filed the report.

Automation three needed a real change, not just a copy. SimonsVoss
runs on Microsoft Teams, not Slack, so the notification had to go
somewhere else entirely. The logic behind it, deciding what counted
as urgent enough to interrupt everyone versus what could sit in a
normal channel post, didn't need to change at all. Only the platform
underneath it did.

The project structure was the other real difference. TSD Digital had
twenty separate customer projects, one clone target for each. SimonsVoss
had one beta-testing pipeline feeding one dev backlog, not twenty
parallel ones, because this was one product's beta program, not twenty
separate client relationships. The cloning automation never cared
about that difference. It only ever needed a matching project to clone
into, whether there were one of those or twenty.

## What actually happened

Somewhere between 30 and 40 beta testers filed bug reports and feature
requests through the portal, and none of it needed the structural
adaptation I expected going in. No attachments failing to clone, no
iterating on the internal-note wording to get it right. It just
worked.

That's worth being honest about, because it isn't the same kind of
result as the first build. At TSD Digital, getting the internal-note
convention to reliably hide dev shorthand from a customer took a
couple of passes, and attachments didn't clone at all until I found a
checkbox I'd missed in the automation config. None of that friction
showed up here, not because this build was inherently easier, but
because it had already been paid for once, somewhere else.

The interesting part of this one isn't that it went smoothly. It's
that the roughness had already been spent on the first attempt, and a
second implementation of the same idea doesn't have to buy it twice.
