export const CONTACT_EMAIL = "hello@cephalopod.studio"

// Single booking CTA target — swap for a scheduling link (Calendly/Cal.com) later
export const BOOKING_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contract work inquiry")}&body=${encodeURIComponent(
  "Hi Cephalopod Studio,\n\nI'd like to talk about a project. Here's a quick summary:\n\n"
)}`
