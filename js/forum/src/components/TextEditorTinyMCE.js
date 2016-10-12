/* global $ */
/* global m */
/* global tinymce */

import TextEditor from 'flarum/components/TextEditor';
import listItems from 'flarum/helpers/listItems';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class TextEditorTinyMCE extends TextEditor {
  init() {
    this.value = m.prop(this.props.value || '');

    this.loading = false;
    if (typeof tinymce === 'undefined') {
      this.loading = true;
      $.ajax({
        url: 'https://cdn.tinymce.com/4/tinymce.min.js',
        dataType: 'script',
        cache: true,
        success: () => {
          this.loading = false;
          m.redraw(true);
        },
      });
    }

    // Unfortunately fixed_toolbar_container does not support
    // calling with an element so we have to add an ID to container.
    this.elID = Math.round(Math.random() * 1000000);
  }

  view() {
    return (
      <div id={`tinymce-${this.elID}`} className="TextEditor TextEditor-TinyMCE">
        {this.loading ? (
          <p
            className="TextEditor-placeholder"
          >
            {LoadingIndicator.component({ size: 'large' })}
          </p>
        ) : (
          <div>
            <div className="toolbar" />
            <div
              className="Composer-flexible-editor"
              config={this.configTextarea.bind(this)}
            />
            <ul className="TextEditor-controls Composer-footer">
              {listItems(this.controlItems().toArray())}
            </ul>
          </div>
        )}
      </div>
    );
  }

  configTextarea(element, isInitialized) {
    if (isInitialized) return;

    tinymce.init({
      target: element,
      init_instance_callback: this.editorInit.bind(this),
      menubar: false,
      elementpath: false,
      resize: false,
      statusbar: false,
      inline: true,
      fixed_toolbar_container: `#tinymce-${this.elID} .toolbar`,
    });
  }

  getEditor() {
    return TextEditorTinyMCE.getEditor(this.editorID);
  }

  static getEditor(id) {
    if (typeof tinymce !== 'undefined') {
      const editor = tinymce.get(id);
      if (editor) {
        return editor;
      }
    }
    return null;
  }

  editorInit(editor) {
    editor.setContent(this.value());
    const id = editor.id;

    this.$().data('tinymceid', id);

    this.editorID = id;

    this.$().trigger('tinymce:loaded', [id]);

    m.redraw(true);

    const onChange = () => {
      this.oninput(editor.getContent());
    };

    editor.on('KeyUp', onChange);
    editor.on('Change', onChange);
  }

  onunload() {
    const editor = this.getEditor();
    if (editor) {
      editor.destroy();
    }
    super.onunload();
  }

  onsubmit() {
    const editor = this.getEditor();
    if (editor) {
      this.oninput(editor.getContent());
    }
    super.onsubmit();
  }
}
