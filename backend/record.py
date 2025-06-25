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
    print("Stopping recording...")
    shutdown_event.set()

def start_xvfb():
    """Start virtual display server"""
    return subprocess.Popen(
        ["Xvfb", ":99", "-screen", "0", "1920x1080x24"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def start_ffmpeg(output_path):
    """Start FFmpeg recording"""
    return subprocess.Popen([
        "ffmpeg",
        "-f", "x11grab",
        "-video_size", "1920x1080",
        "-framerate", "30",
        "-i", ":99",
        "-draw_mouse", "1",
        "-codec:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        output_path
    ])

def record_video():
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start Xvfb (virtual display)
    xvfb = start_xvfb()
    os.environ["DISPLAY"] = ":99"
    
    try:
        print("Starting FFmpeg recording...")
        ffmpeg = start_ffmpeg(output_file)
        
        while not shutdown_event.is_set():
            time.sleep(0.5)
            
        ffmpeg.terminate()
        ffmpeg.wait()
        print(f"Recording saved to {output_file}")
        
    finally:
        xvfb.terminate()
        xvfb.wait()

if __name__ == "__main__":
    record_video()
