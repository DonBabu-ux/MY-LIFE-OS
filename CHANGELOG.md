# Changelog

All notable changes to MyLifeOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Project skeleton with React Native 0.76, TypeScript strict mode
- Monorepo structure: `app/`, `server/`, `shared/`, `docs/`, `scripts/`, `tests/`
- Design system tokens: colors, typography, spacing, radii, shadows, motion
- ThemeProvider with system dark mode support
- UI primitives: Text, Button, Card, Input, Chip, Badge, Divider, Icon, Spinner
- Layout components: Screen, Header, Section, EmptyState
- Feedback components: Toast, Sheet, Dialog, Skeleton
- Data display components: StatTile, Sparkline, ProgressRing
- Navigation skeleton: RootNavigator, BottomTabs (Dashboard, Money, Vault, Plan, More)
- Placeholder screens: Dashboard, Lock, Onboarding, Settings, NotFound
- Feature module scaffolding: finance, receipts, shopping, notes, diary, planner, usage, activity, contacts
- Bootstrap sequence (no-op stubs)
- Shared entities and validators
- Root hygiene files: README, CHANGELOG, LICENSE, .env.example, .editorconfig, .gitignore
