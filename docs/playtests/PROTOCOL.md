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

Teach these rules (generated from the game's config: `pnpm sim -- kit`):

<!-- kit:teach -->
- Keep the base standing for as many rounds as you can. The run ends when the base falls.
- Your 10-card deck is played twice each round: top halves in Prepare, then bottom halves in Combat. Draw 5 at a time.
- Step off the edge of the map to reveal a new tile; the step costs 1 hex of movement. Each new tile's spawn nodes add enemies at every Combat. Enemies head for the nearest structure, and turn to a player only when the player is at least 2 hexes nearer.
- Gather 2 on an unspent gathering node (the node is spent). Each node gives materials once.
- Combat: Play a card's Engage option (on Move and Gather) to roll your dice from where you stand, plus the enemy dice of each enemy next to you (a grunt rolls 1, an elite 2). Put your dice on your Skills one at a time. When you choose End engagement or no dice are left, every enemy die hits you at once, even the dice of an enemy you defeated. Your guard takes the damage first, then your health. Play or discard each card. Cards you do not play yet stay in your hand between engagements, and Combat ends when every hand and deck is empty.
- A player at 0 health is knocked out and comes back next round with half of their maximum health, rounded up. They lose all their materials and currency.
- Every 2 rounds, once the Training Ground is open, each player drafts a Skill. The Skills you do not keep go to your pool. Later drafts offer them again.
<!-- /kit:teach -->

- Stop the timer when the first card is played. Write the teach time down.
- Answer questions during play, and write each one down (they are friction evidence).

## Play

- Play to the end of the run (the base falls). Do not coach decisions.
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
