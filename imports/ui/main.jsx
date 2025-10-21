/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './App';
import { Meteor } from "meteor/meteor";
import './main.css';
import "/imports/api/TasksMethods"; // this import allows for optimistic execution

Meteor.startup(() => {
  render(() => <App/>, document.getElementById('root'));
});