# कः समयः? (Sanskrit Clock)

An interactive Sanskrit learning aid for matching an analog clock with an
approximate Sanskrit time phrase. It is not a scored game.

## How to use

- Choose an hour (1–12) and minute (00–59), then click **Update** to refresh the
  Sanskrit reading for the displayed time. Readings use approximate five-minute
  intervals, and the hour selection keeps the current AM/PM half of the day.
- Click **Show live समयः** to switch a fixed time to the current local time.
  In live mode, clicking it again refreshes the clock and Sanskrit reading.
- A fixed time can be loaded directly with `hh` and `mm` URL parameters, such
  as `?hh=15&mm=30`. The URL uses 24-hour values for `hh` (0–23) and minute
  values for `mm` (0–59). Choosing a time in the dropdowns updates both values.

## Files

- `index.html` contains the clock drawing, time selection, and Sanskrit phrase
  logic.
- `style.css` styles the clock controls and responsive layout.
- `../shared/game-theme.css` supplies the shared page, instruction, card, and
  button styling.
- `../js/navbar-loader.js` loads the shared site navigation.
- [Sanscript](https://github.com/sanskrit-coders/sanscript) renders the clock
  numerals in Devanagari.

The clock drawing is based on the
[W3Schools HTML canvas clock](https://www.w3schools.com/graphics/canvas_clock_start.asp).
