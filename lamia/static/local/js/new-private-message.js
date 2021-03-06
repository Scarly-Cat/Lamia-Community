// Generated by CoffeeScript 1.12.7
(function() {
  $(function() {
    var NewTopic;
    window.onbeforeunload = function() {
      if (!window.save) {
        return "You haven't saved your changes.";
      }
    };
    NewTopic = (function() {
      function NewTopic() {
        var new_topic;
        this.inline_editor = new InlineEditor("#new-post-box", "", false);
        new_topic = self;
        $("#to").select2({
          ajax: {
            url: "/user-list-api",
            dataType: 'json',
            delay: 250,
            data: function(params) {
              return {
                q: params.term
              };
            },
            processResults: function(data, page) {
              console.log({
                results: data.results
              });
              return {
                results: data.results
              };
            },
            cache: true
          },
          minimumInputLength: 2
        });
        this.inline_editor.onSave(function(html, text) {
          var prefix, title, to;
          window.save = true;
          title = $("#title").val();
          prefix = $("#prefix").val();
          to = $("#to").val();
          return $.post("/new-message", JSON.stringify({
            html: html,
            text: text,
            title: title,
            prefix: prefix,
            to: to
          }), (function(_this) {
            return function(data) {
              if (data.error != null) {
                return topic.inline_editor.flashError(data.error);
              } else {
                return window.location = data.url;
              }
            };
          })(this));
        });
      }

      return NewTopic;

    })();
    return window.topic = new NewTopic();
  });

}).call(this);
