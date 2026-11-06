// Quarrel: The Far Watch (Apple Vision Pro). The app links to these paths
// (Quarrel/Quarrel/Views/SupportInfo.swift), so keep them stable:
// /quarrel/privacy and /quarrel/terms. /quarrel, /quarrel/support and /quarrel/privacy are entered in
// App Store Connect as the marketing, support and privacy policy URLs.

export const Q_NAME = "Quarrel"
export const Q_FULL_NAME = "Quarrel: The Far Watch"
export const Q_PITCH = "Throw the dice with your own hands, and power a fight on the table in front of you."

// The game is unreleased (it may go to Apple Arcade). Do not add a store link, a price or a release
// date here until there is a real listing. Combat is still being playtested, so describe the dice,
// not a combat style (real-time or turn-based). Embers, the Gate, the Daily Duel and multiplayer are
// not in v1: don't advertise them.

export const Q_PAGES = [
  { href: "/quarrel/support", label: "Support" },
  { href: "/quarrel/privacy", label: "Privacy Policy" },
  { href: "/quarrel/terms", label: "Terms of Use" },
]
