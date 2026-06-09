# Last Light Protocol 🧟

A first-person 3D zombie survival shooter built with HTML5, Three.js, and Node.js.

## Features

- **First-person 3D gameplay** powered by Three.js r128
- **20 story missions** across 10 unique maps
- **8 zombie types** with unique AI, speeds, and attacks
- **5 weapons** — Pistol, Rifle, Shotgun, SMG, Sniper
- **Grenades**, loot, checkpoints, and boss fights
- **Online multiplayer** — up to 4 players with room codes
- **Full campaign** with cutscenes and dialogue
- **Mobile support** with virtual joysticks

## Quick Start (Singleplayer)

Just open `index.html` directly in a browser — the campaign works without a server.

```
index.html → open in browser → CAMPAIGN → select mission → play
```

## Multiplayer Server Setup

```bash
npm install
npm start
# Server runs on http://localhost:3000
```

Then open `http://localhost:3000` in multiple browser tabs or share your IP.

## Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move |
| Mouse | Look |
| Left Click | Shoot |
| R | Reload |
| G | Throw Grenade |
| Shift | Sprint |
| Ctrl / C | Crouch |
| Space | Jump |
| E | Interact / Advance Dialogue |
| I / Tab | Inventory |
| 1-5 | Switch Weapon |
| Esc | Pause |

## Deployment

### GitHub Pages (Singleplayer)
Push to GitHub → enable Pages → play instantly. No server needed for campaign.

### Multiplayer Server
Deploy `server.js` to any Node.js host (Heroku, Railway, Render, etc.):
```bash
npm start
```
Set `PORT` environment variable as needed.

## Maps

1. Apartment Complex
2. Downtown City
3. Highway of the Dead
4. Dead Forest
5. Hospital Zero
6. Subway Tunnels
7. Fort Deadlock (Military Base)
8. Abandoned Factory
9. Arctic Station Alpha
10. Necro-X Laboratory

## Zombie Types

| Type | HP | Speed | Notes |
|------|----|-------|-------|
| Walker | 80 | Slow | Standard infected |
| Runner | 60 | Fast | Sprints at the player |
| Spitter | 70 | Medium | Ranged acid attack |
| Screamer | 50 | Medium | Summons 3 walkers |
| Brute | 400 | Slow | Heavy damage tank |
| Stalker | 90 | Fast | Near-invisible until close |
| Mutant Alpha | 600 | Fast | Mid-game boss, 2 phases |
| Necro Titan | 2000 | Medium | Final boss, 3 phases |

## Tech Stack

- **Three.js r128** — 3D rendering
- **Web Audio API** — Procedural audio
- **Express + Socket.IO** — Multiplayer server
- Pure HTML/CSS/JS — no build tools required
