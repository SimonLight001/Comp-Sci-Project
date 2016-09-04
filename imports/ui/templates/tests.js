import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tests } from '../../api/tests.js';
import { Questions } from '../../api/questions.js';

import './tests.html'; 

Template.tests.helpers({
	test(){
		return Tests.find();
	}
});

function checker (subjects, subject){
	for (var i = 0; i < subjects.length; i++) {
		if(subjects[i] == subject){
			return false;
		}
	}
	return true;
}

Template.addtest.helpers({
	subject(){
		var tests = Tests.find().fetch();
		var subjects = [];
		for (var i = 0; i < tests.length; i++) {
			if(checker(subjects, tests[i].testSubject)){
				subjects[i] = tests[i].testSubject;	
			}
		}
		return subjects;
	},
	topic(){
		var topics = new ReactiveVar();
		topics = extTopic();
		console.log(topics);
		return topics;
	}
});

function extTopic(){
	var subject = document.getElementById('subjectPick').value;
	var tests = Tests.find({"testSubject":subject}).fetch();
	var topics = [];
	var toAssign = "<option id='topicOption'> - Topic - </option> ";


	for (var i = 0; i < tests.length; i++) {
		if(checker(topics, tests[i].testTopic)){
			topics[i] = tests[i].testTopic;
			toAssign += "<option value='" + topics[i] + "'>" + topics[i] + "</option> ";
		}	
	}

	toAssign += "<option value='new'>New Subject</option>";


	document.getElementById('topicPick').innerHTML = toAssign;

	return topics;
}

Template.addtest.events({
	'click #subjectPick'(event){
		extTopic();
		if(event.target.value == "new")
		{
			document.getElementById('newSubject').style.visibility = 'visible';
		} else {
			document.getElementById('newSubject').style.visibility = 'hidden';
		}

	},
	'click #topicPick' (event){
		if(event.target.value == "new")
		{
			document.getElementById('newTopic').style.visibility = 'visible';
		} else {
			document.getElementById('newTopic').style.visibility = 'hidden';
		}

	},
	'submit .add-test'(event){
		event.preventDefault();

		console.log("preparing to submit form");

		const target = event.target;
		const testName = target.name.value;
		const testClass = target.class.value;
		var testSubject = target.subject.value;
		const testTopic = target.topic.value;
		const testLowerLevel = target.levelLower.value;
		const testUpperLevel = target.levelUpper.value;
		const month = target.month.value;
		const year = target.year.value;
		const testDate = month + " " + year;
		const testLength = target.length.value;
		const testMarkMinMod = target.markminmodifier.value;
		const testComments = $('textarea.comments').get(0).value;
		const testOwner = Meteor.userId();
		const testCreateTime = new Date();

		if(testSubject == "new"){
			testSubject = target.newSubject.value;
		}
		if (testTopic == "new") {
			testSubject = target.newTopic.value;
		}

		console.log("new test : ", testName, testClass, testSubject, testTopic, testLowerLevel, testUpperLevel, testDate, testLength, testMarkMinMod, testComments, testOwner, testCreateTime);

		Meteor.call('tests.insert', testName, testClass, testSubject, testTopic, testLowerLevel, testUpperLevel, testDate, testLength, testMarkMinMod, testComments, testOwner, testCreateTime);

		var justAdded = Tests.findOne({"testName" : testName, "testOwner" : testOwner, "testCreateTime" : testCreateTime});

		console.log(justAdded);

		window.location.assign("/addtest/" + justAdded._id);


	}
});

Template.testQuestions.helpers({
	thisTest(){
		var testId = FlowRouter.getParam("testId");
		console.log(testId);
		return Tests.findOne({"_id" : testId});
	},
	testTotal(){
		var testId = FlowRouter.getParam("testId");
		test = Tests.findOne({"_id" : testId});
		return test.testMarkMinMod * test.testLength;
	},
	questions(){
		if(Meteor.isClient){
			console.log("fetching");
			console.log(Questions.find().fetch());
			return Questions.find();
		}
	}
});

Template.testQuestions.events({
	'click #addToTest' (event) {
		var testId = FlowRouter.getParam("testId");
		var questionId = this._id;
		Meteor.call('tests.addQuestion', testId, questionId);
		//Tests.addQuestion(testId, questionId);
		console.log(Tests.find({"_id" : testId}).fetch());
	},
});