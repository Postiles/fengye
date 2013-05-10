goog.provide('postile.view.post_board.LatestPosts');

postile.view.post_board.LatestPosts = function(boardData) {
    postile.view.TipView.call(this);
    this.boardId = boardData.topic_id;
    this.current_index = null;
    this.info = null;
    this.container.style.width = "200px";
    this.container.style.height = "100px";
    this.container.style.backgroundColor = '#000';
    this.container.style.color = '#FFF';
    this.prev = goog.dom.createDom('div');
    this.next = goog.dom.createDom('div');
    this.prev.innerHTML = '<< NEWER';
    this.next.innerHTML = 'OLDER >>';
    goog.dom.appendChild(this.container, this.prev);
    goog.dom.appendChild(this.container, this.next);
    var instance = this;
    goog.events.listen(this.prev, goog.events.EventType.CLICK, function(e) {
        instance.go(--instance.current_index);
    });
    goog.events.listen(this.next, goog.events.EventType.CLICK, function(e) {
        instance.go(++instance.current_index);
    });
}

goog.inherits(postile.view.post_board.LatestPosts, postile.view.TipView);

postile.view.post_board.LatestPosts.prototype.go = function(index) {
    if (index >= this.info.length - 1) {
        this.next.style.visibility = 'hidden';
    } else {
        this.next.style.visibility = 'visible';
    }
    if (index <= 0) {
        this.prev.style.visibility = 'hidden';
    } else {
        this.prev.style.visibility = 'visible';
    }
    postile.view.switchToPost(this.info[index]);
}

postile.view.post_board.LatestPosts.prototype.open = function(a, b) {
    var instance = this;
    postile.ajax(['board', 'get_all_posts_by_time'], { board_id: instance.boardId }, function(r) {
        instance.info = r.message;
        if (!instance.info.length) { return; }
        postile.view.TipView.prototype.open.call(instance, a, b);
        instance.current_index = 0;
        instance.go(0);
    });
}