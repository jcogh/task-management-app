from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models import Base, User, Task
from contextlib import contextmanager
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Replace with a real secret key
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

engine = create_engine('sqlite:///task_management.db')
Session = scoped_session(sessionmaker(bind=engine))


@contextmanager
def session_scope():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        with session_scope() as session:
            tasks = session.query(Task).all()
            task_list = [task.to_dict() for task in tasks]
            print(f"Fetched {len(task_list)} tasks")  # Debug log
            return jsonify(task_list)
    except Exception as e:
        print(f"Error fetching tasks: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        print(f"Received task data: {data}")  # Debug log

        # Handle the due_date field
        due_date = data.get('dueDate')
        if due_date:
            due_date = datetime.strptime(due_date, '%Y-%m-%d').date()
        else:
            due_date = None

        with session_scope() as session:
            new_task = Task(
                title=data['title'],
                description=data.get('description'),
                status=data.get('status', 'New'),
                priority=data.get('priority'),
                due_date=due_date,
                user_id=data.get('user_id')
            )
            session.add(new_task)
            session.flush()  # This will populate the id of the new task
            task_dict = new_task.to_dict()
        print(f"Created task: {task_dict}")  # Debug log
        socketio.emit('task_created', task_dict)
        return jsonify(task_dict), 201
    except KeyError as e:
        error_msg = f"Missing required field: {str(e)}"
        print(error_msg)  # Debug log
        return jsonify({'error': error_msg}), 400
    except Exception as e:
        error_msg = f"Error creating task: {str(e)}"
        print(error_msg)  # Debug log
        import traceback
        traceback.print_exc()  # This will print the full stack trace
        return jsonify({'error': error_msg}), 500


@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        print(f"Updating task {task_id} with data: {data}")  # Debug log
        with session_scope() as session:
            task = session.query(Task).get(task_id)
            if task:
                for key, value in data.items():
                    setattr(task, key, value)
                task_dict = task.to_dict()
                print(f"Emitting task_updated event: {task_dict}")  # Debug log
                socketio.emit('task_updated', task_dict, broadcast=True)
                return jsonify(task_dict)
        print(f"Task {task_id} not found")  # Debug log
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        print(f"Error updating task: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        print(f"Deleting task {task_id}")  # Debug log
        with session_scope() as session:
            task = session.query(Task).get(task_id)
            if task:
                session.delete(task)
                print(f"Emitting task_deleted event: {task_id}")  # Debug log
                socketio.emit('task_deleted', task_id, broadcast=True)
                return '', 204
        print(f"Task {task_id} not found")  # Debug log
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        print(f"Error deleting task: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500


@socketio.on('connect')
def handle_connect():
    print('Client connected')  # Debug log


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')  # Debug log


# Create tables
Base.metadata.create_all(engine)

if __name__ == '__main__':
    print("Starting Flask server...")  # Debug log
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
