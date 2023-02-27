# Glue

Glue aims to be an extremely opinionated design system, frontend, backend, database framework. It shares many design patterns and best practices across all of my web apps. It "glues" them together.

After building ~20 full-stack web apps, I realized that most websites follow a large set predicatable design patterns. If I'm able to capture this large set in a framework, I'll never have to write duplicate code for a design pattern I've implemented in the past.

It's currently closer to a glorified full-stack boilerplate. But I hope to build a full-stack framework some day. Opinionated frameworks limit customizability, but I hope to expand Glue to support all possible "common" variations of a web app.

I think this will be possible from a UX perspective rather than a software one. Users don't like UX that they've never experienced before. This encourages web builders to imitate UX that have been commonly implemented. If the intended UX repeats, so do design patterns to implement that UX.

Glue is the culmination of my ~5 years of full-stack web development. It's my ultimate pet project that I hope to cultivate until either the web or I am gone from this world. If Glue survives until my 30s or 40s, I hope to rename it to a more human name and consider it my "baby".

## Extend Glue root

1. Import this repo to clone it (click on the + sign at the top right side of the page)
2. Add glue remote

```bash
git remote add glue https://github.com/jay-joo-code/glue2-root.git
git fetch --all
git switch -c glue-main glue/main
```

## Add branch protection rules

Add branch protection rules in the repo settings to force users to create a PR + get approval to commit changes to main.

Refer to RideHub repo settings.

## Scripts

**Pushing specific commits to Glue root**

```bash
$ git checkout glue-main
$ git cherry-pick <commit-hash>
$ git push
```

**Setting upstream to glue/main**

```bash
$ git branch -u glue/main
```

**Push to glue/main**

```bash
git push glue glue-main:main
```

## Backend

The entire backend is handled by Pocketbase deployed for free on Fly.io. The development speed is significantly faster, since 99% of backend development is handled by Pocketbase.

https://github.com/pocketbase/pocketbase/discussions/537

## Sentry integration

https://github.com/getsentry/sentry-javascript/discussions/5838#discussioncomment-4591389
