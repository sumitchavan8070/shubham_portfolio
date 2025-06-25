import os
import signal
import subprocess
from threading import Event

output_dir = os.path.join(os.path.dirname(__file__), "segments")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "recording.mp4")

shutdown_event = Event()

def signal_handler(sig, frame):
    shutdown_event.set()

def start_xvfb():
    return subprocess.Popen(
        ["Xvfb", ":99", "-screen", "0", "1280x720x16", "-ac"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def start_ffmpeg():
    return subprocess.Popen([
        "ffmpeg",
        "-f", "x11grab",
        "-video_size", "1280x720",
        "-framerate", "15",
        "-i", ":99",
        "-vf", "format=yuv420p",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        "-threads", "2",
        "-loglevel", "error",
        output_file
    ], stderr=subprocess.PIPE)  # Capture errors

def record():
    signal.signal(signal.SIGINT, signal_handler)
    xvfb = start_xvfb()
    os.environ["DISPLAY"] = ":99"
    
    try:
        ffmpeg = start_ffmpeg()
        while not shutdown_event.is_set():
            if ffmpeg.poll() is not None:  # FFmpeg crashed
                print("FFmpeg failed:", ffmpeg.stderr.read().decode())
                break
    finally:
        ffmpeg.terminate()
        xvfb.terminate()

if __name__ == "__main__":
    record()
