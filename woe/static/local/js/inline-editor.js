// Generated by CoffeeScript 1.9.2
(function() {
  $(function() {
    var InlineEditor;
    InlineEditor = (function() {
      function InlineEditor(element) {
        if (window.editor_is_active) {
          return false;
        }
        this.element = $(element);
        this.element.before(this.toolbarHTML);
        this.element.after(this.submitButtonHTML);
        window.editor_is_active = true;
        window.editor_initial_html = this.element.html();
        this.element.html(this.editordivHTML());
        $("#post-editor").html(window.editor_initial_html);
        window.editor = new wysihtml5.Editor('post-editor', {
          toolbar: 'toolbar',
          parserRules: wysihtml5ParserRules
        });
      }

      InlineEditor.prototype.submitButtonHTML = function(fullpage_option) {
        if (fullpage_option == null) {
          fullpage_option = False;
        }
        if (fullpage_option === true) {
          return "<div class=\"post-new-buttons\">\n  <button type=\"button\" class=\"btn btn-default post-post\">Save</button>\n  <button type=\"button\" class=\"btn btn-default post-fullpage\">Full Page Editor</button>\n</div>";
        } else {
          return "<div class=\"post-new-buttons\">\n  <button type=\"button\" class=\"btn btn-default post-post\">Save</button>\n</div>";
        }
      };

      InlineEditor.prototype.editordivHTML = function() {
        return "<div id=\"post-editor\" data-placeholder=\"\"></div>";
      };

      InlineEditor.prototype.toolbarHTML = function() {
        return "<div class=\"btn-toolbar center-block\" role=\"toolbar\" id=\"toolbar\">\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"bold\">\n      <span class=\"glyphicon glyphicon-bold\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"italic\">\n      <span class=\"glyphicon glyphicon-italic\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"underline\">\n      <span class=\"glyphicon glyphicon-text-width\" aria-hidden=\"true\"></span></button>\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"insertUnorderedList\">\n      <span class=\"glyphicon glyphicon-list-alt\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"insertOrderedList\">\n      <span class=\"glyphicon glyphicon-th-list\" aria-hidden=\"true\"></span></button>\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"justifyLeft\">\n      <span class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"justifyCenter\">\n      <span class=\"glyphicon glyphicon-align-center\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"justifyRight\">\n      <span class=\"glyphicon glyphicon-align-right\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"justifyFull\">\n      <span class=\"glyphicon glyphicon-align-justify\" aria-hidden=\"true\"></span></button>\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"formatBlock\" data-wysihtml5-command-value=\"blockquote\">\n      <span class=\"glyphicon glyphicon-comment\" aria-hidden=\"true\"></span></button>\n    <!-- <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"\">\n      <span class=\"glyphicon glyphicon-tint\" aria-hidden=\"true\"></span></button> -->\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"\">\n      <span class=\"glyphicon glyphicon-picture\" aria-hidden=\"true\"></span></button>\n    <button type=\"button\" class=\"btn btn-default\" data-wysihtml5-command=\"\">\n      <span class=\"glyphicon glyphicon-link\" aria-hidden=\"true\"></span></button>\n  </div>\n</div>";
      };

      return InlineEditor;

    })();
    return window.InlineEditor = InlineEditor;
  });

}).call(this);
