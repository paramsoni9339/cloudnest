"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TodoList = () => {
  const [todos, setTodos] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="glass-card rounded-[20px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="h4 text-white">My Tasks</h3>
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/checklist.svg"
            alt="checklist"
            width={24}
            height={24}
            className=""
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button
            onClick={addTodo}
            className="glass-card rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            <p className="body-2 text-white">Add</p>
          </button>
        </div>

        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card group flex items-center justify-between rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`h-5 w-5 rounded-full border-2 transition-colors ${
                    todo.completed
                      ? "border-brand bg-brand"
                      : "border-white/30 hover:border-white/50"
                  }`}
                >
                  {todo.completed && (
                    <Image
                      src="/assets/icons/remove.svg"
                      alt="check"
                      width={12}
                      height={12}
                      className="m-auto"
                    />
                  )}
                </button>
                <p
                  className={`body-2 ${
                    todo.completed ? "text-white/50 line-through" : "text-white"
                  }`}
                >
                  {todo.text}
                </p>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Image
                  src="/assets/icons/delete.svg"
                  alt="delete"
                  width={20}
                  height={20}
                  className="invert opacity-90 hover:opacity-100 transition-opacity"
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="flex h-[100px] items-center justify-center">
            <p className="body-2 text-white/60">No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList; 