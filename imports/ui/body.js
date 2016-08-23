import { Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Questions } from '../api/questions.js';


import './body.html';
import './templates/add.html';
import './templates/add.js';
import './body.css';
import './templates/list.js';
import './templates/list.html';
import './templates/tests.html';
import './templates/tests.js';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('questions');
});

Template.tabBar.events({
	'click a'(event){
		console.log(event);
	}
});