---
name: Live visitor counting
description: Defines what the admin dashboard live visitor metric represents.
---

Count anonymous browser-tab sessions that have sent a visible-page heartbeat within the last two minutes. Do not derive the metric from request logs, IP addresses, or customer accounts.

**Why:** Request-based counts include bots and asset traffic, while IP-based counts merge multiple people and collect unnecessary identifying data. Tab heartbeats give a useful operational estimate without storing identity or IP.

**How to apply:** Preserve the two-minute active window and anonymous session identity when extending live analytics. Clearly distinguish this estimate from unique people, registered users, or historical visitor analytics.