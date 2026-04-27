import React, { useState, useEffect } from 'react';

function App() {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        } else {
            return [];
        }
    });
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoText, setEditTodoText] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (newTodo.trim() !== '') {
            setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
            setNewTodo('');
        }
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const completeTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const startEdit = (todo) => {
        setEditTodoId(todo.id);
        setEditTodoText(todo.text);
    };

    const cancelEdit = () => {
        setEditTodoId(null);
    };

    const updateTodo = () => {
        if (editTodoText.trim() !== '') {
            setTodos(todos.map(todo => todo.id === editTodoId ? { ...todo, text: editTodoText } : todo));
            setEditTodoId(null);
        }
    };

    const filteredTodos = () => {
        switch (filter) {
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'incomplete':
                return todos.filter(todo => !todo.completed);
            default:
                return todos;
        }
    };

    return (
        <div className="container">
            <h1>Todo App</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? addTodo() : null}
                    placeholder="Add new todo"
                />
                <button onClick={addTodo}>Add</button>
            </div>

            <div className="filter-group">
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
                <button onClick={() => setFilter('incomplete')}>Incomplete</button>
            </div>

            <ul className="todo-list">
                {filteredTodos().map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        {editTodoId === todo.id ? (
                            <div className="edit-group">
                                <input
                                    type="text"
                                    value={editTodoText}
                                    onChange={(e) => setEditTodoText(e.target.value)}
                                />
                                <button onClick={updateTodo}>Update</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <span className="todo-text">{todo.text}</span>
                                <div className="button-group">
                                    <button onClick={() => completeTodo(todo.id)}>{todo.completed ? 'Undo' : 'Complete'}</button>
                                    <button onClick={() => startEdit(todo)}>Edit</button>
                                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;