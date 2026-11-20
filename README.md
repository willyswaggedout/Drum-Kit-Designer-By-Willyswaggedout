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

## Build the Windows app and release an update

1. Raise `"version"` in `package.json` (for example `1.1.0` → `1.2.0`).
2. Push to `main`, then push a matching tag:
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```
3. The workflow in `.github/workflows/build.yml` builds `Drum-Kit-Designer-Setup-<version>.exe` and `Delete Drum Kit Designer.exe` and attaches them to a release, along with `latest.yml`.

Every installed copy checks the newest release when it opens. If it's newer, the app asks **"A new version of Drum Kit Designer is available"** with **Update** / **Not Now**; Update downloads it, then restarts into the new version. The repository has to be public for the app to see its releases.

The app isn't code-signed, so Windows may show "Windows protected your PC" on the first install (**More info → Run anyway**).

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
