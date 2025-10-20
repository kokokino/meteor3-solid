import { For } from "solid-js";

export const App = () => {
  const tasks = [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ];

  return (
    <div class="container">
      <header>
        <h1>Todo List</h1>
      </header>

      <ul>
        <For each={tasks}>
          {(task) => (
            <li>{task.text}</li>
          )}
        </For>
      </ul>
    </div>
  );
};