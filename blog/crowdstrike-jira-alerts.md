# Getting CrowdStrike and phishing alerts into Jira before I had admin rights

CrowdStrike alerts and InfoSecIQ phishing reports at Arcadia both
arrived by email. Neither had a direct line into Jira, and I didn't
have the admin rights to build one myself.

I wanted every one of those alerts to become a Jira ticket
automatically, tagged to whoever was on the infosec rotation, the
moment it landed. Waiting for someone else's calendar to open up and
grant the right access wasn't a plan. The inbox was the one thing I
already had.

## What I built

Google Apps Script, the serverless scripting layer built into Google
Workspace, checked the shared infosec inbox every five minutes. Rules
matched on keywords and tags in the subject and body to tell a
CrowdStrike detection apart from an InfoSecIQ phishing report a
teammate had forwarded in. A match created a Jira ticket and tagged
whoever was on rotation that week. Anything CrowdStrike flagged as
important also went to Slack, so the whole team saw it, not just the
one person the ticket was assigned to.

None of this needed admin rights on Jira or on CrowdStrike. It needed
access to a shared inbox, which I already had, and a Google account
to run the script from, which cost nothing.

## Not creating the same ticket twice

The obvious signal for "has this email already been handled" is
whether it's still unread. The script only looked at unread mail, so
anything already processed should have been invisible to the next
run.

Read status alone wasn't enough to trust. Anyone else with access to
that inbox could open an email and mark it read without a ticket ever
getting created, and some mail clients mark a message read just from
previewing it. Relying on read status by itself meant a real alert
could silently vanish with no ticket and no error, which is worse than
a duplicate.

So there were two rules, not one. The script only acted on unread
mail, and once it created a ticket, it did two things together: marked
the email read and applied a label. The label is what actually meant
"this one has a ticket", independent of how the read flag got set.
Unread and unlabeled meant genuinely new. Anything else, the script
left alone.

## What actually happened

Volume was never the problem. A good day produced five to seven
tickets; some days it was one. What mattered was that every one of
those alerts turned into a ticket with an owner and a timestamp
instead of sitting in an inbox only I could see. Before this, whether
something got acted on depended on someone opening that inbox.
Afterward, the five-minute polling cycle caught it and named a person
regardless of who happened to check email that day. The infosec
team's work also became visible next to everyone else's in Jira for
the first time, instead of living somewhere only I had access to.

The setup didn't stay static. Once I got admin rights later on, it
turned out CrowdStrike had a real Jira integration the whole time. We
switched to it and kept the Slack notifications from the original
build. InfoSecIQ's phishing reports never got that option. They still
run through the same inbox-polling script, because there was never a
native integration to switch to, only ever the one I'd built.

## What I'd change

"Check for the integration sooner" isn't advice I can actually give
myself here. For most of the time this ran, I had no access to
CrowdStrike itself, not even enough to see what integrations it
offered. The inbox was the one system I could see into, so that's
what got automated. CrowdStrike's integration existed the entire time
I was polling that inbox for it. The gap was never a technical one.
It was that using the real integration required access I didn't have,
and no amount of better scripting closes that. What I'd actually
change is pushing for visibility into the tools generating the alerts
earlier, not just the inbox they happened to land in, since that's
the one part of this that was ever actually in my control.
