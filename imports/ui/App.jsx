import { ReactiveVar } from 'meteor/reactive-var';
import { createSignal, For, Show, createEffect } from "solid-js";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { TasksCollection } from "../api/TasksCollection";
import { Task } from "./Task.jsx";
import { Login } from "./Login.jsx";

export const App = () => {
  const [newTask, setNewTask] = createSignal('');
  const [hideCompleted, setHideCompleted] = createSignal(false);

  // New: ReactiveVar for Tracker integration
  const hideCompletedVar = new ReactiveVar(false);

  // New: Sync Solid signal to ReactiveVar (triggers Tracker re-run)
  createEffect(() => {
    hideCompletedVar.set(hideCompleted());
  });

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

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted());
  };

  const subscription = Meteor.subscribe("tasks");
  const [isReady, setIsReady] = createSignal(subscription.ready());
  const [tasks, setTasks] = createSignal([]);

  Tracker.autorun(async () => {
    setIsReady(subscription.ready());
    if (!Meteor.userId()) {
      setTasks([]); 
      return; 
    } 
    // Use ReactiveVar in the query for Tracker reactivity
    const query = hideCompletedVar.get() ? { isChecked: { $ne: true } } : {};
    setTasks(await TasksCollection.find(query, { sort: { createdAt: -1, _id: -1 } }).fetchAsync());
  });

  // Reactive incomplete count
  const [incompleteCount, setIncompleteCount] = createSignal(0);
  Tracker.autorun(async () => {
    if (!Meteor.userId()) { // Skip if not logged in
      setIncompleteCount(0); 
      return; 
    } 
    setIncompleteCount(await TasksCollection.find({ isChecked: { $ne: true } }).countAsync());
  });

  const [currentUser, setCurrentUser] = createSignal(Meteor.user()); // Reactive current user
  Tracker.autorun(() => { 
    setCurrentUser(Meteor.user()); 
  }); 

  return (
    <div class="app">
      <header>
        <div class="app-bar">
          <div class="app-header">
            <h1>📝️ To Do List {incompleteCount() > 0 ? `(${incompleteCount()})` : ''}</h1>
          </div>
        </div>
      </header>

      <div class="main">
        <Show
          when={currentUser()}
          fallback={<Login />}
        >
          <div class="user" onClick={() => Meteor.logout()}> 
            {currentUser()?.username} 🚪 
          </div> 

          <form class="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="Type to add new tasks"
              value={newTask()}
              onInput={(e) => setNewTask(e.currentTarget.value)}
            />
            <button type="submit">Add Task</button>
          </form>

          <div class="filter">
            <button onClick={toggleHideCompleted}>
              <Show
                when={hideCompleted()}
                fallback="Hide Completed"
              >
                Show All
              </Show>
            </button>
          </div>

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
        </Show>
      </div>
    </div>
  );
};
