"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type TodoType = "grocery" | "work" | "personal" | "health" | "other";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  type: TodoType;
};

const dummyTodos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false, type: "grocery" },
  { id: 2, title: "Do homework", completed: true, type: "work" },
  { id: 3, title: "Go for a walk", completed: false, type: "health" },
  { id: 4, title: "Clean room", completed: true, type: "personal" },
];

export default function TodoPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [typeFilter, setTypeFilter] = useState<TodoType | "all">("all");

  const filteredTodos = dummyTodos.filter((todo) => {
    // Filter by completion status
    if (filter === "completed" && !todo.completed) return false;
    if (filter === "active" && todo.completed) return false;

    // Filter by type
    if (typeFilter !== "all" && todo.type !== typeFilter) return false;

    return true;
  });

  const types: Array<TodoType | "all"> = [
    "all",
    "grocery",
    "work",
    "personal",
    "health",
    "other",
  ];

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="flex gap-4 mb-4">
        <a href="/todo" className="text-blue-500 hover:underline">
          All
        </a>
        <a href="/todo?filter=active" className="text-blue-500 hover:underline">
          Active
        </a>
        <a
          href="/todo?filter=completed"
          className="text-blue-500 hover:underline"
        >
          Completed
        </a>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded text-sm ${
                typeFilter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-3 border rounded"
          >
            <input type="checkbox" checked={todo.completed} readOnly />
            <div className="flex flex-col">
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.title}
              </span>
              <span className="text-xs text-gray-500">Type: {todo.type}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
