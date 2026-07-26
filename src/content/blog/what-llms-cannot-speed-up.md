---
title: What LLMs Cannot Speed Up
date: 2026-07-26
description: LLMs are pitched as a 10x silver bullet for software. Here is where they help, where they don't, and why executives keep falling for it.
ogImage: ../../assets/blog/what_llms_cannot_speed_up/what_llms_cannot_speed_up_og_image.png
ogImageAlt: When (and When Not) to Use an LLM
---

Non-technical business people are incredibly susceptible to the silver bullet fallacy because they do not have the expertise to understand technical concerns while they are incentivized to decrease the cost of software production.

Silver bullet solutions are not new.
Forty years ago [Fred Brooks](https://en.wikipedia.org/wiki/Fred_Brooks) published "No Silver Bullet - Essence and Accidents of Software Engineering" [1].

In it Brooks describes what a silver bullet is, which boils down to this: a silver bullet is the idea that there is a simple solution to a complex problem.

I'll sum it up for you (with my slightly editorialized version) why silver bullet solutions exist, based on Brooks' paper:

- Business people do not understand software as it is an esoteric discipline in which they are not trained.
- Software looks like magic to them (which is why they describe programmers with supernatural monikers like "wizards" and "gurus").
- They are tasked with increasing profit on something they fundamentally do not understand.
- They are periodically presented with a solution to increase productivity by 10x (thus decreasing costs).
- The solution fails to deliver and costs are not lowered by 10x.

Brooks explains why this is in his core thesis.
There are two types of work: essential and accidental.
Essential is the work needed to model a business problem with software.
Accidental work is everything else, including mechanically typing code, testing, managing infrastructure, keeping track of technical debt, running sprints, and on and on.

He states that essential work cannot be reduced by an order of magnitude, but accidental work can through various means.
In the abstract, he puts a hard number on it: "Unless it is more than 9/10 of all effort, shrinking all the accidental activities to zero time will not give an order of magnitude improvement."
Because essential work is not reducible, the overall cost cannot be reduced by an order of magnitude.

It is my experience that this also applies to LLMs.
LLMs meaningfully increase the velocity of accidental work, but not essential work.
This is the exact leverage used to overpromise the capability of LLMs to non-technical business people who cannot distinguish between essential vs. accidental work.

## Essential vs. Accidental Work Across Two Dimensions

I look at essential vs. accidental work through two dimensions.
Examining each dimension shows where the work is essential and where it is accidental.
Later I overlay the two into a single map of where an LLM helps.

### The First Dimension: Software Development Life Cycle (SDLC)

If you are not familiar with the SDLC, tech professionals use it to develop software:

1. Planning
2. Analysis
3. Design
4. Implementation
5. Testing
6. Deployment
7. Maintenance

As the SDLC continues from steps 1 to 7, the type of work shifts.
It goes from almost pure essential work to a mix of essential and accidental work.

Planning and analysis are focused on the essential business problem and how to solve it.
During planning, a basic plan to solve some problem, based on business requirements, is developed.
During analysis, the plan is translated into another high-level actionable plan that takes into account available resources.
Producing the artifacts of these stages (documents and diagrams) is not particularly challenging accidental work.
The challenging, and far more important, part is identifying a problem and pragmatically scoping it to the business's resources and target customers' needs.

Design, i.e., creating a concrete plan for the software beyond simple textual requirements artifacts, is where the accidental work ramps up in the SDLC.
The essential work is modeling the proposed software requirements as UI and backend services based on planning and analysis artifacts.
Producing design docs (the artifacts of this stage) requires more technical expertise and is far more labor-intensive.
Tools (e.g., Figma and diagramming software) exist to speed up this mechanical work, but the essential work and the expertise of the designer underpins it.

During implementation, i.e., producing the actual code, the accidental work skyrockets.
But "writing" the code is not merely typing it out like a stenographer recording the proceedings in a court of law line-by-line start to finish.
Essential work is woven into almost every task along with the accidental work.
Every step of the way the developer has to ask, "Does this change make sense according to the design, analysis, and planning artifacts?"

Testing, the act of automatically or manually reviewing the software for defects, is itself accidental work.
However, software testers, like designers and software engineers, are fundamentally concerned with essential work.
Examining how the software behaves, and judging whether it meets its intended goals, is essential work.

Deployment is almost purely accidental work.
It is concerned with the mechanics of deploying software to servers and providing training (or training artifacts such as guides) to users.

Maintenance is also mostly accidental work.
For example, patching servers is an example of accidental work, but essential work comes to the forefront when fixing bugs or developing new features.
The maintainer has to understand what the software's correct behavior is (essential work) to fix or extend it with new code (accidental work).

### The Second Dimension: Domain vs. Non-Domain Functionality

From the examination of the SDLC, we can see that each stage has a mixture of essential and accidental work.
How do you distinguish between the two at a more granular level?
Broadly speaking, essential work and accidental work map to domain and non-domain functionality, respectively.

An easy way to identify domain-specific functionality is to ask, "Would this functionality exist if the business did their work on paper?"
For example, a bank would still offer bank transfers if they did not use computers.
In contrast, a bank would not try to replicate their website's navigation menu in a paper system.
A navigation menu is therefore non-domain functionality.

The primary characteristic of domain-specific functionality is that it models a business process.
This makes it essential work.

Since non-domain functionality does not model a business process, it can largely be considered accidental work.

This mapping is a heuristic, not a hard rule.
Whether a piece of functionality counts as domain work often depends on the business.
Search is generic plumbing on a blog, but on a shopping site product search is central to how the business sells, which pushes it toward domain work.
Classify each feature by what it means to that specific business rather than by its generic name.

If you are a software engineer reading this, you already see where this is going.
LLMs shrink the accidental activities, but they leave the essential work untouched.
Overall productivity cannot rise by 10x, so costs do not fall by anything close to it.

## When to Switch Between Centaur and Reverse Centaur

A "centaur" is a human helped by a machine.
A "reverse centaur" is a machine helped by a human.

The framing comes from Cory Doctorow, whose book The Reverse Centaur's Guide to Life After AI is built on it [2].

With an LLM, working as a centaur means you produce the work and the LLM gives feedback.
You make the decisions.
Working as a reverse centaur means the LLM produces the work and makes the decisions while you review and approve its output.
The LLM makes the decisions, and you are the safety check.

This is where the two dimensions come together.
Cross the SDLC against domain versus non-domain functionality, and you get a map of which mode to work in.
The rows are the SDLC phases.
The columns are domain and non-domain functionality.
Each cell is the mode to use.

| SDLC phase                 | Domain functionality        | Non-domain functionality        |
|----------------------------|-----------------------------|---------------------------------|
| Planning and analysis      | Centaur                     | Centaur                         |
| Design                     | Centaur                     | Centaur, LLM drafts boilerplate |
| Implementation and testing | Centaur, LLM drafts         | Reverse centaur is safe         |
| Deployment and maintenance | Centaur on behavior changes | Reverse centaur is safe         |

Read the table from the top-left corner to the bottom-right corner.
The top-left is planning a business capability, which is almost pure essential work, so you stay a centaur.
The bottom-right is shipping and patching non-domain plumbing, which is almost pure accidental work, so you can be a reverse centaur.

Reverse centaur is only safe when you can review the output.
Reviewing means you can tell whether the result is correct.
If you cannot, you are only trusting the LLM, which puts you outside the safe zone.

The column alone does not fix the mode.
The off-diagonal corners of the table show why this is.
The bottom-left is a maintenance task on domain code.
It looks like a small mechanical fix late in the SDLC, but changing domain behavior is essential work, so you stay a centaur.
The top-right is an early non-domain choice, such as picking a message queue.
It is accidental work, but the cost of getting it wrong is high, so it requires your review even though an LLM could pick one.

You do not choose one mode per project.
Instead, you switch modes inside a single task.
Adding a bank transfer feature is domain work, so you lead the design and the business rules.
The form validation, the API scaffolding, and the surrounding boilerplate are non-domain work, so you can let the LLM lead those and review the result.
The moment the LLM starts making domain decisions for you, such as what counts as a valid transfer or how to handle a failed one, switch back to being a centaur.

The tell that you have drifted too far is simple to identify.
You are approving diffs you could not have written yourself and cannot fully explain.
When that happens on essential work, you have become the reverse centaur on a task that needed a centaur.
A software engineer, or ANY employee, should never act as a reverse centaur for work they do not already know how to do.

## Beyond Essential vs. Accidental Work: Why Non-Experts Are Bamboozled by LLMs

LLMs seem impressive to non-experts, and non-experts cannot spot mistakes in their output.
This is now an extremely well-researched phenomenon.
It is at the heart of why non-technical business people in the software business are bamboozled.

"Large language models eroding science understanding: an experimental study" (Collins et al., 2026) [3] found that because LLMs speak with linguistic proficiency and professional authority, non-experts are impressed by them and view them as accurate.
Actual domain-specific experts reviewed the exact same output and found that models frequently provided incorrect data.

"Clinical Large Language Model Evaluation by Expert Review (CLEVER): Framework Development and Validation" (Kocaman, 2026) [4] noted similar behavior in AI evaluation.
When everyday users or general evaluators look at a medical response from a model like GPT-4, they rate it exceptionally highly because it sounds empathetic, clear, and structured.
However, when medical professionals graded the exact same text, they found it missed critical clinical nuances, misinterpreted diagnostic priorities, and presented subtle but dangerous medical misinformation.

"Large language models in daily life: Users' perceptions of beneficial assistance and undue reliance" (Nylund et al., 2026) [5] describes a related phenomenon: low-skill people are way more impressed with LLM output than high-skill people.
For example, an LLM can produce higher-quality work than a novice writer can themselves, but the novice writer does not have the expertise to critically analyze the LLM's output.

None of these studies is about software, and they do not need to be.
The gap they measure is between experts and non-experts, not between fields, so it carries into software just as it does into science and medicine.
When the software is judged by a non-technical executive, that executive is the non-expert.

It is this one weird trick: the LLM sounds like it knows what it's talking about.

Non-technical people running software companies, incentivized to cut costs, are absolutely taken by this.
This is not a condemnation of such people.
From their perspective, they must lower costs to increase profit.
But it is a fundamentally intractable economic problem of the software business: software development professionals are needed to generate profit, but paying them decreases profit.
It is like starving the goose that lays the golden eggs to save on feed.

## References

1. Fred Brooks, ["No Silver Bullet - Essence and Accidents of Software Engineering"](https://www.cs.unc.edu/techreports/86-020.pdf), 1986.
2. Cory Doctorow, ["Reverse centaurs"](https://pluralistic.net/2021/02/17/reverse-centaur/), Pluralistic, 2021.
3. Collins et al., ["Large language models eroding science understanding: an experimental study"](https://arxiv.org/pdf/2604.25639), 2026.
4. Kocaman, ["Clinical Large Language Model Evaluation by Expert Review (CLEVER): Framework Development and Validation"](https://pubmed.ncbi.nlm.nih.gov/41343765/), 2026.
5. Nylund et al., ["Large language models in daily life: Users' perceptions of beneficial assistance and undue reliance"](https://firstmonday.org/ojs/index.php/fm/article/download/14598/12153), First Monday, 2026.
