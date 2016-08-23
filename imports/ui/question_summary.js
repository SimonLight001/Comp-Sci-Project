import { Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Questions } from '../api/questions.js';

import './question_summary';


Template.questionsummary.helpers({
	thisQuestion(){
		
	}
});
