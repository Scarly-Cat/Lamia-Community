$ ->
  class InlineEditor
    constructor: (element, saveFunction) ->
      @element = $(element)
      if @element.data("editor_is_active")
        return false
      @element.before @toolbarHTML
      @element.after @submitButtonHTML
      @element.data("editor_is_active", true)
      @element.data("editor_initial_html", @element.html())
      @element.html(@editordivHTML())
      
      $("#post-editor").html(@element.data("editor_initial_html"))
      quill = new Quill '#post-editor', 
        modules:
          'toolbar': { container: '#toolbar' }
          'link-tooltip': true
        theme: 'snow'
        
      @element.data("editor", quill)
      
      $("#save-text").click (e) =>
        e.preventDefault()
        do @destroyEditor
        saveFunction @element.data("editor").getHTML()
        
      $("#cancel-edit").click (e) =>
        e.preventDefault()
        do @destroyEditor
        @element.html(@element.data("editor_initial_html"))
    
    destroyEditor: () ->
      @element.data("editor_is_active", false)
      do $("#inline-editor-buttons").remove
      do $("#toolbar").remove
      do $('#post-editor').remove
    
    submitButtonHTML: (fullpage_option=False) ->
      if fullpage_option == true
        return """
          <div id="inline-editor-buttons">
            <button type="button" class="btn btn-default post-post" id="save-text">Save</button>
            <button type="button" class="btn btn-default post-fullpage">Full Page Editor</button>
          </div>
        """
      else
        return """
          <div id="inline-editor-buttons">
            <button type="button" class="btn btn-default" id="save-text">Save</button>
            <button type="button" class="btn btn-default" id="cancel-edit">Cancel</button>
          </div>
        """
    
    editordivHTML: () ->
      return """
        <div id="post-editor" data-placeholder=""></div>
      """
    
    toolbarHTML: () ->
      return """
        <div class="btn-toolbar" role="toolbar" id="toolbar">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default ql-bold"><b>b</b></button>
            <button type="button" class="btn btn-default ql-italic"><i>i</i></button>
            <button type="button" class="btn btn-default ql-underline"><u>u</u></button>
            <button type="button" class="btn btn-default ql-strike"><s>s</s></button>
          </div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default ql-link">url</button>
          </div>
        </div>
      """
      
  window.InlineEditor = InlineEditor