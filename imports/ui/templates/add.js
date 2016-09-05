import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Questions } from '../../api/questions.js';

import './add.html';
import '../question_summary.html';


Template.add.events({
  'click #cancel'(event, instance) {
    
    event.preventDefault();

    if(confirm("Are you sure you want to cancel?"))
    {
    	window.location.assign("/");
    }
  },
  'submit .add-questions'(event) {

  	event.preventDefault();
  	
  	const target = event.target;
  	const questionSubject = target.subject.value;
  	const questionTopic = target.topic.value;
  	const questionLevel = target.level.value;
  	const questionMarks = target.marks.value;
  	const month = target.month.value;
  	const year = target.year.value;
  	const questionDate = month + " " + year;
  	const questionQuestion = $('textarea.question').get(0).value;
  	const questionAnswer = $('textarea.answer').get(0).value;


    Meteor.call('questions.insert', questionSubject,
      questionTopic, questionLevel, questionMarks,
      questionDate, questionQuestion, questionAnswer);


    //redirect
  },
});

Template.add.helpers({
	thisQuestion() {
		const questionId=FlowRouter.getParam("questionId");
		return Questions.findOne({"_id": questionId});
	},
});