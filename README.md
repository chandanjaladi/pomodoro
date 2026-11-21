# Pomodoro

A focus timer built around a realistic 3D tomato kitchen timer.

- Pick any time from 0 to 55 minutes on an Apple-style scroll wheel. The tomato's band turns live as you scroll.
- Press **Start** and the top of the tomato slowly turns back to 0, just like the real mechanical timer.
- **Pause**, or **hold to reset** (a 2-second hold, so you can't reset by accident).
- A soft chime when time's up, and a dot for every session you finish today.

Built as a single HTML file with [Three.js](https://threejs.org/) (r128, loaded from cdnjs) and Web Audio. No build step and no dependencies to install.

**Live:** https://chandanjaladi.github.io/pomodoro/

## Install it as an app (PWA)

- **iPhone / iPad (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** menu ⋮ → **Install app** (or **Add to Home screen**). Long-press the icon for quick-start shortcuts: 25, 45 or 55 minutes.
- **Laptop (Chrome / Edge):** click the install icon in the address bar.

Once installed it opens full screen without browser bars, and it works offline after the first visit.

## Designed per device

- **iPhone / iPad:** Apple's Human Interface Guidelines. SF Pro, a large title, filled and gray buttons, and the Clock app's thin digits. The minute wheel ticks with a haptic on each minute (iOS 17.4 or later).
- **Android:** Material 3. Roboto, a top app bar title, filled and tonal pill buttons, and vibration feedback on the wheel.
- **Laptops and landscape tablets:** two columns, with the tomato on the left and the controls on the right.

## Limits of a web app

The timer keeps exact time even if you switch apps or lock the phone, and it shows the right result when you come back. Phones pause web apps in the background, so the end-of-session chime only plays while the app is open on screen.

## Run it locally

Any static file server works. With Python:

```sh
python -m http.server 8731
```

Then open http://localhost:8731.

## Keyboard

| Key | Action |
| --- | --- |
| Space | Start or pause |
| ↑ / ↓ | Move the wheel one minute (when focused) |
| Page Up / Page Down | Move the wheel five minutes |
| Enter | Start (when the wheel is focused) |
