# import os
# import signal
# import subprocess
# from threading import Event

# output_dir = os.path.join(os.path.dirname(__file__), "segments")
# os.makedirs(output_dir, exist_ok=True)
# output_file = os.path.join(output_dir, "recording.mp4")

# shutdown_event = Event()

# def signal_handler(sig, frame):
#     shutdown_event.set()

# def start_xvfb():
#     return subprocess.Popen(
#         ["Xvfb", ":99", "-screen", "0", "1280x720x16", "-ac"],
#         stdout=subprocess.DEVNULL,
#         stderr=subprocess.DEVNULL
#     )

# def start_ffmpeg():
#     return subprocess.Popen([
#         "ffmpeg",
#         "-f", "x11grab",
#         "-video_size", "1280x720",
#         "-framerate", "15",
#         "-i", ":99",
#         "-vf", "format=yuv420p",
#         "-c:v", "libx264",
#         "-preset", "ultrafast",
#         "-crf", "28",
#         "-threads", "2",
#         "-loglevel", "error",
#         output_file
#     ], stderr=subprocess.PIPE)  # Capture errors

# def record():
#     signal.signal(signal.SIGINT, signal_handler)
#     xvfb = start_xvfb()
#     os.environ["DISPLAY"] = ":99"
    
#     try:
#         ffmpeg = start_ffmpeg()
#         while not shutdown_event.is_set():
#             if ffmpeg.poll() is not None:  # FFmpeg crashed
#                 print("FFmpeg failed:", ffmpeg.stderr.read().decode())
#                 break
#     finally:
#         ffmpeg.terminate()
#         xvfb.terminate()

# if __name__ == "__main__":
#     record()
import os
import signal
import subprocess
import time
from threading import Event

# Configuration
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segments")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "recording.mp4")

shutdown_event = Event()

def signal_handler(sig, frame):
    print("\nStopping recording...")
    shutdown_event.set()

def start_xvfb():
    """Start Xvfb with proper framebuffer"""
    return subprocess.Popen(
        ["Xvfb", ":99", "-screen", "0", "1280x720x24", "-ac", "-nolisten", "tcp"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def start_ffmpeg():
    """Optimized FFmpeg command for AWS"""
    return subprocess.Popen([
        "ffmpeg",
        "-y",  # Overwrite without asking
        "-f", "x11grab",
        "-video_size", "1280x720",
        "-framerate", "15",
        "-i", ":99.0+0,0",  # Explicit display+offset
        "-draw_mouse", "1",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-pix_fmt", "yuv420p",
        "-crf", "25",
        "-threads", "2",
        "-loglevel", "error",
        output_file
    ])

def verify_xvfb():
    """Check if Xvfb is working"""
    try:
        subprocess.check_call(["xdpyinfo", "-display", ":99"], 
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

def record():
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start Xvfb
    xvfb = start_xvfb()
    os.environ["DISPLAY"] = ":99"
    
    # Verify Xvfb
    time.sleep(1)
    if not verify_xvfb():
        print("ERROR: Xvfb failed to start!")
        xvfb.terminate()
        return

    # Start FFmpeg
    ffmpeg = start_ffmpeg()
    print(f"Recording to {output_file}... (Ctrl+C to stop)")
    
    try:
        while not shutdown_event.is_set():
            time.sleep(0.5)
    finally:
        ffmpeg.terminate()
        xvfb.terminate()
        print("Recording stopped")

if __name__ == "__main__":
    record()
