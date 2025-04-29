"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react"; // Import useState

// 1. Define TodoType and update Todo interface
type TodoType = "grocery" | "work" | "personal" | "health" | "other";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  type: TodoType; // Add type field
};

// 2. Update dummyTodos data
const dummyTodos: Todo[] = [
  { id: 1, title: "Buy milk and eggs", completed: false, type: "grocery" },
  { id: 2, title: "Finish project report", completed: true, type: "work" },
  { id: 3, title: "Go for a 30-min run", completed: false, type: "health" },
  { id: 4, title: "Clean the bathroom", completed: true, type: "personal" },
  {
    id: 5,
    title: "Schedule dentist appointment",
    completed: false,
    type: "health",
  },
  { id: 6, title: "Pay electricity bill", completed: false, type: "personal" },
];

// Define available types including 'all'
const availableTypes: Array<TodoType | "all"> = [
  "all",
  "grocery",
  "work",
  "personal",
  "health",
  "other",
];

export default function TodoPage() {
  const searchParams = useSearchParams();
  const completionFilter = searchParams.get("filter"); // Renamed for clarity

  // 3. Add state for the type filter
  const [typeFilter, setTypeFilter] = useState<TodoType | "all">("all");

  // 4. Modify filtering logic
  const filteredTodos = dummyTodos.filter((todo) => {
    // Filter by completion status first
    const completionMatch =
      completionFilter === "completed"
        ? todo.completed
        : completionFilter === "active"
        ? !todo.completed
        : true; // 'all' or no filter matches everything

    // Filter by type
    const typeMatch = typeFilter === "all" || todo.type === typeFilter;

    return completionMatch && typeMatch; // Match both filters
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* Completion Status Filters */}
      <div className="flex gap-4 mb-4 border-b pb-4">
        <span className="font-medium">Status:</span>
        <a
          href="/todo"
          className={`hover:underline ${
            !completionFilter ? "text-blue-600 font-semibold" : "text-blue-500"
          }`}
        >
          All
        </a>
        <a
          href={`/todo?filter=active${
            typeFilter !== "all" ? `&type=${typeFilter}` : ""
          }`}
          className={`hover:underline ${
            completionFilter === "active"
              ? "text-blue-600 font-semibold"
              : "text-blue-500"
          }`}
        >
          Active
        </a>
        <a
          href={`/todo?filter=completed${
            typeFilter !== "all" ? `&type=${typeFilter}` : ""
          }`}
          className={`hover:underline ${
            completionFilter === "completed"
              ? "text-blue-600 font-semibold"
              : "text-blue-500"
          }`}
        >
          Completed
        </a>
      </div>

      {/* 5. Add UI elements for type filtering */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                typeFilter === type
                  ? "bg-blue-500 text-white font-medium"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <ul className="space-y-3">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-start gap-3 p-3 border rounded shadow-sm bg-white"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                readOnly
                className="mt-1" // Align checkbox slightly lower
              />
              <div className="flex-1">
                <span
                  className={`block ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </span>
                {/* 6. Display the type */}
                <span className="text-xs capitalize bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {todo.type}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 italic">
            No todos match the current filters.
          </p>
        )}
      </ul>
    </div>
  );
}
