goog.provide('postile.view.new_navigator');

goog.require('goog.events');
goog.require('goog.dom');


postile.view.new_navigator.NewNavigator = function(input_instance){
    postile.view.NormalView.call(this);
    postile.ui.load(this.container, postile.conf.staticResource(['_new_navigator.html']));

    this.container.id = 'new_navigator_wrapper';

    this.navigate_button = postile.dom.getDescendantsByClass(this.container, 'new_navigator_button');
    this.next_button = postile.dom.getDescendantsByClass(this.container, 'new_navigator_next');

    // Click on the button
    goog.events.listen((this.navigate_button)[0], goog.events.EventType.CLICK, function(){
        // next appear
        goog.dom.classes.add(this.next_button[0], 'next_navigate_out');

        // go to the newest posts

    }.bind(this));

    // Click on the newxt button
    goog.events.listen((this.next_button)[0], goog.events.EventType.CLICK, function(){

        // go to the next posts

    }.bind(this));

}

goog.inherits(postile.view.new_navigator.NewNavigator, postile.view.NormalView);
postile.view.new_navigator.NewNavigator.prototype.unloaded_stylesheets = ['new_navigator.css'];
