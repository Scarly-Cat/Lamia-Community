// Generated by CoffeeScript 1.12.7
(function() {
  $(function() {
    $("#status-new").keypress(function(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        return $("#new-status").click();
      }
    });
    $.get("/users.json", (function(_this) {
      return function(response) {
        var parsed_user_list;
        parsed_user_list = response;
        return $("#status-new").atwho({
          at: "@",
          displayTpl: "<li>${name}</li>",
          insertTpl: "[@${login}]",
          data: parsed_user_list,
          limit: 30
        });
      };
    })(this));
    $.get("/local_emoticons.json", (function(_this) {
      return function(response) {
        var parsed_emoji_list;
        parsed_emoji_list = response;
        return $("#status-new").atwho({
          at: ":",
          displayTpl: "<li><img src=\"/static/smilies/${filename}\">${name}</li>",
          insertTpl: ":${name}:",
          data: parsed_emoji_list,
          limit: 30
        });
      };
    })(this));
    return $.get("/static/local/emoji.js", (function(_this) {
      return function(response) {
        var parsed_emoji_list;
        parsed_emoji_list = JSON.parse(response);
        return $("#status-new").atwho({
          at: "::",
          displayTpl: "<li>${unicode} ${name}</li>",
          insertTpl: "${unicode}",
          data: parsed_emoji_list,
          limit: 30
        });
      };
    })(this));
  });

}).call(this);