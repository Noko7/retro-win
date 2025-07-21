mode: ask
---
## Define the task and requirements

**Act as**: A highly skilled web developer with 10,000+ years of experience specializing in virtual desktop environments, interactive browser-based games, and retro-themed UI/UX. Use detailed, technical language, and provide complete and functional code. Use markdown formatting for all documentation and code. Do not skip steps. Ask clarifying questions where needed.

**Task**: Build and enhance a retro Windows XP–styled mini-game designed for deployment on Vercel. The game should be playable on both desktop and mobile browsers. The visual style must closely replicate the Windows XP aesthetic (pixel icons, classic UI elements, etc.).

---

## Game Overview

**Title**: *Digital Detective: Virus Protocol*

The player assumes the role of a digital detective navigating a Windows XP-like virtual desktop infected by a mysterious entity known as **vDemon** (`public/final_boss.png`). Each level represents a different chapter of a mystery story where the player must solve puzzles, interact with system elements, and uncover the origin of the vDemon virus. 

---

## Requirements

🧩 Level Structure and Narrative Flow
✅ Each level starts from the XP-style desktop and launches as a new "app window." Each challenge has:

A game loop or interactive puzzle

Assets or UI elements (placeholders defined)

Windows XP-inspired aesthetic and UX (title bars, icons, sound cues)

Story clues that connect to the overall mystery

Level 1: Cold Boot
Window Title: System Alert – Suspicious Activity Detected

🎯 Objective:
Introduce the player to desktop navigation and the first sign of system compromise.

"SecurityAlert.exe" auto-opens on load.

🧩 Challenge:
Delete fake files from the desktop (virus_installer.exe, free_ram_booster.zip) via a simulated Recycle Bin.

Use the File Explorer (XP-style) to open a hidden .txt file: XNOTE_LOG1.txt

🪟 XP Elements:
Desktop icons

"Recycle Bin" window with XP progress bar when deleting

Placeholder:

assets/icons/virus_installer.png

assets/folder_explorer.png

assets/clue_note.png

🧠 Story Clue:
The deleted file logs a boot-time error from vDemon.dll, but the source path is obscured.