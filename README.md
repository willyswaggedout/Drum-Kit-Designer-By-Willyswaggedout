# Drum Kit Builder

Build custom drum kits for FL Studio's browser: folders with colored names, icons, label images under each folder, and a banner on top. The app writes the `.nfo` files and images for you.

## Use it

- **In a browser:** open `app/index.html` in Chrome or Edge. Nothing to install.
- **As a desktop app (Windows / macOS):**
  ```bash
  npm install
  npm start
  ```

Fill in the kit name and your tag, add folders with **+**, drag samples onto the page (they're sorted by name), then **Download Kit** and unzip it into `FL Studio/Data/Patches`. In Chrome, Edge or the desktop app, **Save into a folder…** writes the kit straight into Patches.

## Build the downloadable apps

- **On GitHub (recommended):** push a version tag and the workflow in `.github/workflows/build.yml` builds the Windows `.exe` and macOS `.dmg` and attaches them to a release.
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  ```
  You can also run **Build apps** from the Actions tab to get the files without a release.
- **On your own machine:** `npm run dist:win` (on Windows) or `npm run dist:mac` (on a Mac). Output goes to `dist/`.

The macOS build isn't code-signed, so the first time people open it they right-click the app and choose **Open**.

## How FL Studio kits work

Each folder gets a `.nfo` file with the same name next to it (`1 808s` + `1 808s.nfo`):

```
Tip=@yourname            hover text
HeightOfs=5              extra row spacing
Color=$FFFFFF            folder name color ($BBGGRR)
IconIndex=7              browser icon number
Bitmap=zimages/1.png     image shown under the folder
```

Output layout:

```
My Drum Kit/
├─ My Drum Kit.nfo        kit folder: star icon + banner
├─ images/banner.png
└─ My Drum Kit/
   ├─ zimages/            200×20 label images
   ├─ 1 808s.nfo
   ├─ 1 808s/
   └─ …
```

## Project layout

```
app/          the whole app: index.html, styles.css, app.js (no build step)
electron/     desktop window wrapper
.github/      automatic Windows + macOS builds
```

## Notes

- Label fonts other than the built-in system ones load from Google Fonts, so they need an internet connection. To work fully offline, download the font files into `app/fonts/` and point `styles.css` at them.
- Known icon numbers: 7 bars, 34 piano keys, 52 star, 55 cloud. Any other number can be entered by hand.
