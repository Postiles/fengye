goog.provide('postile.view.InvitedUserQuickLogin');

goog.require('goog.crypt.base64');
goog.require('postile.user');
goog.require('postile.view.tutorial');

postile.view.InvitedUserQuickLogin = function(param) {
    var encodedUn = param;
    if (!encodedUn || !encodedUn.length) {
        postile.user.openLoginBox(); return;
    }
    var rawUn = goog.crypt.base64.decodeString(encodedUn);
    if (window.location.hash.length < 2) {
        alert(window.location.hash + window.location.hash.length);
        postile.user.openLoginBox(); return;
    }
    var encodedPw = window.location.hash.substr(1);
    var rawPw = goog.crypt.base64.decodeString(encodedPw);
    postile.user.login(rawUn, rawPw, function() {
        postile.router.dispatch('topic/1');
        new postile.view.change_password.ChangePassword(rawPw).open(500);
    }, postile.user.openLoginBox);
}

goog.inherits(postile.view.InvitedUserQuickLogin, postile.view.FullScreenView);
