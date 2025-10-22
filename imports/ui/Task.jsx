import { Meteor } from "meteor/meteor";

export const Task = (props) => {
  const { task } = props;

  const toggleChecked = async () => {
    await Meteor.callAsync("tasks.toggleChecked", { _id: task._id, isChecked: task.isChecked });
  };

  const deleteTask = async () => {
    await Meteor.callAsync("tasks.delete", { _id: task._id });
  };

  return (
    <li>
      <label>
        <input type="checkbox" checked={task.isChecked} onChange={toggleChecked} />
        <span>{task.text}</span>
      </label>

      <button class="delete" onClick={deleteTask}>&times;</button>
    </li>
  );
};