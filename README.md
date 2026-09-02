# RedDot

This repository uses GitHub Actions deployment quality gates to keep production releases safe.

## Quality gates
- `npm run lint`
- `npm run typecheck`
- `npm run test:coverage`
- `npm run build`

These checks must pass before deployment to `main`.
