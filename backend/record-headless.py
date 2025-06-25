# import os
# import signal
# import sys
# import subprocess
# import time
# from threading import Event
# import psutil

# # Configuration
# output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segments")
# os.makedirs(output_dir, exist_ok=True)
# output_file = os.path.join(output_dir, "recording.mp4")

# # Event for clean shutdown
# shutdown_event = Event()
# ffmpeg_process = None
# xvfb_process = None

# def signal_handler(sig, frame):
#     print("Received stop signal")
#     shutdown_event.set()

# def start_virtual_display():
#     """Start virtual display for headless environment"""
#     global xvfb_process
#     try:
#         # Start Xvfb (X Virtual Framebuffer)
#         xvfb_process = subprocess.Popen([
#             'Xvfb', ':99', 
#             '-screen', '0', '1920x1080x24',
#             '-ac', '+extension', 'GLX'
#         ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
#         # Set DISPLAY environment variable
#         os.environ['DISPLAY'] = ':99'
#         time.sleep(2)  # Wait for Xvfb to start
#         print("Virtual display started on :99")
#         return True
#     except Exception as e:
#         print(f"Failed to start virtual display: {e}")
#         return False

# def stop_virtual_display():
#     """Stop virtual display"""
#     global xvfb_process
#     if xvfb_process:
#         xvfb_process.terminate()
#         xvfb_process.wait()
#         print("Virtual display stopped")

# def start_recording_headless():
#     """Start screen recording using FFmpeg with virtual display"""
#     global ffmpeg_process
    
#     try:
#         # FFmpeg command to record virtual display
#         ffmpeg_cmd = [
#             'ffmpeg',
#             '-f', 'x11grab',           # Input format
#             '-video_size', '1920x1080', # Screen resolution
#             '-framerate', '30',         # Frame rate
#             '-i', ':99.0',             # Display to capture
#             '-c:v', 'libx264',         # Video codec
#             '-preset', 'ultrafast',     # Encoding speed
#             '-crf', '23',              # Quality (lower = better)
#             '-y',                      # Overwrite output file
#             output_file
#         ]
        
#         ffmpeg_process = subprocess.Popen(
#             ffmpeg_cmd,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE
#         )
        
#         print(f"Started FFmpeg recording to {output_file}")
#         return True
        
#     except Exception as e:
#         print(f"Failed to start FFmpeg recording: {e}")
#         return False

# def stop_recording_headless():
#     """Stop FFmpeg recording"""
#     global ffmpeg_process
    
#     if ffmpeg_process:
#         # Send SIGTERM to FFmpeg for clean shutdown
#         ffmpeg_process.terminate()
        
#         # Wait for process to finish
#         try:
#             ffmpeg_process.wait(timeout=10)
#             print("FFmpeg recording stopped cleanly")
#         except subprocess.TimeoutExpired:
#             # Force kill if it doesn't stop
#             ffmpeg_process.kill()
#             print("FFmpeg recording force stopped")
        
#         ffmpeg_process = None

# def record_video_headless():
#     """Main recording function for headless environment"""
#     signal.signal(signal.SIGINT, signal_handler)
#     signal.signal(signal.SIGTERM, signal_handler)
    
#     try:
#         # Start virtual display
#         if not start_virtual_display():
#             print("Failed to start virtual display")
#             sys.exit(1)
        
#         # Start recording
#         if not start_recording_headless():
#             print("Failed to start recording")
#             stop_virtual_display()
#             sys.exit(1)
        
#         print("Recording started successfully")
        
#         # Wait until stop signal
#         while not shutdown_event.is_set():
#             time.sleep(0.5)
            
#             # Check if FFmpeg is still running
#             if ffmpeg_process and ffmpeg_process.poll() is not None:
#                 print("FFmpeg process ended unexpectedly")
#                 break
        
#         print("Stopping recording...")
#         stop_recording_headless()
#         stop_virtual_display()
        
#         print(f"Recording saved to {output_file}")
        
#     except Exception as e:
#         print(f"Error during recording: {e}")
#         stop_recording_headless()
#         stop_virtual_display()
#         sys.exit(1)

# if __name__ == "__main__":
#     record_video_headless()
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
output_file = os.path.join(output_dir, "recording_%Y-%m-%d_%H-%M-%S.mp4")  # Timestamp in filename

# Event for clean shutdown
shutdown_event = Event()
ffmpeg_process = None
xvfb_process = None

def signal_handler(sig, frame):
    print("Received stop signal")
    shutdown_event.set()

def start_virtual_display():
    """Start optimized virtual display for EC2"""
    global xvfb_process
    try:
        # Start Xvfb with minimal configuration for EC2
        xvfb_process = subprocess.Popen([
            'Xvfb', ':99', 
            '-screen', '0', '1280x720x16',  # Reduced resolution and color depth
            '-nolisten', 'tcp',             # Disable network listening
            '-noreset',                     # Prevent display reset
            '+extension', 'RANDR'           # Only essential extension
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        os.environ['DISPLAY'] = ':99'
        time.sleep(1)  # Reduced wait time
        print("Virtual display started on :99")
        return True
    except Exception as e:
        print(f"Failed to start virtual display: {e}")
        return False

def stop_virtual_display():
    """Stop virtual display"""
    global xvfb_process
    if xvfb_process:
        try:
            xvfb_process.terminate()
            xvfb_process.wait(timeout=5)
        except:
            xvfb_process.kill()
        print("Virtual display stopped")

def start_recording_headless():
    """Start optimized screen recording for EC2"""
    global ffmpeg_process
    
    try:
        # Generate filename with current timestamp
        output = time.strftime(output_file)
        
        # Optimized FFmpeg command for EC2
        ffmpeg_cmd = [
            'ffmpeg',
            '-loglevel', 'error',          # Reduce logging overhead
            '-f', 'x11grab',
            '-video_size', '1280x720',     # Match Xvfb resolution
            '-framerate', '15',            # Reduced frame rate
            '-i', ':99.0',
            '-c:v', 'libx264',
            '-preset', 'superfast',        # Better balance than ultrafast
            '-tune', 'fastdecode',        # Optimize for playback
            '-crf', '28',                  # Slightly higher CRF for smaller files
            '-g', '30',                    # Keyframe interval
            '-pix_fmt', 'yuv420p',        # Standard pixel format
            '-threads', '2',               # Limit CPU usage
            '-y',
            output
        ]
        
        ffmpeg_process = subprocess.Popen(
            ffmpeg_cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            start_new_session=True         # Run in new process group
        )
        
        print(f"Started optimized FFmpeg recording to {output}")
        return True
        
    except Exception as e:
        print(f"Failed to start FFmpeg recording: {e}")
        return False

def stop_recording_headless():
    """Stop FFmpeg recording gracefully"""
    global ffmpeg_process
    
    if ffmpeg_process:
        try:
            # Send 'q' to FFmpeg stdin for graceful exit
            ffmpeg_process.stdin.write(b'q')
            ffmpeg_process.stdin.flush()
            ffmpeg_process.wait(timeout=5)
            print("FFmpeg recording stopped cleanly")
        except:
            try:
                ffmpeg_process.terminate()
                ffmpeg_process.wait(timeout=2)
            except:
                ffmpeg_process.kill()
                print("FFmpeg recording force stopped")
        
        ffmpeg_process = None

def monitor_system():
    """Monitor system resources and adjust if needed"""
    while not shutdown_event.is_set():
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            if cpu_percent > 90:  # If CPU usage is too high
                print(f"High CPU usage detected: {cpu_percent}%")
                # Could implement dynamic adjustment here
        except:
            pass
        time.sleep(5)

def record_video_headless():
    """Main recording function optimized for EC2"""
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        if not start_virtual_display():
            sys.exit(1)
        
        if not start_recording_headless():
            stop_virtual_display()
            sys.exit(1)
        
        print("Recording started successfully")
        
        # Start system monitoring in background
        import threading
        monitor_thread = threading.Thread(target=monitor_system, daemon=True)
        monitor_thread.start()
        
        # Main wait loop
        while not shutdown_event.is_set():
            time.sleep(0.2)  # Reduced sleep interval
            
            if ffmpeg_process and ffmpeg_process.poll() is not None:
                print("FFmpeg process ended unexpectedly")
                break
        
        print("Stopping recording...")
        stop_recording_headless()
        stop_virtual_display()
        
    except Exception as e:
        print(f"Error during recording: {e}")
        stop_recording_headless()
        stop_virtual_display()
        sys.exit(1)

if __name__ == "__main__":
    record_video_headless()