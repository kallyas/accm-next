# Responsive Design (Phones)

- Target phones only; no tablet/desktop assumptions.
- Test across representative widths (e.g., 360, 375, 393, 412, 430 logical px).
- Use flexible constraints (`Expanded`, `Flexible`, `LayoutBuilder`) over fixed sizes.
- Handle long text, large text scaling, and dynamic content gracefully.
- Consider portrait-first; adapt carefully for landscape if enabled.

Avoid:
- Hard-coded widths/heights for core layout regions
- Content clipping under notches or gesture areas
- Hiding essential actions on smaller phones
