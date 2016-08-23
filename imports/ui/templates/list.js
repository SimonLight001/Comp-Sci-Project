import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Questions } from '../../api/questions.js';

import './list.html';
import '../question_summary.html';

Template.questionsList.helpers({
	test(){
		console.log("test");
	},
	questions(){
		if(Meteor.isClient){
			console.log("fetching");
			console.log(Questions.find().fetch());
			return Questions.find();
		}
	},
	incompleteCount() {
		return Questions.find().count();
	},
});