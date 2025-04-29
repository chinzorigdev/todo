// app/todo/page.tsx
"use client";

import { useSearchParams } from "next/navigation";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const dummyTodos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Do homework", completed: true },
  { id: 3, title: "Go for a walk", completed: false },
  { id: 4, title: "Clean room", completed: true },
];

export default function TodoPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const filteredTodos = dummyTodos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

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

      <ul className="space-y-2">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span
              className={todo.completed ? "line-through text-gray-500" : ""}
            >
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
