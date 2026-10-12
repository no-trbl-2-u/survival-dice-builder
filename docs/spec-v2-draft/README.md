# Spec v2 draft

This folder holds the next rules issue while the designer reviews it.

- `RULINGS.md`: the designer's 32 rulings (oversight 2026-10-11) on
  every Spec v1 rule the engine plays differently.
- `01-spec-v2-rules.md`: the Spec v2 rules text written from Spec v1
  and those rulings (phase 34). It ends with a review table.

Signed off 2026-10-12: the rules now live at `spec/01-spec-v2-rules.md`.
This folder keeps the rulings and the draft as the record.

Before the sign-off, nothing here was the spec. `spec/` changes only at `/oversight`
(bearings rule 9). To sign off:

1. Read the review table; correct any rule in the draft.
2. At `/oversight`, copy the draft to `spec/01-spec-v2-rules.md` and
   point `spec.md` at it.
3. Unblock phase 41 (the engine on Spec v2) in
   `plan/steps/01_build_plan.md`.
