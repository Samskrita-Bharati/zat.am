# Rock, Paper, Scissors (002-zpk)

Endless local play. Each choice plays r.mp3, p.mp3 or s.mp3 when sound is enabled.
Final/live score = round(wins / (wins + losses) * 100). Draws are excluded.
Until a win or loss exists, show a dash and disable submission. No minimum
round count is imposed. A single win can therefore produce 100; scoring
reflects chance-based match outcomes, not Sanskrit proficiency.

Submit My Score manually completes and saves the current cumulative snapshot
using ../js/game-score.js. Counters continue afterward. A new round is required
before another successful submission. Choices are disabled while saving.
Failed or signed-out submissions can be retried without losing counters.
The shared leaderboard determines the best-attempt display, not this game.
No Firebase write code is duplicated. Session duration is stored as metadata.

Uses ../shared/game-theme.css and ../js/navbar-loader.js. Serve the complete
repository through its normal development server and open /002-zpk/.
Keep the existing images and r.mp3, p.mp3, s.mp3. Requires real shared auth
configuration/network access for leaderboard submission.

Original project attribution (retained here rather than on the game page):
https://github.com/AmanRaj1608/awesome-rock-paper-scissor

Validation: JavaScript syntax and mocked behavior checks cover percentages,
draw exclusion, sound/mute, manual submit, duplicate blocking, continued play
and signed-out retries. Actual Firebase writes and browser/mobile rendering
must still be checked in the complete repository.
