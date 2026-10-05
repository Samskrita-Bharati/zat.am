from pathlib import Path
import argparse
import os
import re
import sys


# =========================================================
# PROJECT PATHS
# =========================================================

ROOT = Path(__file__).resolve().parent

APP_JS = ROOT / "app.js"

NAVBAR_LOADER = (
    ROOT
    / "js"
    / "navbar-loader.js"
)


# =========================================================
# SPECIAL DIRECTORIES TO SKIP
# =========================================================

# BP26 already has its own special navbar integration.
SKIP_DIRS = {
    "bp26",
}


# =========================================================
# NAVBAR HTML
# =========================================================

NAVBAR_MOUNT = (
    '<div id="navbar-mount"></div>'
)


# =========================================================
# READ GAME DIRECTORIES FROM app.js
# =========================================================

def extract_game_dirs():
    if not APP_JS.exists():
        print()
        print(
            "❌ app.js was not found:"
        )
        print(
            f"   {APP_JS}"
        )
        print()

        sys.exit(1)

    content = APP_JS.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    # Supports:
    #
    # dir: "001-sbg"
    #
    # and:
    #
    # dir: '001-sbg'
    #
    pattern = re.compile(
        r"""dir\s*:\s*["']([^"']+)["']"""
    )

    directories = []

    for match in pattern.finditer(
        content
    ):
        directory = (
            match.group(1)
            .strip()
        )

        if not directory:
            continue

        # ---------------------------------------------
        # Ignore external links
        # ---------------------------------------------

        if directory.startswith(
            (
                "http://",
                "https://",
                "mailto:",
                "tel:",
            )
        ):
            continue

        # ---------------------------------------------
        # Ignore special sections
        # ---------------------------------------------

        if directory in SKIP_DIRS:
            continue

        # ---------------------------------------------
        # Avoid duplicates
        # ---------------------------------------------

        if directory not in directories:
            directories.append(
                directory
            )

    return directories


# =========================================================
# FIND GAME ENTRY FILE
# =========================================================

def find_game_entry_file(
    game_path,
):
    """
    Find the primary entry page.

    Supports:
    index.html
    index.htm
    """

    candidates = (
        "index.html",
        "index.htm",
    )

    for candidate in candidates:
        candidate_path = (
            game_path
            / candidate
        )

        if candidate_path.exists():
            return candidate_path

    return None


# =========================================================
# CALCULATE NAVBAR LOADER PATH
# =========================================================

def loader_path_for(
    html_file,
):
    """
    Calculate the path from the game's
    HTML file to /js/navbar-loader.js.

    Example:

    /001-sbg/index.html

    becomes:

    ../js/navbar-loader.js
    """

    relative = os.path.relpath(
        NAVBAR_LOADER,
        html_file.parent,
    )

    relative = relative.replace(
        os.sep,
        "/",
    )

    if not relative.startswith("."):
        relative = (
            "./"
            + relative
        )

    return relative


# =========================================================
# CHECK WHETHER NAVBAR ALREADY EXISTS
# =========================================================

def already_has_navbar(
    html,
):
    return (
        'id="navbar-mount"'
        in html

        or

        "id='navbar-mount'"
        in html
    )


def already_has_loader(
    html,
):
    return (
        "navbar-loader.js"
        in html
    )


# =========================================================
# ADD data-page="games"
# =========================================================

def set_games_data_page(
    html,
):
    """
    Makes sure the body becomes:

    <body data-page="games">

    while preserving existing body attributes.
    """

    body_pattern = re.compile(
        r"<body\b([^>]*)>",
        flags=re.IGNORECASE,
    )

    match = body_pattern.search(
        html
    )

    if not match:
        return html, False

    attributes = (
        match.group(1)
    )

    # ---------------------------------------------
    # Existing data-page
    # ---------------------------------------------

    if re.search(
        r"\bdata-page\s*=",
        attributes,
        flags=re.IGNORECASE,
    ):

        new_attributes = re.sub(
            r"""data-page\s*=\s*["'][^"']*["']""",
            'data-page="games"',
            attributes,
            count=1,
            flags=re.IGNORECASE,
        )

    # ---------------------------------------------
    # No data-page yet
    # ---------------------------------------------

    else:
        new_attributes = (
            attributes.rstrip()
            + ' data-page="games"'
        )

    new_body = (
        "<body"
        + new_attributes
        + ">"
    )

    html = (
        html[:match.start()]
        + new_body
        + html[match.end():]
    )

    return html, True


# =========================================================
# ADD NAVBAR MOUNT
# =========================================================

def add_navbar_mount(
    html,
):
    """
    Inserts:

    <div id="navbar-mount"></div>

    immediately after <body>.
    """

    if already_has_navbar(
        html
    ):
        return html, True

    body_pattern = re.compile(
        r"<body\b[^>]*>",
        flags=re.IGNORECASE,
    )

    match = body_pattern.search(
        html
    )

    if not match:
        return html, False

    insertion = (
        "\n"
        "\n"
        "    <!-- Shared Zat.am Navbar -->\n"
        f"    {NAVBAR_MOUNT}\n"
    )

    html = (
        html[:match.end()]
        + insertion
        + html[match.end():]
    )

    return html, True


# =========================================================
# ADD NAVBAR LOADER
# =========================================================

def add_navbar_loader(
    html,
    html_file,
):
    """
    Adds the existing shared navbar loader
    immediately before </body>.
    """

    if already_has_loader(
        html
    ):
        return html, True

    loader_src = loader_path_for(
        html_file
    )

    script = (
        "\n"
        "\n"
        "    <!-- Shared Zat.am Navbar -->\n"
        "    <script\n"
        '      type="module"\n'
        f'      src="{loader_src}"\n'
        "    ></script>\n"
    )

    # ---------------------------------------------
    # Preferred: before </body>
    # ---------------------------------------------

    body_close = re.search(
        r"</body\s*>",
        html,
        flags=re.IGNORECASE,
    )

    if body_close:
        html = (
            html[:body_close.start()]
            + script
            + html[body_close.start():]
        )

        return html, True

    # ---------------------------------------------
    # Fallback: before </html>
    # ---------------------------------------------

    html_close = re.search(
        r"</html\s*>",
        html,
        flags=re.IGNORECASE,
    )

    if html_close:
        html = (
            html[:html_close.start()]
            + script
            + html[html_close.start():]
        )

        return html, True

    return html, False


# =========================================================
# INTEGRATE ONE GAME FILE
# =========================================================

def integrate_file(
    html_file,
    apply_changes,
):
    original = html_file.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    html = original

    # ---------------------------------------------
    # Step 1:
    # body data-page="games"
    # ---------------------------------------------

    html, body_ok = (
        set_games_data_page(
            html
        )
    )

    # ---------------------------------------------
    # Step 2:
    # navbar mount
    # ---------------------------------------------

    html, mount_ok = (
        add_navbar_mount(
            html
        )
    )

    # ---------------------------------------------
    # Step 3:
    # navbar loader
    # ---------------------------------------------

    html, loader_ok = (
        add_navbar_loader(
            html,
            html_file,
        )
    )

    # ---------------------------------------------
    # Unusual HTML structure
    # ---------------------------------------------

    if not (
        body_ok
        and mount_ok
        and loader_ok
    ):
        return "warning"

    # ---------------------------------------------
    # Already correct
    # ---------------------------------------------

    if html == original:
        return "already"

    # ---------------------------------------------
    # Save only with --apply
    # ---------------------------------------------

    if apply_changes:
        html_file.write_text(
            html,
            encoding="utf-8",
        )

    return "changed"


# =========================================================
# MAIN
# =========================================================

def main():
    parser = argparse.ArgumentParser(
        description=(
            "Integrate the existing "
            "Zat.am shared navbar into "
            "all local games listed "
            "in app.js."
        )
    )

    parser.add_argument(
        "--apply",
        action="store_true",
        help=(
            "Actually modify the game files. "
            "Without --apply, only a dry run "
            "is performed."
        ),
    )

    args = parser.parse_args()

    # =====================================================
    # SAFETY CHECK
    # =====================================================

    if not NAVBAR_LOADER.exists():
        print()
        print(
            "❌ Existing navbar loader "
            "was not found:"
        )

        print(
            f"   {NAVBAR_LOADER}"
        )

        print()

        sys.exit(1)

    # =====================================================
    # READ GAMES
    # =====================================================

    game_dirs = (
        extract_game_dirs()
    )

    if not game_dirs:
        print()
        print(
            "❌ No local game directories "
            "were found in app.js."
        )
        print()

        sys.exit(1)

    # =====================================================
    # HEADER
    # =====================================================

    print()
    print(
        "======================================"
    )

    if args.apply:
        print(
            "ZAT.AM GAME NAVBAR INTEGRATION"
        )
    else:
        print(
            "ZAT.AM NAVBAR DRY RUN"
        )

    print(
        "======================================"
    )

    print()

    print(
        f"Found {len(game_dirs)} "
        "local game directories in app.js."
    )

    print()

    # =====================================================
    # RESULT COLLECTIONS
    # =====================================================

    changed = []

    already = []

    missing = []

    warnings = []

    # =====================================================
    # PROCESS GAMES
    # =====================================================

    for game_dir in game_dirs:

        game_path = (
            ROOT
            / game_dir
        )

        print(
            f"Checking: {game_dir}"
        )

        # ---------------------------------------------
        # Missing game directory
        # ---------------------------------------------

        if not game_path.exists():
            print(
                "   ⚠️ Folder does not exist"
            )

            missing.append(
                game_dir
            )

            continue

        # ---------------------------------------------
        # Find index.html or index.htm
        # ---------------------------------------------

        html_file = (
            find_game_entry_file(
                game_path
            )
        )

        if html_file is None:
            print(
                "   ⚠️ No index.html "
                "or index.htm found"
            )

            missing.append(
                game_dir
            )

            continue

        # ---------------------------------------------
        # Process game
        # ---------------------------------------------

        status = integrate_file(
            html_file,
            args.apply,
        )

        relative_file = str(
            html_file.relative_to(
                ROOT
            )
        )

        # ---------------------------------------------
        # Changed
        # ---------------------------------------------

        if status == "changed":

            changed.append(
                relative_file
            )

            if args.apply:
                print(
                    f"   ✅ Navbar integrated "
                    f"into {html_file.name}"
                )
            else:
                print(
                    f"   🟡 Would integrate "
                    f"navbar into "
                    f"{html_file.name}"
                )

        # ---------------------------------------------
        # Already done
        # ---------------------------------------------

        elif status == "already":

            already.append(
                relative_file
            )

            print(
                "   ✅ Already integrated"
            )

        # ---------------------------------------------
        # Needs manual review
        # ---------------------------------------------

        else:

            warnings.append(
                relative_file
            )

            print(
                "   ⚠️ Unusual HTML structure "
                "- skipped"
            )

    # =====================================================
    # SUMMARY
    # =====================================================

    print()

    print(
        "======================================"
    )

    print(
        "SUMMARY"
    )

    print(
        "======================================"
    )

    if args.apply:
        print(
            f"Updated: "
            f"{len(changed)}"
        )
    else:
        print(
            f"Would update: "
            f"{len(changed)}"
        )

    print(
        f"Already integrated: "
        f"{len(already)}"
    )

    print(
        f"Missing files/folders: "
        f"{len(missing)}"
    )

    print(
        f"Needs manual review: "
        f"{len(warnings)}"
    )

    print(
        "BP26: skipped intentionally"
    )

    # =====================================================
    # MISSING
    # =====================================================

    if missing:
        print()
        print(
            "Missing:"
        )

        for item in missing:
            print(
                f"  - {item}"
            )

    # =====================================================
    # MANUAL REVIEW
    # =====================================================

    if warnings:
        print()
        print(
            "Manual review:"
        )

        for item in warnings:
            print(
                f"  - {item}"
            )

    # =====================================================
    # UPDATED FILES
    # =====================================================

    if changed:
        print()

        if args.apply:
            print(
                "Updated files:"
            )
        else:
            print(
                "Files that would be updated:"
            )

        for item in changed:
            print(
                f"  - {item}"
            )

    # =====================================================
    # FINAL MESSAGE
    # =====================================================

    print()

    if not args.apply:
        print(
            "No files were changed."
        )

        print()

        print(
            "If everything above looks "
            "correct, run:"
        )

        print()

        print(
            "python3 "
            "integrate-game-navbar.py "
            "--apply"
        )

    else:
        print(
            "✅ Integration complete."
        )

        print()

        print(
            "Next recommended commands:"
        )

        print()

        print(
            "git status"
        )

        print(
            "git diff --stat"
        )

    print()


# =========================================================
# START
# =========================================================

if __name__ == "__main__":
    main()