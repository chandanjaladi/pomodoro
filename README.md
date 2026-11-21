# Pomodoro

A focus timer built around a realistic 3D tomato kitchen timer.

- Pick any time from 0 to 55 minutes on an Apple-style scroll wheel. The tomato's band turns live as you scroll.
- Press **Start** and the top of the tomato slowly turns back to 0, just like the real mechanical timer.
- **Pause**, or **hold to reset** (a 2-second hold, so you can't reset by accident).
- A soft chime when time's up, and a dot for every session you finish today.

Built as a single HTML file with [Three.js](https://threejs.org/) (r128, loaded from cdnjs) and Web Audio. No build step and no dependencies to install.

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
