#!/usr/bin/env python3
"""
Simple local server for the portfolio website
Run this script to start a local development server
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path


def start_server(port=8000):
    """Start a simple HTTP server"""

    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()

    # Change to the script directory
    os.chdir(script_dir)

    # Check if index.html exists
    if not Path('index.html').exists():
        print("❌ Error: index.html not found in the current directory")
        print("Make sure you're running this script from the portfolio website directory")
        sys.exit(1)

    # Create the server
    Handler = http.server.SimpleHTTPRequestHandler

    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"🚀 Starting local server...")
            print(f"📁 Serving files from: {script_dir}")
            print(f"🌐 Server running at: http://localhost:{port}")
            print(f"📱 Open your browser and go to: http://localhost:{port}")
            print("⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)

            # Try to open the browser automatically
            try:
                webbrowser.open(f'http://localhost:{port}')
                print("✅ Browser opened automatically!")
            except:
                print(
                    "⚠️  Could not open browser automatically. Please open it manually.")

            # Start the server
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use!")
            print(
                f"Try using a different port: python start-local.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    # Get port from command line argument, default to 8000
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

    print("🎨 Wilson Brock Portfolio Website")
    print("=" * 40)
    start_server(port)
