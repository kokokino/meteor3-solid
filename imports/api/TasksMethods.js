import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({
  "tasks.insert"(doc) {
    const insertDoc = { ...doc };
    if (!('userId' in insertDoc)) {
      insertDoc.userId = this.userId;
    }
    return TasksCollection.insertAsync(insertDoc);
  },
  "tasks.toggleChecked"({ _id, isChecked }) {
    return TasksCollection.updateAsync(_id, {
      $set: { isChecked: !isChecked },
    });
  },
  "tasks.delete"({ _id }) {
    return TasksCollection.removeAsync(_id);
  },
});
