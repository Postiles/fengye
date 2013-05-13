goog.provide('postile.user');

goog.require('postile.view.login');

postile.user.current_username = null;

postile.user.login = function(username, password, onsuccess, onfail) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.status == 'ok') {
                    localStorage.postile_user_id = data.message.user.id;
                    localStorage.postile_user_session_key = data.message.user.session_key;
                    onsuccess();
                } else if (data.status == 'error') {
                    xhr2 = new XMLHttpRequest();

                    xhr2.onreadystatechange = function() {
                        if (xhr2.readyState == 4) {
                            if (xhr2.status == 200) {
                                var data = JSON.parse(xhr2.responseText);
                                if (data.status == 'ok') {
                                    window.location = 'http://fengye.postiles.com/signup';
                                } else {
                                    onfail();
                                }
                            }
                        }
                    }

                    xhr2.timeout = 10000;
                    xhr2.ontimeout = function() {
                        postile.ajax.notifier.networkError("request timeout");
                    }

                    url2 = 'http://postiles.com:3000/user/login';
                    xhr2.open('POST', url2);

                    formData = new FormData();

                    formData.append('username', username);
                    formData.append('password', password);

                    xhr2.send(formData);
                }
            }
        }
    }

    xhr.timeout = 10000;
    xhr.ontimeout = function() {
        postile.ajax.notifier.networkError("request timeout");
    }

    url = postile.conf.dynamicResource([ 'user', 'login' ]);
    xhr.open('POST', url);

    formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    xhr.send(formData);

    /*
    if (postile.conf.useragent.features.xhr >= 2) {
    } else {
    }
    */
}

postile.user.anonymous = function() {
    localStorage.postile_user_id = 0;
    //Dummy session key to fail some requests
    localStorage.postile_user_session_key = "Anonymous"
}

postile.user.logout = function() {
    postile.ajax([ 'user', 'logout' ], { }, function(e) {
        localStorage.postile_user_id = '';
        localStorage.postile_user_session_key = '';

        postile.router.dispatch('login' + '#' + window.location.pathname.substr(1) + window.location.hash);
    });
}

postile.user.openLoginBox = function() {
    if (postile.user.current_user) { return; } //already logged in
    if (postile.router.current_view instanceof postile.view.login.LoginView) { return; } //login window already opened

    postile.router.dispatch('login' + '#' + window.location.pathname.substr(1) + window.location.hash);
}
