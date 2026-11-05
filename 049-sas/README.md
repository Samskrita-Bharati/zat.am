# Bhagavad Gita Shloka Collection — 049-sas

A learning and reading tool for exploring verses from all 18 chapters of the Bhagavad Gita. This page does not use scoring or leaderboard submission.

## How to use

1. Open the collection page and choose a chapter.
2. Use the up/down buttons or the existing impress.js keyboard navigation to move between slides.
3. Select a verse reference to open its page on Gita Supersite.
4. Select **Go Back** to return to the chapter list.

The collection page has an English/Sanskrit label switch. This switch changes the chapter selector labels; it does not translate the verse text.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Chapter selector with 18 links and a language switch |
| `collection.css` | Chapter selector layout, colors, and hover effect |
| `chapter.html` | Shared chapter presentation page |
| `chapter.js` | Reads the chapter parameter, builds slides, loads verses, and handles navigation |
| `chapter.css` | Shared presentation styles and controls |
| `verse.json` | Existing verse text, chapter/verse numbers, transliteration, and word meanings |
| `impress.js` | Existing presentation library; retains its original license notice |
| `cover.jpg` | Collection cover image |

The collection also uses the repository's shared game theme and navbar loader. Keep the surrounding Zat.am repository structure intact.

## Run locally

Serve the **repository root** with a local HTTP server. For example, if Python is installed:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/049-sas/`. Do not open the HTML directly with a `file://` URL: the chapter page fetches `verse.json`.

A chapter URL looks like:

```text
chapter.html?chapter=1
```

Valid chapter numbers are 1–18. Missing or invalid values fall back to chapter 1. Internet access is needed for the Sanscript CDN dependency, external verse references, and any network features used by the shared navbar.

## Cleanup

The shared chapter page replaces the repeated markup and scripts previously stored in `bg1.html` through `bg18.html`. The selected chapter now comes from the URL instead of a chapter-specific script.

Original slide positions, rotations, and introductory labels are stored in `chapter.js`. Verses remain in `verse.json`. Slides are populated before impress.js is initialized. The existing verse data and presentation library were not rewritten.

If removing the old `bg*.html` pages, update incoming links to the new chapter URLs or provide redirects. Old direct URLs will otherwise stop working.

## Validation

Automated checks covered all 18 chapters, verse text insertion, reference-link chapter and verse numbers, and both navigation buttons. JavaScript syntax was also checked. These checks used a simulated DOM; they do not replace browser testing of impress.js, responsive layout, keyboard behavior, or shared navbar features.

Before publishing, check each chapter in the browser, including the first and last slides, navigation wrapping, long verses, source links, and the return link. Check the chapter selector and hover effect on desktop and mobile.

## Credits

Original collection credited to Karanveer Masoun / Samskrita Bharati. Presentations use impress.js by Bartek Szopka and the existing Sanscript dependency. Verse reference links point to Gita Supersite at IIT Kanpur. Preserve the original project and dependency license notices.
