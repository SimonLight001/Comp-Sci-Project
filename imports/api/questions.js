import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Questions = new Mongo.Collection('questions');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish events that belong to the current user
  Meteor.publish('questions', function questionsPublication() {
    return Questions.find();
    console.log("published questions");
    //return Venues.find();
  });
}

Meteor.methods({
  'questions.insert'(subject, topic, level, marks, date, question, answer) {
    console.log("run questions.insert");
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Questions.insert({
		subject,
		topic,
		level,
		marks,
		date,
		question,
		answer
    });
  },
  'events.update'(name, did, subject, topic, level, marks, date, question, answerescription, 
      startDate, endDate, startTime, 
      endTime, eventId) {
    console.log("run events.update");
    check(name, String);

    //checking privelleges
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Events.update(eventId, {
      $set: {name, 
      description, 
      startDate, 
      endDate, 
      startTime, 
      endTime
      }
    });
  },
  'events.remove'(eventId) {
    check(eventId, String);

    const event = Events.findOne(eventId);
    const venueId = event.venueId;
    const venue = Venues.findOne(venueId);

    if (venue.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.remove(eventId);
  },
});
