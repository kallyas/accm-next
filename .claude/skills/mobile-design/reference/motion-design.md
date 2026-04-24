# Motion Design (Flutter)

- Motion must explain state changes, not decorate.
- Favor a few polished moments over many random micro-animations.
- Common duration bands:
  - 100-200ms: tap/feedback
  - 200-350ms: state transitions
  - 300-500ms: screen/section entrances
- Prefer smooth deceleration curves (no gratuitous bounce by default).
- Keep transitions interruptible when possible.
- Respect reduced-motion preferences.

Avoid:
- Slow, heavy transitions that block flow
- Animating everything
- Inconsistent animation language across screens
