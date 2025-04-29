"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type TodoType = "grocery" | "work" | "personal" | "health" | "other";
type Todo = {
  id: number;
  title: string;
  completed?: boolean; // Making completed optional since it's missing in your data
  type: TodoType;
};

const dummyTodos: Todo[] = [
  { id: 1, title: "Buy groceries", type: "grocery", completed: false },
  { id: 2, title: "Finish project", type: "work", completed: true },
  { id: 3, title: "Doctor appointment", type: "health", completed: false },
  { id: 4, title: "Call mom", type: "personal", completed: true },
  { id: 5, title: "Read a book", type: "other", completed: false },
  { id: 6, title: "Go for a walk", type: "health", completed: false },
  { id: 7, title: "Buy milk", type: "grocery", completed: true },
  { id: 8, title: "Finish report", type: "work", completed: false },
  { id: 9, title: "Dentist appointment", type: "health", completed: false },
  { id: 10, title: "Call dad", type: "personal", completed: true },
  { id: 11, title: "Watch documentary", type: "other", completed: false },
];

const availableTypes: Array<TodoType | "all"> = [
  "all",
  "grocery",
  "work",
  "personal",
  "health",
  "other",
];

export default function ToDoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values directly from URL search params
  const type = searchParams.get("type") as TodoType | null;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  // State for the search input field only (to control the input value)
  const [searchInput, setSearchInput] = useState(search);

  // Helper function to update search parameters
  const updateSearchParams = (params: Record<string, string | null>) => {
    // Create a new URLSearchParams object from the current params
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or delete parameters based on provided values
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // Navigate to the new URL
    router.push(`?${newParams.toString()}`);
  };

  // Handle type filter
  const handleTypeFilter = (selectedType: TodoType | "all") => {
    updateSearchParams({
      type: selectedType === "all" ? null : selectedType,
    });
  };

  // Handle status filter
  const handleStatusFilter = (selectedStatus: string | null) => {
    updateSearchParams({ status: selectedStatus });
  };

  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    updateSearchParams({
      search: searchInput.trim() ? searchInput : null,
    });
  };

  // Filter todos based on search parameters
  const filteredTodos = dummyTodos.filter((todo) => {
    // Filter by type
    if (type && todo.type !== type) return false;

    // Filter by completion status
    if (status === "completed" && !todo.completed) return false;
    if (status === "active" && todo.completed) return false;

    // Filter by search query
    if (search && !todo.title.toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  });

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">To Do List</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search todos..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        {(type || status || search) && (
          <button
            type="button"
            onClick={() => {
              router.push("/");
              setSearchInput("");
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Clear All
          </button>
        )}
      </form>

      {/* Status filter */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Status:</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: null },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
          ].map((statusOption) => (
            <button
              key={statusOption.label}
              onClick={() => handleStatusFilter(statusOption.value)}
              className={`px-3 py-1 rounded text-sm ${
                statusOption.value === status ||
                (!status && statusOption.value === null)
                  ? "bg-blue-500 text-white font-medium"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {statusOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((typeOption) => (
            <button
              key={typeOption}
              onClick={() => handleTypeFilter(typeOption)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                typeOption === type || (typeOption === "all" && !type)
                  ? "bg-blue-500 text-white font-medium"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {typeOption}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters display */}
      {(type || status || search) && (
        <div className="mb-4 p-3 bg-gray-50 border rounded">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">
              Active filters:
            </span>
            {type && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                Type: {type}
                <button
                  onClick={() => updateSearchParams({ type: null })}
                  className="hover:text-blue-600 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {status && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                Status: {status}
                <button
                  onClick={() => updateSearchParams({ status: null })}
                  className="hover:text-blue-600 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                Search: {search}
                <button
                  onClick={() => {
                    updateSearchParams({ search: null });
                    setSearchInput("");
                  }}
                  className="hover:text-blue-600 font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Todo list */}
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
                className="mt-1"
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
