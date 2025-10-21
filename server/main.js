import { Meteor } from "meteor/meteor";
import { TasksCollection } from "/imports/api/TasksCollection";
import "../imports/api/TasksPublications";
import "../imports/api/TasksMethods";

Meteor.startup(async () => {
  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach((taskName) => {
      Meteor.callAsync("tasks.insert", {
        text: taskName,
        createdAt: new Date(),
      });      
    });
  }
});