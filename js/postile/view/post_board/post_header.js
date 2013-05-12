goog.provide('postile.view.post_board.Header');

goog.require('goog.events');
goog.require('postile.view.profile');
goog.require('postile.view.account');
goog.require('goog.dom');
goog.require('postile.dom');
goog.require('postile.view.create_helper');
goog.require('postile.view.notification');
goog.require('postile.view.change_password');
goog.require('postile.view.inline_login');

postile.view.post_board.Header = function(boardData) {
    // this variable is for identifying current active icon
    this.curIcon = '';

    postile.view.NormalView.call(this);

    var instance = this;

    this.boardData = boardData;

    this.container.id = 'title_bar';

    postile.ui.load(this.container, postile.conf.staticResource(['post_board_title_bar.html']));

    this.topicInnerContainer_el = postile.dom.getDescendantById(instance.container, 'topic_inner_container');

    this.topicTitle_el = postile.dom.getDescendantById(this.topicInnerContainer_el, 'topic_title');
    this.topicTitle_el.innerHTML = this.boardData.name;

/*
    this.theme_area = postile.dom.getDescendantById(instance.container, 'theme_area');
    this.theme_main = postile.dom.getDescendantById(instance.container, 'theme_main');
    this.theme_word = postile.dom.getDescendantById(instance.container, 'theme_word');
    this.fold_toggle_button = postile.dom.getDescendantById(instance.container, 'fold_button');
    this.folded = false;
    goog.events.listen(this.fold_toggle_button, goog.events.EventType.CLICK, function(){
        this.fold_toggle();
    }.bind(this));
*/

    this.theme_image = postile.dom.getDescendantById(instance.container, 'theme_image');

    this.topicDescription_el = postile.dom.getDescendantById(this.topicInnerContainer_el, 'topic_description');
    this.topicDescription_el.innerHTML = this.boardData.description;

    // create a create post helper
    this.topicImgContainer_el = postile.dom.getDescendantById(instance.container, 'topic_image_container');
    this.topicImg_el = postile.dom.getDescendantByClass(this.topicImgContainer_el, 'topic_image');
    // this.topicImg_el.src = postile.conf.uploadsResource( [this.boardData.image_small_url] );
    this.topicImg_el.style.backgroundImage = 
        'url(' + postile.conf.uploadsResource( [this.boardData.image_small_url] ) + ')';

    goog.events.listen(
        this.topicImg_el,
        goog.events.EventType.CLICK,
        function(e) {
            postile.router.dispatch('topic/' + this.boardData.topic_id);
        }.bind(this));
    
    /**
     * @private
     */
    this.account_ = new postile.view.account.Account(this.boardData);
    goog.dom.appendChild(this.topicInnerContainer_el, this.account_.container);
};
goog.inherits(postile.view.post_board.Header, postile.view.NormalView);

/**
 * @overrideDoc
 */
postile.view.post_board.Header.prototype.close = function() {
    this.account_.close();
    goog.base(this, 'close');
};


postile.view.post_board.Header.prototype.fold_toggle =  function(){
    if(this.folded){

        this.folded = false;
        this.theme_area.style.height = '350px';

        this.theme_image.style.width = '250px';
        this.theme_image.style.height = '250px';

        this.theme_main.style.paddingTop = '50px';
        this.theme_word.style.paddingTop = '100px';

        this.fold_toggle_button.innerHTML = '&gt;&gt';

    } else {

        this.folded = true;
        this.theme_area.style.height = '150px';

        this.theme_image.style.width = '100px';
        this.theme_image.style.height = '100px';
        this.theme_main.style.paddingTop = '25px';
        this.theme_word.style.paddingTop = '12px';

        this.fold_toggle_button.innerHTML = '&lt;&lt';
    }
}

postile.view.post_board.Header.prototype.dismissOthers = function() {
}
