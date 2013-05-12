goog.provide('postile.view.TopicAdmin');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('postile.view');
goog.require('postile.dom');

postile.view.TopicAdmin = function(topic) {
	goog.base(this);

	this.container.id = 'admin_user_in_topic';

	this.admin_user_table = postile.dom.getDescendantById(this.container, 'admin_user_table');

	/*
	postile.ajax([ 'topic', 'get_topic' ], { topic_id: topic }, function(data) {
        instance.real_title.innerHTML = data.message.topic.name;
    });
	*/

}

goog.inherits(postile.view.TopicAdmin, postile.view.FullScreenView);
postile.view.TopicAdmin.prototype.unloaded_stylesheets = ['topic_admin.css'];
