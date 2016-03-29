// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var Dashboard;
    Dashboard = (function() {
      function Dashboard() {
        var $grid, _panel, socket;
        $grid = $('#dashboard-container');
        window.grid = $grid;
        $grid.shuffle({
          speed: 0
        });
        this.categories = {};
        this.notificationTemplate = Handlebars.compile(this.notificationHTML());
        this.panelTemplate = Handlebars.compile(this.panelHTML());
        this.dashboard_container = $("#dashboard-container");
        this.category_names = {
          topic: "Topics",
          pm: "Private Messages",
          mention: "Mentioned",
          topic_reply: "Topic Replies",
          boop: "Boops",
          mod: "Moderation",
          status: "Status Updates",
          new_member: "New Members",
          announcement: "Announcements",
          profile_comment: "Profile Comments",
          rules_updated: "Rule Update",
          faqs: "FAQs Updated",
          user_activity: "Followed:User Activity",
          streaming: "Streaming",
          other: "Other"
        };
        this.buildDashboard();
        _panel = this;
        if ($(".io-class").data("path") !== "/") {
          socket = io.connect($(".io-class").data("config"), {
            path: $(".io-class").data("path") + "/socket.io"
          });
        } else {
          socket = io.connect($(".io-class").data("config"));
        }
        socket.on("notify", function(data) {
          var ref;
          if (data.count_update != null) {
            return;
          }
          if (ref = window.woe_is_me, indexOf.call(data.users, ref) >= 0) {
            $(".nothing-new").remove();
            _panel.addToPanel(data, true);
            return _panel.setPanelDates();
          }
        });
        $("#dashboard-container").on('removed.shuffle', (function(_this) {
          return function(e) {
            return _this.isPanelEmpty();
          };
        })(this));
        $("#dashboard-container").delegate(".ack_all", "click", function(e) {
          var panel;
          e.preventDefault();
          panel = $("#" + $(this).data("panel"));
          return $.post("/dashboard/ack_category", JSON.stringify({
            category: panel.attr("id")
          }), (function(_this) {
            return function(data) {
              if (data.success != null) {
                $(".dashboard-counter").text(data.count);
                return $("#dashboard-container").shuffle("remove", panel);
              }
            };
          })(this));
        });
        $("#dashboard-container").delegate(".ack_single_href", "click", function(e) {
          e.preventDefault();
          return $.post("/dashboard/ack_notification", JSON.stringify({
            notification: $(this).data("notification")
          }), (function(_this) {
            return function(data) {
              return window.location = $(_this).attr("href");
            };
          })(this));
        });
        $("#dashboard-container").delegate(".ack_single", "click", function(e) {
          var notification, panel, panel_notifs;
          e.preventDefault();
          notification = $("#" + $(this).data("notification"));
          panel_notifs = $("#notifs-" + $(this).data("panel"));
          panel = $("#" + $(this).data("panel"));
          return $.post("/dashboard/ack_notification", JSON.stringify({
            notification: notification.attr("id")
          }), (function(_this) {
            return function(data) {
              if (data.success != null) {
                $(".dashboard-counter").text(data.count);
                if (panel_notifs.children().length < 2) {
                  return $("#dashboard-container").shuffle("remove", panel);
                } else {
                  return notification.remove();
                }
              }
            };
          })(this));
        });
      }

      Dashboard.prototype.isPanelEmpty = function() {
        if ($(".dashboard-panel").length === 0) {
          return $("#dashboard-container").before("<ul class=\"list-group\">\n  <li class=\"list-group-item\">\n    <p class=\"nothing-new\">No new notifications, yet.</p>\n  </li>\n</ul>");
        } else {
          return $(".nothing-new").remove();
        }
      };

      Dashboard.prototype.setPanelDates = function() {
        $(".dashboard-panel").children(".panel").children("ul").each(function() {
          var element, first_timestamp;
          element = $(this);
          first_timestamp = element.children("li").first().data("stamp");
          return element.parent().parent().data("stamp", first_timestamp);
        });
        return setTimeout(function() {
          var sort_opts;
          $("#dashboard-container").shuffle('appended', $(".dashboard-panel"));
          $("#dashboard-container").shuffle("update");
          sort_opts = {
            reverse: true,
            by: function(el) {
              return el.data("stamp");
            }
          };
          return $("#dashboard-container").shuffle("sort", sort_opts);
        }, 100);
      };

      Dashboard.prototype.addToPanel = function(notification, live) {
        var category_element, count, existing_notification, panel;
        if (live == null) {
          live = false;
        }
        category_element = $("#notifs-" + notification.category);
        if (category_element.length === 0) {
          panel = {
            panel_id: notification.category,
            panel_title: this.category_names[notification.category]
          };
          this.dashboard_container.append(this.panelTemplate(panel));
          category_element = $("#notifs-" + notification.category);
        }
        notification._member_name = notification.member_pk;
        existing_notification = $(".ref-" + notification.reference + "-" + notification.category + "-" + notification._member_name);
        if (existing_notification.length > 0 && notification.reference !== "") {
          count = parseInt(existing_notification.data("count"));
          count = count + 1;
          if (!existing_notification.children("media-left").is(":visible")) {
            existing_notification.children(".media-left").show();
          }
          existing_notification.data("count", count);
          existing_notification.data("stamp", notification.stamp);
          existing_notification.children(".media-left").children(".badge").text(count);
          existing_notification.find(".m-name").attr("href", "/member/" + notification.member_name);
          existing_notification.find(".m-name").text(notification.member_disp_name);
          existing_notification.find(".m-time").text(notification.time);
          existing_notification.find(".m-title").text(notification.text);
          existing_notification.find(".m-title").attr("href", notification.url);
          if (live) {
            if (existing_notification[0] !== category_element.children().first()[0]) {
              return category_element.prepend(existing_notification);
            }
          }
        } else {
          if (live) {
            return category_element.prepend(this.notificationTemplate(notification));
          } else {
            return category_element.append(this.notificationTemplate(notification));
          }
        }
      };

      Dashboard.prototype.buildDashboard = function() {
        return $.post("/dashboard/notifications", {}, (function(_this) {
          return function(response) {
            var i, len, notification, ref;
            ref = response.notifications;
            for (i = 0, len = ref.length; i < len; i++) {
              notification = ref[i];
              _this.addToPanel(notification);
            }
            _this.isPanelEmpty();
            return _this.setPanelDates();
          };
        })(this));
      };

      Dashboard.prototype.notificationHTML = function() {
        return "<li class=\"list-group-item ref-{{reference}}-{{category}}-{{_member_name}}\" id=\"{{id}}\" data-stamp=\"{{stamp}}\" data-count=\"1\">\n  <div class=\"media-left\" style=\"display: none;\"><span class=\"badge\"></span></div>\n  <div class=\"media-body\">\n    <a href=\"{{url}}\" data-notification=\"{{id}}\" class=\"m-title ack_single_href\">{{text}}</a><button class=\"close ack_single\" data-notification=\"{{_id}}\" data-panel=\"{{category}}\">&times;</button>\n    <p class=\"text-muted\"> by <a href=\"/member/{{member_name}}\" class=\"m-name hover_user\">{{member_disp_name}}</a> - <span class=\"m-time\">{{time}}</span></p>\n  </div>\n</li>";
      };

      Dashboard.prototype.panelHTML = function() {
        return "<div class=\"col-sm-6 col-md-6 dashboard-panel\" id=\"{{panel_id}}\"  style=\"margin-bottom: 10px;\">\n    <div class=\"list-group-item section-header\">\n      <span>{{panel_title}}</span>\n      <button class=\"close ack_all\" data-panel=\"{{panel_id}}\">&times;</button>\n    </div>\n    <div class=\"\" id=\"notifs-{{panel_id}}\">\n    </div>\n</div>";
      };

      return Dashboard;

    })();
    return window.woeDashboard = new Dashboard;
  });

}).call(this);
