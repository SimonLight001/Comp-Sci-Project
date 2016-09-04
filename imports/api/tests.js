import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tests = new Mongo.Collection('tests');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish events that belong to the current user
  Meteor.publish('tests', function testsPublication() {
    return Tests.find();
    console.log("published tests");
    //return Venues.find();
  });
}

Meteor.methods({
  'tests.insert'(testName, testClass, testSubject, testTopic, testLowerLevel, testUpperLevel, testDate, testLength, testMarkMinMod, testComments, testOwner, testCreateTime) {
    console.log("run tests.insert");
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tests.insert({
		testName,
		testClass, 
    testSubject,
    testTopic,
		testLowerLevel,
		testUpperLevel,
		testDate,
		testLength,
		testMarkMinMod,
		testComments, 
    testOwner,
    testCreateTime
    });
  },
  'tests.addQuestion'(testId, question){
    Tests.update({ _id: testId },{ $push: { testQuestions: question }});
  }
});