import { createSignal, For, Show } from "solid-js";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { TasksCollection } from "../api/TasksCollection";

export const App = () => {
  const subscription = Meteor.subscribe("tasks");
  const [isReady, setIsReady] = createSignal(subscription.ready());
  const [tasks, setTasks] = createSignal([]);

  Tracker.autorun(async () => {
    setIsReady(subscription.ready());
    setTasks(await TasksCollection.find().fetchAsync());
  });

  return (
    <div class="container">
      <header>
        <h1>Todo List</h1>
      </header>

      <Show
        when={isReady()}
        fallback={<div>Loading ...</div>}
      >
        <ul>
          <For each={tasks()}>
            {(task) => (
              <li>{task.text}</li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};