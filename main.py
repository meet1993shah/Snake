from flask import Flask, render_template
import os
import platform

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    if platform.system() == 'Android':
        from android.permissions import Permission, request_permissions
        request_permissions([Permission.INTERNET, Permission.READ_EXTERNAL_STORAGE, Permission.WRITE_EXTERNAL_STORAGE])
    app.run(debug=False, port=8080)
