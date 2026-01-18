# Bucket Presentation Video

A professional animated presentation explaining the "Bucket" financial planning concept. Designed to be screen-recorded with voiceover for client use.

## Quick Start

1. Open `index.html` in a modern browser (Chrome recommended)
2. Click **Play** to start the 2-minute animation
3. Follow along with `VOICEOVER-SCRIPT.md` for narration

## Files

| File | Description |
|------|-------------|
| `index.html` | The animated presentation (self-contained, no dependencies) |
| `VOICEOVER-SCRIPT.md` | Complete script with timing cues for recording |
| `README.md` | This file |

## Recording Your Video

### Recommended Setup
- **Browser:** Chrome or Firefox (fullscreen mode - press F11)
- **Resolution:** 1920x1080 minimum
- **Screen Recorder:** OBS Studio, Loom, QuickTime, or similar

### Steps
1. Open `index.html` in your browser
2. Press F11 for fullscreen
3. Start your screen recorder
4. Click "Play" on the presentation
5. Read the voiceover script in sync with animations
6. Stop recording when the timer reaches 2:00

## Features

- **2-minute duration** - Perfect for client attention spans
- **Professional design** - Modern gradients and smooth animations
- **Timed narration cues** - On-screen text guides the presentation
- **Pause/restart controls** - Practice as many times as needed
- **Progress bar** - Visual timing reference
- **No dependencies** - Single HTML file, works offline

## Customization

The presentation can be customized by editing `index.html`:

### Colors
The color palette is defined in the `<style>` section:
- Primary gradient: `#667eea` to `#764ba2`
- Success/inflows: `#11998e` to `#38ef7d`
- Warning/outflows: `#ff6b6b`

### Timing
Adjust the `script` array in the JavaScript to change when elements appear:
```javascript
{ time: 12000, action: 'showInside', narration: "..." }
```

### Content
Modify the HTML elements to change labels, tap names, or asset types.

## The Bucket Concept

The bucket is a visual metaphor for financial planning:

- **Inside the bucket:** Liquid assets (cash, ISAs, shares) - accessible in 7-10 days
- **Outside the bucket:** Illiquid assets (home, pension, business) - can't spend directly
- **Inflows (top):** Income sources flowing into the bucket
- **Taps (bottom):** Expenditure draining from the bucket

The goal is to help clients understand whether their bucket will:
1. Run out too soon ("Not Enough")
2. Overflow at death ("Too Much")
3. Last just right ("Just Right")

---

*Based on Paul Armson's methodology for client engagement in financial planning.*
