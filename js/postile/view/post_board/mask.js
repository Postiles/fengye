goog.provide('postile.view.post_board.mask');

goog.require('goog.events');
goog.require('goog.dom');

postile.view.post_board.PostCreator = function(post_board_obj) {
    var instance = this;
    this.board = post_board_obj;
    this.imageMode = false;
    this.videoMode = false;
    this.ghost_board_el = goog.dom.createDom('div', 'canvas_mask');
    this.hint_el = goog.dom.createDom('div', 'mask_hint');
    this.hint_el.innerHTML = postile._('mask_for_creating_post');
    instance.ghost_board_el.style.display = 'none';
    instance.hint_el.style.display = 'none';
    this.preview = goog.dom.createDom('div', 'post_preview');
    goog.dom.appendChild(this.ghost_board_el, this.preview);

    this.post_preview_origin_spot = goog.dom.createDom('div', 'post_preview_origin_spot');
    goog.dom.appendChild(this.ghost_board_el, this.post_preview_origin_spot);
    goog.dom.appendChild(this.ghost_board_el, this.hint_el);
    goog.dom.appendChild(this.board.canvas, this.ghost_board_el);
    goog.events.listen(this.ghost_board_el, goog.events.EventType.DBLCLICK, function(e) { e.stopPropagation(); instance.close(); });
    goog.events.listen(this.ghost_board_el, goog.events.EventType.MOUSEDOWN, function(e) { e.stopPropagation(); instance.mousedown(e); });
    goog.events.listen(this.ghost_board_el, goog.events.EventType.MOUSEMOVE, function(e) { e.stopPropagation(); instance.mousemove(e); });
    goog.events.listen(this.ghost_board_el, goog.events.EventType.MOUSEUP, function(e) { e.stopPropagation(); instance.mouseup(e); });
}

postile.view.post_board.PostCreator.prototype.open = function(imgUri, videoUri) {
    if(this.board.disableMovingCanvas) { 
        return; 
    }

    if(videoUri){
        console.log('video mode');
        this.videoMode = true;
        this.videoUri = videoUri;
        this.imgUri = imgUri;
        this.preview.style.backgroundImage = 'url(' + postile.conf.imageResource(imgUri) + ')';
        this.preview.style.backgroundSize = '96px 96px';
        this.preview.style.backgroundRepeat = 'no-repeat';

    } else {
        if(imgUri) {
            this.imageMode = true;
            this.imgUri = imgUri;
            this.preview.style.backgroundImage = 'url(' + postile.conf.uploadsResource(imgUri) + ')';
            console.log(postile.conf.uploadsResource(imgUri));
        } else {
            this.imageMode = false;
            this.preview.style.backgroundImage = 'none';
        }
    }

    this.board.disableMovingCanvas = true;
    this.ghost_board_el.style.display = 'block';
    this.hint_el.style.display = 'block';

    this.escHandler = new postile.events.EventHandler(postile.conf.getGlobalKeyHandler(), 
            goog.events.EventType.KEYDOWN, function(e) { 
        if (e.keyCode == 27) { // esc pressed
            this.close();
        }
    }.bind(this));

    this.escHandler.listen();
}

postile.view.post_board.PostCreator.prototype.close = function() {
    this.ghost_board_el.style.display = 'none';
    this.hint_el.style.display = 'none';
    this.board.disableMovingCanvas = false;

    this.escHandler.unlisten();
}

//mouseevents for the mask
postile.view.post_board.PostCreator.prototype.mousedown = function(e) { //find the closest grid point
    //this.start_mouse_coord = [Math.round(this.board.xPosFrom(e.clientX - this.board.viewport_position.x - this.board.canvasCoord[0])), Math.round(this.board.yPosFrom(e.clientY - this.board.viewport_position.y - this.board.canvasCoord[1]))];
    this.new_post_start_coord_in_px = [e.clientX, e.clientY]; //used to disable warning when double clicking
    
    /*
    this.post_preview_origin_spot.style.left = this.board.xPosTo(this.start_mouse_coord[0])-17+'px';
    this.post_preview_origin_spot.style.top = this.board.yPosTo(this.start_mouse_coord[1])-17+'px';
    
    this.post_preview_origin_spot.style.display = 'block';
    */
    this.doWhatEverTheFuck(e);
};

postile.view.post_board.PostCreator.prototype.mousemove = function(e) { 
    this.doWhatEverTheFuck(e);
};

postile.view.post_board.PostCreator.prototype.doWhatEverTheFuck = function(e) {
    var current = [this.board.xPosFrom(e.clientX - this.board.viewport_position.x - this.board.canvasCoord[0]), this.board.yPosFrom(e.clientY - this.board.viewport_position.y - this.board.canvasCoord[1])];

    var delta = [0, 0];
    var end = [0, 0];
    var i;

    for (i = 0; i < 2; i++) {
        delta[i] = 1; //calculate the expected width/height in the unit of "grid unit"       
        current[i] = Math.floor(current[i]);
        end[i] = current[i] + 1;
    }

    //now "current" saves the smaller value and "end" saves the larger one
    //check if available
    var intersect = false;
    for (i in this.board.currentPosts) {
        //from http://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
        if(!(current[0] >= this.board.currentPosts[i].postData.post.coord_x_end 
                    || end[0] <= this.board.currentPosts[i].postData.post.pos_x 
                    || current[1] >=this.board.currentPosts[i].postData.post.coord_y_end 
                    || end[1] <= this.board.currentPosts[i].postData.post.pos_y)) { 
                    //console.log(this.board.currentPosts[i]);
            intersect = true;
            break;
        }
    }
    //draw on the canvas
    this.position = { 
        pos_x: current[0], 
        pos_y: current[1], 
        span_x: Math.abs(delta[0]), 
        span_y: Math.abs(delta[1])
    };

    this.preview.style.left = this.board.xPosTo(this.position.pos_x) + 'px';
    this.preview.style.top = this.board.yPosTo(this.position.pos_y) + 'px';

    this.preview.style.width = this.board.widthTo(this.position.span_x) + 'px';
    this.preview.style.height = this.board.heightTo(this.position.span_y) + 'px';

    this.legal_intersect = (!intersect);
    
    this.legal = this.legal_intersect;

    if (!this.imageMode) { // text or video
        this.preview.style.backgroundColor = this.legal ? '#e4eee4': '#f4dcdc';
    }
    this.preview.style.color = this.legal ? '#999' : '#333';

    if(!this.legal_intersect){
        this.preview.innerHTML = "Area Occupied";
    } else {
        this.preview.innerHTML = "Release to create";
    }

    this.preview.style.display = 'table-cell';
    this.preview.style.fontSize = '16pt'; 
}

postile.view.post_board.PostCreator.prototype.mouseup = function(e){
    this.board.disableMovingCanvas = false;
    this.start_mouse_coord = null;
    this.post_preview_origin_spot.style.display = 'none';
    this.preview.style.display = 'none';
    if (!this.legal) {
        if (this.new_post_start_coord_in_px 
                && Math.abs(this.new_post_start_coord_in_px[0] - e.clientX) > 3 
                && Math.abs(this.new_post_start_coord_in_px[1] - e.clientY) > 3) 
        { //do not show when dbl clicking
            postile.toast.title_bar_toast(postile._('post_zone_illegal'), 2);
        }
        this.new_post_start_coord_in_px = null;
        return;
    }
    this.legal = false;
    this.new_post_start_coord_in_px = null;


    if(this.imageMode){
        this.imageMode = false;
        this.board.createImagePost(this.position, this.imgUri);

    } else if(this.videoMode){
        this.videoMode = false;
        this.board.createVideoPost(this.position, this.videoUri);
        // TODO modify the createPost function for image and video.
    }else {
        this.board.createPost(this.position);
    }
    this.close();
};
