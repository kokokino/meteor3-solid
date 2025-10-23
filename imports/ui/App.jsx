import { createSignal, For, Show } from "solid-js";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { TasksCollection } from "../api/TasksCollection";
import { Task } from "./Task.jsx";

export const App = () => {
  const [newTask, setNewTask] = createSignal('');

  const addTask = async (event) => {
    event.preventDefault();
    if (newTask().trim()) {
      await Meteor.callAsync("tasks.insert", {
        text: newTask(),
        createdAt: new Date(),
      });
      setNewTask('');
    }
  };

  const subscription = Meteor.subscribe("tasks");
  const [isReady, setIsReady] = createSignal(subscription.ready());
  const [tasks, setTasks] = createSignal([]);

  Tracker.autorun(async () => {
    setIsReady(subscription.ready());
    setTasks(await TasksCollection.find({}, { sort: { createdAt: -1, _id: -1 } }).fetchAsync());
  });

  return (
    <div class="app">
      <header>
        <div class="app-bar">
          <div class="app-header">
            <h1>📝️ Todo List</h1>                    
          </div>
        </div>
      </header>

      <div class="main">
        <form class="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Type to add new tasks"
            value={newTask()}
            onInput={(e) => setNewTask(e.currentTarget.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <Show
          when={isReady()}
          fallback={<div>Loading ...</div>}
        >
          <ul class="tasks">
            <For each={tasks()}>
              {(task) => (
                <Task task={task} />
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
};
