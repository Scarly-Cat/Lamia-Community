// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Messages;
    Messages = (function() {
      function Messages() {
        this.refreshTopics = bind(this.refreshTopics, this);
        var category;
        category = this;
        this.page = 1;
        this.max_pages = 1;
        this.pagination = 20;
        this.topicHTML = Handlebars.compile(this.topicHTMLTemplate());
        this.paginationHTML = Handlebars.compile(this.paginationHTMLTemplate());
        this.refreshTopics();
        $("nav.pagination-listing").delegate(".change-page", "click", function(e) {
          var element;
          e.preventDefault();
          element = $(this);
          $(".page-link-" + category.page).parent().removeClass("active");
          category.page = parseInt(element.text());
          return category.refreshTopics();
        });
        $("nav.pagination-listing").delegate("#previous-page", "click", function(e) {
          var element;
          e.preventDefault();
          element = $(this);
          if (category.page !== 1) {
            $(".change-page").parent().removeClass("active");
            category.page--;
            return category.refreshTopics();
          }
        });
        $("nav.pagination-listing").delegate("#next-page", "click", function(e) {
          var element;
          e.preventDefault();
          element = $(this);
          if (category.page !== category.max_pages) {
            console.log($(".page-link-" + category.page).parent().next().children("a").text());
            $(".change-page").parent().removeClass("active");
            category.page++;
            return category.refreshTopics();
          }
        });
      }

      Messages.prototype.paginationHTMLTemplate = function() {
        return "<ul class=\"pagination\">\n  <li>\n    <a href=\"\" aria-label=\"Previous\" id=\"previous-page\">\n      <span aria-hidden=\"true\">&laquo;</span>\n    </a>\n  </li>\n  {{#each pages}}\n  <li><a href=\"\" class=\"change-page page-link-{{this}}\">{{this}}</a></li>\n  {{/each}}\n  <li>\n    <a href=\"\" aria-label=\"Next\" id=\"next-page\">\n      <span aria-hidden=\"true\">&raquo;</span>\n    </a>\n  </li>\n</ul>";
      };

      Messages.prototype.topicHTMLTemplate = function() {
        return "  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-6\">\n      <span class=\"topic-listing-name\">\n      {{#if new_messages}}<strong>{{/if}}<a href=\"/messages/{{_id}}\">{{title}}</a>{{#if new_messages}}</strong>{{/if}}<br>\n      <span class=\"topic-author\">\n        Started by {{creator}}, {{created}}\n      </span>\n      <span class=\"topic-listing-jumps\">\n        <span class=\"badge\" style=\"\"><a class=\"inherit_colors\" href=\"/messages/{{_id}}/page/1\">1</a></span>\n        {{#if last_pages}}\n        <span class=\"badge\" style=\"\">...</span>\n        <span class=\"badge\" style=\"\"><a class=\"inherit_colors\" href=\"/messages/{{_id}}/page/1/post/latest_post\">{{last_page}}</a></span>\n        {{/if}}\n      </span>\n      <br>\n      <span class=\"topic-author\">\n        with:\n        {{#each participants}}\n          <a href=\"/member/{{0}}\" class=\"topic-listing-username hover_user\">{{1}}</a>{{2}}{{/each}}\n      </span>\n    </div>\n    <div class=\"col-xs-3 hidden-xs hidden-sm\">\n      <span class=\"topic-listing-recent\">\n        <a href=\"/messages/{{_id}}\" class=\"topic-listing-text\">{{message_count}} replies</a>\n      </span>\n    </div>\n    <div class=\"col-xs-6 col-sm-3 hidden-xs\">\n      <span class=\"topic-listing-recent-image subcategory-listing-recent-image\">\n        <img src=\"{{last_post_author_avatar}}\" width=\"{{last_post_x}}px\" height=\"{{last_post_y}}px\" class=\"avatar-mini\">\n      </span>\n      <span class=\"topic-listing-recent\">\n        <a href=\"/member/{{last_post_by_login_name}}\" class=\"topic-listing-username hover_user\">{{last_post_by}}</a>\n        <br>\n        <a href=\"/messages/{{_id}}/page/1/post/last_seen\" class=\"topic-listing-time\">{{last_post_date}}</a>\n      </span>\n    </div>\n  </div>\n</div>\n{{#unless last}}\n<hr>\n{{/unless}}";
      };

      Messages.prototype.refreshTopics = function() {
        var new_topic_html;
        new_topic_html = "";
        return $.post("/message-topics", JSON.stringify({
          page: this.page,
          pagination: this.pagination
        }), (function(_this) {
          return function(data) {
            var i, j, k, len, pages, pagination_html, ref, ref1, results, topic;
            ref = data.topics;
            for (i = j = 0, len = ref.length; j < len; i = ++j) {
              topic = ref[i];
              if (i === data.topics.length - 1) {
                topic.last = true;
              }
              topic.last_page = Math.ceil(topic.last_page);
              new_topic_html = new_topic_html + _this.topicHTML(topic);
            }
            pages = (function() {
              results = [];
              for (var k = 1, ref1 = Math.ceil(data.count / _this.pagination); 1 <= ref1 ? k <= ref1 : k >= ref1; 1 <= ref1 ? k++ : k--){ results.push(k); }
              return results;
            }).apply(this);
            _this.max_pages = pages[pages.length - 1];
            pagination_html = _this.paginationHTML({
              pages: pages
            });
            $(".topic-listing").html(new_topic_html);
            $(".pagination-listing").html(pagination_html);
            return $(".page-link-" + _this.page).parent().addClass("active");
          };
        })(this));
      };

      return Messages;

    })();
    return window.messages = new Messages();
  });

}).call(this);
