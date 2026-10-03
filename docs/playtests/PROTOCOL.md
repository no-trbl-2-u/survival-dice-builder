# Playtest protocol (one page)

Goal: turn real play into decisions for Spec v2. Target: **at least 5 solo runs** by the
designer and **3 co-op sessions** with others (spec phase C).

## Before (5 minutes)

1. Open the live build: https://survival-dice-builder.pages.dev/play. Note the commit or deploy
   date in the session notes.
2. Pick the player count (1-4) and a seed. Write both down. A new seed for each session.
3. Leave the config at "default rules" unless the session tests a change. If it does, note
   which value and why.
4. Sound and 3D dice: as the players like. They never change the result.
5. Start a timer for the teach.

## Teach (time it)

- Explain: the base, the 6-card deck that turns over (Prepare halves, then Combat halves),
  rolling and keeping dice, putting dice on Skills, the wave track, and how the run ends.
- Stop the timer when the first card is played. Write the teach time down.
- Answer questions during play, and write each one down (they are friction evidence).

## Play

- Play to the end of the run (the base or a player falls). Do not coach decisions.
- Note out loud moments: "tense", "tedious", "confused", "fun". A tally on paper is enough.
- If the session must stop early, still save the run: it counts as "unfinished".

## After

1. On the run summary, press **Download run (JSON)**. During play, **Save run (file)** does the
   same.
2. Rename the file `YYYY-MM-DD-<who>-<seed>.json`. Put it in `docs/playtests/runs/`.
3. Each player answers the survey (`SURVEY.md`), about 5 minutes. Paste the answers into
   `docs/playtests/sessions/YYYY-MM-DD-<who>.md` with the teach time and the notes.

## After all sessions

```bash
pnpm sim -- playtests --out docs/playtests/numbers.md
```

Copy the numbers into `REPORT.md` and fill in the friction points and proposed changes.
