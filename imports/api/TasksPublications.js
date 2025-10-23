import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.publish("tasks", function () {
  let result = this.ready();
  const userId = this.userId;
  if (userId) {
    result = TasksCollection.find({ userId });
  }
  
  return result;
});
