// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var hoverTemplate, notificationHTML, notificationTemplate, p_html, reportModalHTML, socket;
    $.ajaxSetup({
      cache: false
    });
    if (window.my_tz == null) {
      window.my_tz = "US/Pacific";
    }
    $(".href_span").click(function(e) {
      return window.location = $(this).attr("href");
    });
    $(".to-top").click(function(e) {
      e.preventDefault();
      return window.scrollTo(0, 0);
    });
    $(".go-to-profile").click(function(e) {
      if (window.logged_in) {
        return window.location = "/member/" + window.woe_is_me;
      }
    });
    $(".sign-out").click(function(e) {
      e.preventDefault();
      return $.post("/sign-out", function(data) {
        return window.location = "/";
      });
    });
    window.RegisterAttachmentContainer = function(selector) {
      var gifModalHTML, imgModalHTML;
      imgModalHTML = function() {
        return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <h4 class=\"modal-title\">Full Image?</h4>\n    </div>\n    <div class=\"modal-body\">\n      Would you like to view the full image? It is about <span id=\"img-click-modal-size\"></span>KB in size.\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-primary\" id=\"show-full-image\">Yes</button>\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n    </div>\n  </div>\n</div>";
      };
      gifModalHTML = function() {
        return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <h4 class=\"modal-title\">Play GIF?</h4>\n    </div>\n    <div class=\"modal-body\">\n      Would you like to play this gif image? It is about <span id=\"img-click-modal-size\"></span>KB in size.\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-primary\" id=\"show-full-image\">Play</button>\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n    </div>\n  </div>\n</div>";
      };
      $(selector).delegate(".attachment-image", "click", function(e) {
        var element, extension, size, url;
        e.preventDefault();
        element = $(this);
        if (element.data("first_click") === "yes") {
          element.attr("original_src", element.attr("src"));
          element.data("first_click", "no");
        }
        element.attr("src", element.attr("original_src"));
        if (element.data("show_box") === "no") {
          return false;
        }
        url = element.data("url");
        extension = url.split(".")[url.split(".").length - 1];
        size = element.data("size");
        $("#img-click-modal").modal('hide');
        if (extension === "gif" && parseInt(size) > 1024) {
          $("#img-click-modal").html(gifModalHTML());
          $("#img-click-modal").data("biggif", true);
          $("#img-click-modal").data("original_element", element);
          $("#img-click-modal-size").html(element.data("size"));
          return $("#img-click-modal").modal('show');
        } else {
          $("#img-click-modal").html(imgModalHTML());
          $("#img-click-modal").data("full_url", element.data("url"));
          $("#img-click-modal-size").html(element.data("size"));
          $("#img-click-modal").data("original_element", element);
          $("#img-click-modal").modal('show');
          return $("#img-click-modal").data("biggif", false);
        }
      });
      return $("#img-click-modal").delegate("#show-full-image", "click", function(e) {
        var element;
        e.preventDefault();
        if (!$("#img-click-modal").data("biggif")) {
          window.open($("#img-click-modal").data("full_url"), "_blank");
          return $("#img-click-modal").modal('hide');
        } else {
          element = $("#img-click-modal").data("original_element");
          element.attr("src", element.attr("src").replace(".gif", ".animated.gif"));
          return $("#img-click-modal").modal('hide');
        }
      });
    };
    if (window.logged_in) {
      if ($(".io-class").data("path") !== "/") {
        socket = io.connect($(".io-class").data("config"), {
          path: $(".io-class").data("path") + "/socket.io"
        });
      } else {
        socket = io.connect($(".io-class").data("config"));
      }
    }
    notificationHTML = "<li class=\"notification-li\"><a href=\"{{url}}\" data-notification=\"{{_id}}\" class=\"notification-link dropdown-notif-{{_id}}-{{category}}\">{{text}}</a></li>";
    notificationTemplate = Handlebars.compile(notificationHTML);
    if (window.logged_in) {
      socket.emit("user", {
        user: window.woe_is_me
      });
      socket.on("notify", function(data) {
        var counter_element, ref, title_count;
        if (data.count_update != null) {
          counter_element = $(".notification-counter");
          counter_element.text(data.count_update);
          if (data.count_update === 0) {
            title_count = document.title.match(/\(\d+\)/);
            if (title_count) {
              document.title = document.title.replace(title_count[0] + " - ", "");
            }
            return counter_element.css("background-color", "#777");
          } else {
            title_count = document.title.match(/\(\d+\)/);
            if (title_count) {
              document.title = document.title.replace(title_count[0], "(" + data.count_update + ")");
            } else {
              document.title = ("(" + data.count_update + ") - ") + document.title;
            }
            return counter_element.css("background-color", "#B22222");
          }
        } else {
          if (ref = window.woe_is_me, indexOf.call(data.users, ref) >= 0) {
            counter_element = $(".notification-counter");
            counter_element.text(data.count);
            counter_element.css("background-color", "#B22222");
            $(".dashboard-counter").text(data.dashboard_count);
            title_count = document.title.match(/\(\d+\)/);
            if (title_count) {
              document.title = document.title.replace(title_count[0], "(" + data.count + ")");
            } else {
              document.title = ("(" + data.count + ") - ") + document.title;
            }
            if ($($(".notification-dropdown")[0]).find(".notification-li").length > 14) {
              $(".notification-dropdown").each(function() {
                return $(this).find(".notification-li")[$(this).find(".notification-li").length - 1].remove();
              });
            }
            if ($($(".notification-dropdown")[0]).find(".notification-li").length === 0) {
              return $(".notification-dropdown").each(function() {
                return $(this).append(notificationTemplate(data));
              });
            } else {
              return $(".notification-dropdown").each(function() {
                return $(this).find(".notification-li").first().before(notificationTemplate(data));
              });
            }
          }
        }
      });
    }
    $(".post-link").click(function(e) {
      e.preventDefault();
      return $.post($(this).attr("href"), function(data) {
        return window.location = data.url;
      });
    });
    $(".notification-dropdown").delegate(".notification-link", "click", function(e) {
      e.preventDefault();
      return $.post("/dashboard/ack_notification", JSON.stringify({
        notification: $(this).data("notification")
      }), (function(_this) {
        return function(data) {
          return window.location = $(_this).attr("href");
        };
      })(this));
    });
    $(".notification-dropdown-toggle").click(function(e) {
      return $.post("/dashboard/mark_seen", function(d) {});
    });
    window.setupContent = function() {
      return window.addExtraHTML("body");
    };
    window.addExtraHTML = function(selector) {
      var blockquote_attribution_html, blockquote_attribution_template;
      $(selector).find(".content-spoiler").before("<a class=\"btn btn-info btn-xs toggle-spoiler\">Toggle Spoiler</a>");
      $(selector).find(".toggle-spoiler").click(function(e) {
        var spoiler;
        spoiler = $(this).next(".content-spoiler");
        if (spoiler.is(":visible")) {
          return spoiler.hide();
        } else {
          return spoiler.show();
        }
      });
      blockquote_attribution_html = "{{#if author}}<p>{{#if time}}On {{#if link}}<a href=\"{{link}}\" target=\"_blank\">{{time}}{{/if}}{{#if link}}</a>{{/if}}, {{/if}}{{#if authorlink}}<a href=\"{{authorlink}}\" class=\"hover_user\" target=\"_blank\">{{/if}}<strong>{{author}}</strong>{{#if authorlink}}</a>{{/if}} said:</p>{{/if}}";
      blockquote_attribution_template = Handlebars.compile(blockquote_attribution_html);
      return $(selector).find("blockquote").each(function() {
        var element, time;
        element = $(this);
        time = moment.unix(element.data("time")).tz(window.my_tz).format("MMMM Do YYYY @ h:mm:ss a");
        element.find("blockquote").remove();
        element.html(element.html().replace(new RegExp("<p>&nbsp;</p>", "g"), ""));
        element.html(element.html().replace(new RegExp("\\[reply\\]|\\[\\/reply\\]", "g"), ""));
        element.dotdotdot({
          height: 100
        });
        if (time !== "Invalid date") {
          return element.prepend(blockquote_attribution_template({
            link: element.data("link"),
            time: time,
            author: element.data("author"),
            authorlink: element.data("authorlink")
          }));
        } else {
          return element.prepend(blockquote_attribution_template({
            link: element.data("link"),
            time: false,
            author: element.data("author"),
            authorlink: element.data("authorlink")
          }));
        }
      });
    };
    $("#new-status").click(function(e) {
      var target, url;
      e.preventDefault();
      target = $("#new-status").data("target");
      if (target != null) {
        url = "/create-status/" + target;
      } else {
        url = "/create-status";
      }
      return $.post(url, JSON.stringify({
        message: $("#status-new").val()
      }), function(data) {
        if (data.error != null) {
          $("#create-status-error").remove();
          return $("#status-new").parent().prepend("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" id=\"create-status-error\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\n  " + data.error + "\n</div>");
        } else {
          return window.location = data.url;
        }
      });
    });
    p_html = "<div class=\"popover-body\">\n  <div style=\"min-width:80px;\" class=\"media-left\"><a href=\"/member/{{login_name}}\"><img src=\"{{avatar_image}}\" height=\"{{avatar_y}}\" width=\"{{avatar_x}}\" class=\"profile-avatar\"></a>\n  </div>\n  <div class=\"media-body\">\n    <div class=\"row\">\n      <div class=\"col-xs-5\"><b>Group</b>\n      </div>\n      <div class=\"col-xs-7\"><span style=\"color:#F88379;\"><strong>Members<br></strong></span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-5\"><b>Joined</b>\n      </div>\n      <div class=\"col-xs-7\">{{joined}}</div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-5\"><b>Last Seen</b>\n      </div>\n      <div class=\"col-xs-7\">{{last_seen}}</div>\n    </div>\n    {{#if last_seen_at}}\n    <div class=\"row\">\n      <div class=\"col-xs-5\"><b>Last Seen At</b>\n      </div>\n      <div class=\"col-xs-7\"><a href=\"{{last_seen_url}}\">{{last_seen_at}}</a></div>\n    </div>\n    {{/if}}\n  </div>\n  {{#if recent_status_message}}\n  <div class=\"row\">\n    <div class=\"col-xs-12 hover-status\">\n      <div>{{{recent_status_message}}}</div>\n      <a href=\"/status/{{recent_status_message_id}}\">Recent Status</a>\n    </div>\n  </div>\n  {{/if}}\n</div>";
    hoverTemplate = Handlebars.compile(p_html);
    window.hover_cache = {};
    $(document).on("mouseover", ".hover_user", function(e) {
      var element, timeout;
      e.preventDefault();
      element = $(this);
      timeout = setTimeout(function() {
        var _html, checkAndClear, data, placement, user;
        user = element.attr("href").split("/").slice(-1)[0];
        placement = "bottom";
        if (element.data("hplacement") != null) {
          placement = element.data("hplacement");
        }
        if (window.hover_cache[user] != null) {
          data = window.hover_cache[user];
          _html = hoverTemplate(data);
          element.popover({
            html: true,
            container: 'body',
            title: data.name,
            content: _html,
            placement: placement
          });
          element.popover("show");
          checkAndClear = function(n) {
            if (n == null) {
              n = 100;
            }
            return setTimeout(function() {
              if ($(".popover:hover").length !== 0) {
                return checkAndClear();
              } else {
                return element.popover("hide");
              }
            }, n);
          };
          return checkAndClear(2000);
        } else {
          return $.post("/get-user-info-api", JSON.stringify({
            user: user
          }), function(data) {
            window.hover_cache[user] = data;
            _html = hoverTemplate(data);
            element.popover({
              html: true,
              content: _html,
              container: 'body',
              title: data.name,
              placement: placement
            });
            element.popover("show");
            checkAndClear = function(n) {
              if (n == null) {
                n = 100;
              }
              return setTimeout(function() {
                if ($(".popover:hover").length !== 0) {
                  return checkAndClear();
                } else {
                  return element.popover("hide");
                }
              }, n);
            };
            return checkAndClear(2000);
          });
        }
      }, 1000);
      return element.data("timeout", timeout);
    });
    $(document).on("mouseout", ".hover_user", function(e) {
      var element;
      e.preventDefault();
      element = $(this);
      return clearTimeout(element.data("timeout"));
    });
    reportModalHTML = function() {
      return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <h4 class=\"modal-title\">Report Content</h4>\n    </div>\n    <div class=\"modal-body\">\n      Ready to make a report? Supply a reason and click submit.\n      <br><br>\n      <input class=\"form-control report-reason\" style=\"width: 400px; max-width: 100%;\">\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-danger\" id=\"modal-submit-report\">Report</button>\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n    </div>\n  </div>\n</div>";
    };
    $(document).on("click", ".report-button", function(e) {
      var element;
      element = $(this);
      $("#report-click-modal").html(reportModalHTML());
      $("#report-click-modal").data("pk", element.data("pk"));
      $("#report-click-modal").data("type", element.data("type"));
      $("#modal-submit-report").click(function(e) {
        var post_data;
        post_data = {
          pk: $("#report-click-modal").data("pk"),
          content_type: $("#report-click-modal").data("type"),
          reason: $(".report-reason").val()
        };
        return $.post("/make-report", JSON.stringify(post_data), function(data) {
          $("#report-click-modal").modal("hide");
          element.text("Report Submitted");
          element.addClass("btn-success");
          return element.addClass("disabled");
        });
      });
      return $("#report-click-modal").modal("show");
    });
  });

}).call(this);
