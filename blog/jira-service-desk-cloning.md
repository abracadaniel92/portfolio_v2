# Automating Jira Service Desk ticket cloning for 15 people on 3 free seats

Jira Service Desk's free tier gave TSD Digital three seats. Fifteen
people needed to work the tickets that came through it, across 20
separate customer projects, and the budget had no room for more
licenses.

Buying more seats was on the table, and I turned it down. Paid seats in
that tier buy visibility, not workflow: a ticket sitting in a Service
Desk queue still isn't something you can drop into a sprint. Twelve
more people watching the same three people work the same queue doesn't
change who does the work. The actual problem was that the tickets
lived in a system the rest of the team couldn't act on, no matter how
many of them could see into it.

## What I built instead

20 Service Desk projects, one for each customer, each already
paired with a regular Jira project where the dev team actually
planned sprints. The fix was to keep the Service Desk projects as the
customer-facing front door and stop pretending the team needed to live
inside them.

**Automation one** cloned every new Service Desk ticket into its
matching regular project the moment it was created. 20 Service
Desk projects, 20 clones. Once a ticket existed as a real Jira
issue in a real project, anyone on the team could estimate it, assign
it, put it in a sprint, the same as any other piece of work. Nobody
needed a Service Desk seat to touch it.

**Automation two** cloned comments in both directions, so a customer
reply on the Service Desk side showed up on the dev-facing clone, and
a dev's update showed up back on the customer's ticket. That's the
part that could have gone wrong in an interesting way: developers
needed to leave real working notes, links to a PR, a question for
another dev, an offhand "this is going to take longer than our
response-time agreement with the customer says", without every one
of those notes reaching the customer. The
fix was a convention, not a permission system: a comment that starts
with the word "Internal" gets cloned onto the dev-facing ticket but
never makes it back across to the customer's side. Cheap to build,
easy to explain to the whole team in one sentence, and it held for as
long as I worked there.

**Automation three** sent Slack notifications for the two speeds
support tickets actually move at. Regular tickets got a normal post in
the team channel. Anything that looked urgent, matched by priority
field or by keyword, "payment not working", "can't log in", "customer
blocked", "critical", got an `@everyone` instead. Splitting those two
paths mattered as much as the automation itself: if every ticket pinged
the whole channel, people would have muted it inside a week, and the
one message that actually needed twelve people looking at it
immediately would have landed with exactly as much weight as the
hundredth routine password reset.

## What actually happened

This ran for the rest of my time at TSD Digital, across all 20
customer projects, without anyone needing a Service Desk seat beyond
the original three. The early failures were small and mechanical, not
structural: attachments didn't clone over the first time I wired
automation one, fixed by a checkbox in the automation configuration
I'd missed. Getting the internal-note convention right took a couple
of iterations before "starts with Internal" reliably kept dev
shorthand off a customer's screen while still letting a customer see
everything they were supposed to.

## What I'd change

The system worked better than I expected going in, which isn't a
sentence I get to write about most of the things I've built. If I set
it up again, I'd add the guardrail before the first ticket, not after
the first near-miss: nothing stopped a comment meant to stay internal
from reaching a customer except a dev remembering to type one word at
the start of it. That convention held for years because the habit
held, not because the system enforced it. A keyword typo, or someone
new who never got told the rule, was the actual risk the whole time,
and it's the kind of risk that's cheap to close early and expensive to
notice for the first time in front of a customer.
