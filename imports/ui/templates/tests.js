import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tests } from '../../api/tests.js';
import { Questions } from '../../api/questions.js';

import './tests.html'; 

Template.tests.helpers({
	test(){
		console.log(Tests.find().fetch());
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


		Meteor.call('tests.insert', testName, testClass, testSubject, testTopic, testLowerLevel, testUpperLevel, testDate, testLength, testMarkMinMod, testComments, testOwner, testCreateTime);

		var justAdded = Tests.findOne({"testName" : testName, "testOwner" : testOwner, "testCreateTime" : testCreateTime});


		window.location.assign("/addtest/" + justAdded._id);


	}
});

function findTests(){
	if(Meteor.isClient){
		var testId = FlowRouter.getParam("testId");
		console.log(testId);
		var test = Tests.findOne({"_id": testId});
		console.log(test);
		var questions = [];
		questions = test.testQuestions;
		if (questions == null) {
			console.log("in if");
			return Questions.find().fetch();
		} else {
			console.log("in else");
			var questionsArray = Questions.find().fetch();
			var unusedQuestions = [];
			for(var i = 0; i < questionsArray.length; i++){
				if(!(questions.includes(questionsArray[i]._id))){
					unusedQuestions.push(questionsArray[i]);
				}
			} 
			return unusedQuestions;
		}
	}
}

Template.testQuestions.helpers({
	thisTest(){
		var testId = FlowRouter.getParam("testId");
		return Tests.findOne({"_id" : testId});
	},
	testTotal(){
		var testId = FlowRouter.getParam("testId");
		test = Tests.findOne({"_id" : testId});
		return test.testMarkMinMod * test.testLength;
	},
	questions(){
		return findTests();
	},
	currentQuestions() {
		var testId = FlowRouter.getParam("testId");
		var test = Tests.findOne({"_id": testId});
		var questions = test.testQuestions;
		if(questions != null){
			if (questions != undefined) {
				var questionsObj = [];
				for(var i = 0; i < questions.length; i++){
					var questionData = Questions.findOne({"_id": questions[i]});
					questionData = questionData.question;
					var toPush = {"_id" : questions[i], "data" : questionData};
					questionsObj.push(toPush);
				}
				return questionsObj;
			} else {
				return ;
			}
		} else {
			return ;
		}


	},
	currentTotal(){
		var testId = FlowRouter.getParam("testId");
		var test = Tests.findOne({"_id": testId});
		var questions = test.testQuestions;
		if(questions != null){
			if (questions != undefined) {
				var total = 0;
				for(var i = 0; i < questions.length; i++)
				{
					var question = Questions.findOne({"_id": questions[i]});
					total += parseInt(question.marks);
				}
				var multiplier = test.testMarkMinMod;
				total = total *  multiplier;
				return total;
			} else {
				return ;
			}

		} else { 
			return ;
		}
	}
});

Template.testQuestions.events({
	'submit #deleteFromTest' (event){
		event.preventDefault();

		var testId = FlowRouter.getParam("testId");
		var target = event.target;
		var questionId = target.deleteSelect.value;
		if(questionId != "null")
		{
			Meteor.call('tests.removeQuestion', testId, questionId);	
		} else {
			alert("Please select a question to remove first");
		}
		
	},
	'click #addToTest' (event) {
		var testId = FlowRouter.getParam("testId");
		var questionId = this._id;
		Meteor.call('tests.addQuestion', testId, questionId);
		//Tests.addQuestion(testId, questionId);
	},
	'click #genTest' (event){
		var testId = FlowRouter.getParam("testId");
		window.location.assign("/test/" + testId);
	},
});

Template.testView.helpers({
	thisTest(){
		var testId = FlowRouter.getParam("testId");
		return Tests.findOne({"_id" : testId});
	},
	testTotal(){
		var testId = FlowRouter.getParam("testId");
		test = Tests.findOne({"_id" : testId});
		return test.testMarkMinMod * test.testLength;
	},
	questions(){
		return findTests();
	},
	currentQuestions() {
		var testId = FlowRouter.getParam("testId");
		var test = Tests.findOne({"_id": testId});
		var questions = test.testQuestions;
		if(questions != null){
			if (questions != undefined) {
				var questionsObj = [];
				for(var i = 0; i < questions.length; i++){
					var questionData = Questions.findOne({"_id": questions[i]});
					questionData = questionData.question;
					var toPush = {"_id" : questions[i], "data" : questionData};
					questionsObj.push(toPush);
				}
				return questionsObj;
			} else {
				return ;
			}
		} else {
			return ;
		}


	},
	currentTotal(){
		var testId = FlowRouter.getParam("testId");
		var test = Tests.findOne({"_id": testId});
		var questions = test.testQuestions;
		if(questions != null){
			if (questions != undefined) {
				var total = 0;
				for(var i = 0; i < questions.length; i++)
				{
					var question = Questions.findOne({"_id": questions[i]});
					total += parseInt(question.marks);
				}
				var multiplier = test.testMarkMinMod;
				total = total *  multiplier;
				return total;
			} else {
				return ;
			}

		} else { 
			return ;
		}
	}
});

Template.editTest.helpers({
	thisTest(){
		var testId = FlowRouter.getParam("testId");
		return Tests.findOne({"_id" : testId});
	},
	currentQuestions() {
		var testId = FlowRouter.getParam("testId");
		var test = Tests.findOne({"_id": testId});
		var questions = test.testQuestions;
		if(questions != null){
			if (questions != undefined) {
				var questionsObj = [];
				for(var i = 0; i < questions.length; i++){
					var questionData = Questions.findOne({"_id": questions[i]});
					questionData = questionData.question;
					var toPush = {"_id" : questions[i], "data" : questionData};
					questionsObj.push(toPush);
				}
				return questionsObj;
			} else {
				return ;
			}
		} else {
			return ;
		}


	},
	questions(){
		return findTests();
	},
});

Template.editTest.events({
	'submit #deleteFromTest' (event){
		event.preventDefault();

		var testId = FlowRouter.getParam("testId");
		var target = event.target;
		var questionId = target.deleteSelect.value;
		if(questionId != "null")
		{
			Meteor.call('tests.removeQuestion', testId, questionId);	
		} else {
			alert("Please select a question to remove first");
		}
		
	},
	'click #addToTest' (event) {
		var testId = FlowRouter.getParam("testId");
		var questionId = this._id;
		Meteor.call('tests.addQuestion', testId, questionId);
		//Tests.addQuestion(testId, questionId);
	},
	'click #genTest' (event){
		var testId = FlowRouter.getParam("testId");
		window.location.assign("/test/" + testId);
	},
});

Template.printTest.helpers({
	questions(){
		return findTests();
	},
});

Template.printTest.events({
	'click' (event){
		document.getElementById('toRemove').innerHTML = "";
		window.print();
	}
});

Template.printMark.helpers({
	questions(){
		return findTests();
	},
});

Template.printMark.events({
	'click' (event){
		document.getElementById('toRemove').innerHTML = "";
		window.print();
	}
})