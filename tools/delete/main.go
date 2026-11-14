// Delete Drum Kit Designer: removes everything Drum Kit Designer has put on this computer.
//
//   - closes the program if it is running
//   - runs the installed version's own uninstaller silently (program files, Start menu and
//     desktop shortcuts, and its entry in Apps & features)
//   - deletes the program's saved data: kits in progress, templates, custom fonts, settings,
//     including the data of the older stand-alone Drum Kit Designer.exe
//
// It never touches the kits you exported, your samples, or exe files you saved yourself.
// Nothing is deleted until you click Yes.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"syscall"
	"time"
	"unsafe"
)

const appName = "Drum Kit Designer"

var (
	user32      = syscall.NewLazyDLL("user32.dll")
	messageBoxW = user32.NewProc("MessageBoxW")
)

const (
	mbYesNo       = 0x4
	mbOK          = 0x0
	mbIconWarning = 0x30
	mbIconInfo    = 0x40
	mbDefButton2  = 0x100
	idYes         = 6
)

func box(text, title string, flags uintptr) int {
	t, _ := syscall.UTF16PtrFromString(text)
	c, _ := syscall.UTF16PtrFromString(title)
	r, _, _ := messageBoxW.Call(0, uintptr(unsafe.Pointer(t)), uintptr(unsafe.Pointer(c)), flags)
	return int(r)
}

// run a console command without flashing a window
func quiet(name string, args ...string) *exec.Cmd {
	cmd := exec.Command(name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true, CreationFlags: 0x08000000}
	return cmd
}

type install struct{ key, uninstall, location string }

var valueLine = regexp.MustCompile(`^\s+(\S+)\s+REG_\w+\s+(.*)$`)

// finds every installed copy registered under Apps & features
func findInstalls() []install {
	roots := []string{
		`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall`,
		`HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall`,
		`HKLM\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall`,
	}
	var out []install
	seen := map[string]bool{}
	for _, root := range roots {
		b, err := quiet("reg", "query", root, "/s", "/f", appName, "/d").Output()
		if err != nil {
			continue
		}
		for _, line := range strings.Split(string(b), "\n") {
			line = strings.TrimRight(line, "\r")
			if !strings.HasPrefix(line, "HKEY_") || seen[line] {
				continue
			}
			seen[line] = true
			kb, err := quiet("reg", "query", line).Output()
			if err != nil {
				continue
			}
			in := install{key: line}
			name := ""
			for _, l := range strings.Split(string(kb), "\n") {
				m := valueLine.FindStringSubmatch(strings.TrimRight(l, "\r"))
				if m == nil {
					continue
				}
				switch m[1] {
				case "DisplayName":
					name = m[2]
				case "UninstallString":
					in.uninstall = m[2]
				case "InstallLocation":
					in.location = strings.Trim(m[2], `"`)
				}
			}
			if strings.HasPrefix(name, appName) && in.uninstall != "" {
				out = append(out, in)
			}
		}
	}
	return out
}

// splits `"C:\path\Uninstall X.exe" /currentuser` into the exe and its arguments
func splitCmd(s string) (string, []string) {
	s = strings.TrimSpace(s)
	if strings.HasPrefix(s, `"`) {
		if i := strings.Index(s[1:], `"`); i >= 0 {
			return s[1 : i+1], strings.Fields(s[i+2:])
		}
	}
	f := strings.Fields(s)
	if len(f) == 0 {
		return "", nil
	}
	return f[0], f[1:]
}

func exists(p string) bool { _, err := os.Stat(p); return err == nil }

// deletes a folder or file, retrying while Windows still holds it open
func remove(p string) bool {
	if !exists(p) {
		return true
	}
	for i := 0; i < 8; i++ {
		if os.RemoveAll(p) == nil && !exists(p) {
			return true
		}
		time.Sleep(500 * time.Millisecond)
	}
	return !exists(p)
}

func main() {
	appData, local, profile := os.Getenv("APPDATA"), os.Getenv("LOCALAPPDATA"), os.Getenv("USERPROFILE")
	public := os.Getenv("PUBLIC")

	ok := box("This removes "+appName+" from this computer:\n\n"+
		"  •  the installed program and its shortcuts\n"+
		"  •  all of its saved data: kits in progress, templates, custom fonts and settings\n\n"+
		"Kits you exported, your samples, and exe files you saved yourself are not touched.\n\n"+
		"Delete "+appName+"? This can't be undone.",
		"Delete "+appName, mbYesNo|mbIconWarning|mbDefButton2)
	if ok != idYes {
		return
	}

	// 1. close it if it's open (installed, portable and stand-alone copies)
	quiet("taskkill", "/F", "/T", "/FI", "IMAGENAME eq "+appName+"*").Run()
	time.Sleep(800 * time.Millisecond)

	var done, failed []string

	// 2. the installed copies: their own uninstaller, silently
	for _, in := range findInstalls() {
		exe, args := splitCmd(in.uninstall)
		if exe == "" {
			continue
		}
		if exists(exe) {
			quiet(exe, append(args, "/S")...).Run()
			// the uninstaller may hand off to a copy of itself; wait for it to finish
			for i := 0; i < 60 && exists(exe); i++ {
				time.Sleep(500 * time.Millisecond)
			}
		}
		// only ever delete the program's own folder, never a shared one it was installed into
		if in.location != "" && strings.Contains(strings.ToLower(filepath.Base(in.location)), "drum kit designer") && !remove(in.location) {
			failed = append(failed, in.location)
		}
		quiet("reg", "delete", in.key, "/f").Run() // only if the uninstaller left it behind
		done = append(done, "the installed program")
	}

	// 3. saved data and anything left over
	targets := []string{
		filepath.Join(appData, appName),                   // installed / portable app: kits, templates, fonts, settings
		filepath.Join(appData, "drum-kit-designer"),       // same, older name
		filepath.Join(local, "drum-kit-designer-updater"), // installer leftovers
		filepath.Join(local, "Programs", appName),         // default install folder
		filepath.Join(local, "DrumKitDesigner"),           // the stand-alone Drum Kit Designer.exe's window and data
		filepath.Join(profile, "Desktop", appName+".lnk"),
		filepath.Join(public, "Desktop", appName+".lnk"),
		filepath.Join(appData, `Microsoft\Windows\Start Menu\Programs`, appName+".lnk"),
		filepath.Join(os.Getenv("ProgramData"), `Microsoft\Windows\Start Menu\Programs`, appName+".lnk"),
	}
	data := false
	for _, t := range targets {
		if !exists(t) {
			continue
		}
		if remove(t) {
			if strings.HasSuffix(t, ".lnk") {
				done = append(done, "a shortcut")
			} else {
				data = true
			}
		} else {
			failed = append(failed, t)
		}
	}
	if data {
		done = append(done, "its saved data")
	}

	switch {
	case len(failed) > 0:
		box("Most of "+appName+" was removed, but these couldn't be deleted (they may still be open):\n\n  "+
			strings.Join(failed, "\n  ")+
			"\n\nRestart the computer, then run this again or delete them by hand.",
			"Delete "+appName, mbOK|mbIconWarning)
	case len(done) == 0:
		box(appName+" wasn't found on this computer. There was nothing to delete.", "Delete "+appName, mbOK|mbIconInfo)
	default:
		box(fmt.Sprintf("%s has been removed from this computer.", appName), "Delete "+appName, mbOK|mbIconInfo)
	}
}
