import os
import signal
import sys
import subprocess
import time
from threading import Event
import psutil

# Configuration
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segments")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "recording.mp4")

# Event for clean shutdown
shutdown_event = Event()
ffmpeg_process = None
xvfb_process = None

def signal_handler(sig, frame):
    print("Received stop signal")
    shutdown_event.set()

def start_virtual_display():
    """Start virtual display for headless environment"""
    global xvfb_process
    try:
        # Start Xvfb (X Virtual Framebuffer)
        xvfb_process = subprocess.Popen([
            'Xvfb', ':99', 
            '-screen', '0', '1920x1080x24',
            '-ac', '+extension', 'GLX'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Set DISPLAY environment variable
        os.environ['DISPLAY'] = ':99'
        time.sleep(2)  # Wait for Xvfb to start
        print("Virtual display started on :99")
        return True
    except Exception as e:
        print(f"Failed to start virtual display: {e}")
        return False

def stop_virtual_display():
    """Stop virtual display"""
    global xvfb_process
    if xvfb_process:
        xvfb_process.terminate()
        xvfb_process.wait()
        print("Virtual display stopped")

def start_recording_headless():
    """Start screen recording using FFmpeg with virtual display"""
    global ffmpeg_process
    
    try:
        # FFmpeg command to record virtual display
        ffmpeg_cmd = [
            'ffmpeg',
            '-f', 'x11grab',           # Input format
            '-video_size', '1920x1080', # Screen resolution
            '-framerate', '30',         # Frame rate
            '-i', ':99.0',             # Display to capture
            '-c:v', 'libx264',         # Video codec
            '-preset', 'ultrafast',     # Encoding speed
            '-crf', '23',              # Quality (lower = better)
            '-y',                      # Overwrite output file
            output_file
        ]
        
        ffmpeg_process = subprocess.Popen(
            ffmpeg_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print(f"Started FFmpeg recording to {output_file}")
        return True
        
    except Exception as e:
        print(f"Failed to start FFmpeg recording: {e}")
        return False

def stop_recording_headless():
    """Stop FFmpeg recording"""
    global ffmpeg_process
    
    if ffmpeg_process:
        # Send SIGTERM to FFmpeg for clean shutdown
        ffmpeg_process.terminate()
        
        # Wait for process to finish
        try:
            ffmpeg_process.wait(timeout=10)
            print("FFmpeg recording stopped cleanly")
        except subprocess.TimeoutExpired:
            # Force kill if it doesn't stop
            ffmpeg_process.kill()
            print("FFmpeg recording force stopped")
        
        ffmpeg_process = None

def record_video_headless():
    """Main recording function for headless environment"""
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Start virtual display
        if not start_virtual_display():
            print("Failed to start virtual display")
            sys.exit(1)
        
        # Start recording
        if not start_recording_headless():
            print("Failed to start recording")
            stop_virtual_display()
            sys.exit(1)
        
        print("Recording started successfully")
        
        # Wait until stop signal
        while not shutdown_event.is_set():
            time.sleep(0.5)
            
            # Check if FFmpeg is still running
            if ffmpeg_process and ffmpeg_process.poll() is not None:
                print("FFmpeg process ended unexpectedly")
                break
        
        print("Stopping recording...")
        stop_recording_headless()
        stop_virtual_display()
        
        print(f"Recording saved to {output_file}")
        
    except Exception as e:
        print(f"Error during recording: {e}")
        stop_recording_headless()
        stop_virtual_display()
        sys.exit(1)

if __name__ == "__main__":
    record_video_headless()
