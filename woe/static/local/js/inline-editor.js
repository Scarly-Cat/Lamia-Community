// Generated by CoffeeScript 1.9.2
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var InlineEditor;
    InlineEditor = (function() {
      function InlineEditor(element, fullpage_option) {
        var quill;
        if (fullpage_option == null) {
          fullpage_option = false;
        }
        this.toolbarHTML = bind(this.toolbarHTML, this);
        this.editordivHTML = bind(this.editordivHTML, this);
        this.submitButtonHTML = bind(this.submitButtonHTML, this);
        this.quillID = this.getQuillID();
        this.element = $(element);
        if (this.element.data("editor_is_active")) {
          return false;
        }
        this.element.data("editor_is_active", true);
        this.element.data("editor_initial_html", this.element.html());
        this.element.html(this.editordivHTML());
        this.element.before(this.toolbarHTML);
        this.element.after(this.submitButtonHTML(fullpage_option));
        $("#post-editor-" + this.quillID).html(this.element.data("editor_initial_html"));
        quill = new Quill("#post-editor-" + this.quillID, {
          modules: {
            'link-tooltip': true,
            'toolbar': {
              container: "#toolbar-" + this.quillID
            }
          }
        });
        this.element.data("editor", quill);
        $("#save-text-" + this.quillID).click((function(_this) {
          return function(e) {
            e.preventDefault();
            if (_this.saveFunction != null) {
              return _this.saveFunction(_this.element.data("editor").getHTML());
            }
          };
        })(this));
        $("#cancel-edit-" + this.quillID).click((function(_this) {
          return function(e) {
            e.preventDefault();
            if (_this.cancelFunction != null) {
              return _this.cancelFunction(_this.element.data("editor").getHTML());
            }
          };
        })(this));
      }

      InlineEditor.prototype.getQuillID = function() {
        return Quill.editors.length + 1;
      };

      InlineEditor.prototype.resetElementHtml = function() {
        return this.element.html(this.element.data("editor_initial_html"));
      };

      InlineEditor.prototype.onSave = function(saveFunction) {
        return this.saveFunction = saveFunction;
      };

      InlineEditor.prototype.onCancel = function(cancelFunction) {
        return this.cancelFunction = cancelFunction;
      };

      InlineEditor.prototype.onFullPage = function(fullPageFunction) {
        return this.fullPageFunction = fullPageFunction;
      };

      InlineEditor.prototype.destroyEditor = function() {
        this.element.data("editor_is_active", false);
        $("#inline-editor-buttons-" + this.quillID).remove();
        $("#toolbar-" + this.quillID).remove();
        return $("#post-editor-" + this.quillID).remove();
      };

      InlineEditor.prototype.submitButtonHTML = function(fullpage_option) {
        if (fullpage_option == null) {
          fullpage_option = False;
        }
        if (fullpage_option === true) {
          return "<div id=\"inline-editor-buttons-" + this.quillID + "\" class=\"inline-editor-buttons\">\n  <button type=\"button\" class=\"btn btn-default post-post\" id=\"save-text-" + this.quillID + "\">Save</button>\n  <button type=\"button\" class=\"btn btn-default\" id=\"cancel-edit-" + this.quillID + "\">Cancel</button>\n  <button type=\"button\" class=\"btn btn-default\" id=\"fullpage-edit-" + this.quillID + "\">Full Page Editor</button>\n</div>";
        } else {
          return "<div id=\"inline-editor-buttons-" + this.quillID + "\" class=\"inline-editor-buttons\">\n  <button type=\"button\" class=\"btn btn-default\" id=\"save-text-" + this.quillID + "\">Save</button>\n  <button type=\"button\" class=\"btn btn-default\" id=\"cancel-edit-" + this.quillID + "\">Cancel</button>\n</div>";
        }
      };

      InlineEditor.prototype.editordivHTML = function() {
        return "<div id=\"post-editor-" + this.quillID + "\" class=\"editor-box\" data-placeholder=\"\"></div>";
      };

      InlineEditor.prototype.toolbarHTML = function() {
        return "<div class=\"btn-toolbar\" role=\"toolbar\" id=\"toolbar-" + this.quillID + "\">\n  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\" class=\"btn btn-default ql-bold\"><b>b</b></button>\n    <button type=\"button\" class=\"btn btn-default ql-italic\"><i>i</i></button>\n    <button type=\"button\" class=\"btn btn-default ql-underline\"><u>u</u></button>\n    <button type=\"button\" class=\"btn btn-default ql-strike\"><s>s</s></button>\n  </div>\n  <div class=\"btn-group\" role=\"group\">\n    <select title=\"Size\" class=\"ql-size\">\n      <option value=\"10px\">Small</option>\n      <option value=\"13px\" selected=\"\">Normal</option>\n      <option value=\"18px\">Large</option>\n      <option value=\"32px\">Huge</option>\n    </select>\n    <button type=\"button\" class=\"btn btn-default ql-link\"><span class=\"glyphicon glyphicon-link\"</span></button>\n  </div>\n</div>";
      };

      return InlineEditor;

    })();
    return window.InlineEditor = InlineEditor;
  });

}).call(this);
