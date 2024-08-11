import argparse
import getpass
import asyncio
import socketio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Task

engine = create_engine('sqlite:///task_management.db')
Session = sessionmaker(bind=engine)

sio = socketio.AsyncClient()


@sio.event
async def connect():
    print('Connected to server')


@sio.event
async def disconnect():
    print('Disconnected from server')


@sio.on('task_created')
async def on_task_created(data):
    print(f"New task created: {data['title']}")


@sio.on('task_updated')
async def on_task_updated(data):
    print(f"Task updated: {data['title']}")


@sio.on('task_deleted')
async def on_task_deleted(task_id):
    print(f"Task deleted: {task_id}")


async def create_task(user, title, description=None, status="New", priority=None, due_date=None):
    session = Session()
    new_task = Task(title=title, description=description, status=status,
                    priority=priority, due_date=due_date, user_id=user.id)
    session.add(new_task)
    session.commit()
    task_dict = new_task.to_dict()
    session.close()
    await sio.emit('task_created', task_dict)
    print(f"Task '{title}' created successfully.")


async def main():
    parser = argparse.ArgumentParser(description="Task Management CLI")
    parser.add_argument('action', choices=[
                        'create_task', 'list_tasks', 'update_task', 'delete_task'])
    parser.add_argument('--title', help="Task title")
    parser.add_argument('--description', help="Task description")
    parser.add_argument('--status', help="Task status")
    parser.add_argument('--priority', help="Task priority")
    parser.add_argument('--due_date', help="Task due date")
    parser.add_argument('--task_id', type=int,
                        help="Task ID for update/delete actions")

    args = parser.parse_args()

    await sio.connect('http://localhost:5000')

    # Simplified authentication for demonstration
    user_id = 1  # Assume we have a user with ID 1

    if args.action == 'create_task':
        await create_task(user_id, args.title, args.description, args.status, args.priority, args.due_date)
    elif args.action == 'list_tasks':
        # Implement list_tasks
        pass
    elif args.action == 'update_task':
        # Implement update_task
        pass
    elif args.action == 'delete_task':
        # Implement delete_task
        pass

    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())
