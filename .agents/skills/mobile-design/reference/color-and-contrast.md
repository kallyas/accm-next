# Color and Contrast (Flutter Mobile)

1. Reuse existing theme definitions first (`ThemeData`, `ColorScheme`, `CupertinoThemeData`).
2. Prefer semantic roles over raw hex in widgets.
3. Ensure light and dark themes both work.
4. Keep contrast accessible:
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Interactive elements: 3:1 minimum against background
5. Limit palette complexity; keep a dominant brand color with clear accents.

Avoid:
- New ad-hoc colors when project tokens exist
- Pure black/white everywhere without tonal nuance
- Trendy default gradients that don't match product context
