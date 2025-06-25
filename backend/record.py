import os
import signal
import sys
import subprocess
import time
from threading import Event
import dbus

# Configuration
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segments")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "recording.mp4")

# Event for clean shutdown
shutdown_event = Event()

def signal_handler(sig, frame):
    print("Received stop signal")
    shutdown_event.set()

def start_recording(output_path):
    """Start recording using DBus interface"""
    bus = dbus.SessionBus()
    screencast = bus.get_object(
        'org.gnome.Shell.Screencast',
        '/org/gnome/Shell/Screencast'
    )
    
    # Correct parameter format for DBus
    params = {
        'framerate': dbus.UInt32(30),
        'draw-cursor': dbus.Boolean(True)
    }
    
    return screencast.Screencast(
        output_path,
        params,
        dbus_interface='org.gnome.Shell.Screencast'
    )

def stop_recording(recording):
    """Stop active recording"""
    recording.Stop()

def record_video():
    """Main recording function"""
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        print("Starting recording...")
        recording = start_recording(output_file)
        
        # Wait until stop signal
        while not shutdown_event.is_set():
            time.sleep(0.5)
            
        print("Stopping recording...")
        stop_recording(recording)
        print(f"Recording saved to {output_file}")
        
    except dbus.exceptions.DBusException as e:
        print(f"DBus error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    record_video()
