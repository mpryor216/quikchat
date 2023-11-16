 # app.py
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from datetime import datetime
from bleach import linkify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db' # 'mysql+mysqlconnector://mpryor:mysqlpass@localhost:3306/mpryor216$quickchat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable tracking modifications for SQLAlchemy
app.config['SECRET_KEY'] = 'secret_key'
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Define the Message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now, nullable=False)

def create_tables():
    # Create the database tables
    db.create_all()

with app.app_context():
    create_tables()

@app.route('/') 
def index():
    # Retrieve messages from the database
    messages = Message.query.all()
    return render_template('index.html', messages=messages)

@app.route('/send', methods=['POST'])
def send():
    username = request.form.get('username')
    message = request.form.get('message')

    if username and message:
        # Convert URLs in the message to clickable links
        message = linkify(message, parse_email=True)
        # Insert the new message into the database with the current timestamp
        new_message = Message(username=username, message=message, timestamp=datetime.now())
        db.session.add(new_message)
        db.session.commit()

        # Notify clients about the new message
        socketio.emit('new_message', {'username': username, 'message': message, 'timestamp': new_message.timestamp.strftime('%Y-%m-%d %I:%M %p')})

    return jsonify({'status': 'OK'})

@app.route('/clear_chat', methods=['GET'])
def clear_chat():
    # Retrieve the username from the request (you may need to adjust this based on your form structure)
    username = request.args.get('username', 'Unknown User')

    # Clear all messages from the database
    Message.query.delete()
    db.session.commit()

    # Notify clients about the chat being cleared
    timestamp = datetime.now().strftime('%Y-%m-%d %I:%M %p').strip()
    socketio.emit('clear_chat', {'username': username, 'timestamp': timestamp})

    # Return a JSON response to indicate the chat has been cleared
    return jsonify({'status': 'Chat cleared', 'username': username, 'timestamp': timestamp})