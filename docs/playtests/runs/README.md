# Playtest run exports

Put each session's run file here, named `YYYY-MM-DD-<who>-<seed>.json`. Save it from `/play`
with **Download run (JSON)** on the summary, or **Save run (file)** during play.

Each file replays exactly: it holds the seed, the config, and every action. It also holds the
real timing (minutes per phase, decision type and round), which
`pnpm sim -- playtests` reads. Files saved before phase 14 have no timing. They still count for
rounds and end causes.
