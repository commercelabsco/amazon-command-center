import http.server
import json
import os

DATA_FILE = 'app_data.json'
PORT = 8080

class AppHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/load-data':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'{}')
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/save-data':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                f.write(body)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Keep terminal clean

if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), AppHandler) as httpd:
        print('')
        print('  ✓ Account Health Command Center is running')
        print('  ✓ Open Chrome and go to: http://localhost:8080')
        print('  ✓ Your data is saved to: app_data.json (in this folder)')
        print('')
        print('  Leave this window open while using the app.')
        print('  Press Ctrl+C to stop.')
        print('')
        httpd.serve_forever()
