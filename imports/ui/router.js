import './body.html';
import './templates/add.html';
import './templates/list.html';


FlowRouter.route('/', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "home"});
	}
});

FlowRouter.route('/tests', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "tests"});
	}
});

FlowRouter.route('/questions', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "questionsList"});
	}
});

FlowRouter.route('/add', {
	action(params, queryParams) {
		BlazeLayout.render("mainLayout", {content: "add"});
	}
});

FlowRouter.route('/addtest', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "addtest"});
	}
});

FlowRouter.route('/addtest/:testId', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "testQuestions"});
	}
});

FlowRouter.route('/test/:testId', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "testView"});
	}
});

FlowRouter.route('/edittest/:testId', {
	action: function(){
		BlazeLayout.render("mainLayout", {content: "editTest"});
	}
});

FlowRouter.route('/print/:testId/test', {
		action: function(){
		BlazeLayout.render("printTest");
	}
});

FlowRouter.route('/print/:testId/mark', {
		action: function(){
		BlazeLayout.render("printMark");
	}
});