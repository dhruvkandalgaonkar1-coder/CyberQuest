from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import webbrowser


ROOT = Path(__file__).resolve().parent
FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
    "/app.js": ("app.js", "text/javascript; charset=utf-8"),
}


class CyberQuestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        entry = FILES.get(self.path.split("?", 1)[0])
        if entry is None:
            self.send_error(404, "File not found")
            return

        filename, content_type = entry
        content = (ROOT / filename).read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format_string, *args):
        print("%s - %s" % (self.address_string(), format_string % args))


if __name__ == "__main__":
    address = ("127.0.0.1", 8000)
    server = HTTPServer(address, CyberQuestHandler)
    url = "http://127.0.0.1:8000"
    print("CyberQuest is running at " + url)
    print("Press Ctrl+C to stop the server.")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nCyberQuest server stopped.")
    finally:
        server.server_close()
