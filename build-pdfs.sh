#!/bin/sh
# Rebuilds the CV PDFs by printing each page with headless Chrome, so a PDF always matches its page.
# Edit the page, never the PDF, then run this on the Mac before committing and commit the PDFs with the page.
# Usage: ./build-pdfs.sh [page ...], e.g. ./build-pdfs.sh mathieu. With no page named, every PDF is rebuilt.
set -e
cd "$(dirname "$0")"

chrome=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
[ -x "$chrome" ] || { echo "Chrome not found at $chrome (set CHROME to its path)" >&2; exit 1; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# The language addresses are what gets printed, so they have to be current first.
./build-langs.sh > /dev/null

# render <html file> <pdf file>: writes to a temporary file so a failed print leaves the old PDF alone.
render() {
    "$chrome" --headless --disable-gpu --no-pdf-header-footer --user-data-dir="$tmp/profile" \
        --virtual-time-budget=5000 --print-to-pdf="$tmp/out.pdf" "file://$PWD/$1" 2> /dev/null
    [ "$(head -c 4 "$tmp/out.pdf" 2> /dev/null)" = "%PDF" ] || { echo "$1: printing failed" >&2; exit 1; }
    mv "$tmp/out.pdf" "$2"
    echo "$2"
}

[ $# -gt 0 ] || set -- mathieu stephan yasmine

for page in "$@"; do
    case $page in
        mathieu)
            render mathieu/index.html mathieu/mathieu_padlewski_cv.pdf
            ;;
        stephan)
            render stephan/index.html stephan/stephan_padlewski_cv.pdf
            ;;
        yasmine)
            render yasmine/fr/index.html yasmine/yasmine_traboulsi_padlewski_cv.pdf
            render yasmine/en/index.html yasmine/yasmine_traboulsi_padlewski_cv_en.pdf
            render yasmine/ar/index.html yasmine/yasmine_traboulsi_padlewski_cv_ar.pdf
            ;;
        *)
            echo "$page: no PDF to build" >&2
            exit 1
            ;;
    esac
done
