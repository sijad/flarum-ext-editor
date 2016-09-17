/* global $ */
/* global m */
/* global CKEDITOR */

import TextEditor from 'flarum/components/TextEditor';
import listItems from 'flarum/helpers/listItems';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class TextEditorCKEditor extends TextEditor {
  init() {
    this.value = m.prop(this.props.value || '');

    this.loading = false;
    if (typeof CKEDITOR === 'undefined') {
      this.loading = true;
      $.ajax({
        url: 'https://cdn.ckeditor.com/4.5.11/full/ckeditor.js',
        dataType: 'script',
        cache: true,
        success: () => {
          this.loading = false;
          m.redraw(true);
        },
      });
    }
  }
  view() {
    if (this.loading) {
      return (
        <p
          className="TextEditor TextEditor-placeholder"
        >
          {LoadingIndicator.component({ size: 'large' })}
        </p>
      );
    }

    return (
      <div className="TextEditor">
        <textarea
          className="FormControl Composer-flexible-editor"
          config={this.configTextarea.bind(this)}
          // disabled={!!this.props.disabled}
          value={this.value()}
        />

        <ul className="TextEditor-controls Composer-footer">
          {listItems(this.controlItems().toArray())}
        </ul>
      </div>
    );
  }

  configTextarea(element, isInitialized) {
    if (isInitialized) return;

    const editor = CKEDITOR.replace(element, this.editorConfig());

    editor.on('change', () => {
      this.oninput(editor.getData());
    });

    $(element).data('ckeditor', editor.name);

    this.editor = editor;

    // const handler = () => {
    //   this.onsubmit();
    //   m.redraw();
    // };

    // $(element).bind('keydown', 'meta+return', handler);
    // $(element).bind('keydown', 'ctrl+return', handler);
  }

  editorConfig() {
    return {
      toolbar: [
        {
          name: 'basicstyles',
          items: [
            'Bold',
            'Italic',
            'Underline',
            'Strike',
            '-',
            'RemoveFormat',
          ],
        },
        { name: 'links', items: ['Link', 'Unlink'] },
        {
          name: 'paragraph',
          items: ['NumberedList',
            'BulletedList',
            '-',
            'Blockquote',
            '-',
            'JustifyLeft',
            'JustifyCenter',
            'JustifyRight',
          ],
        },
        { name: 'colors', items: ['TextColor'] },
        { name: 'styles', items: ['Format'] },
        { name: 'tools', items: ['Maximize'] },
      ],
      removePlugins: 'elementspath',
      resize_enabled: false,
      height: 120,
      coreStyles_strike: {
        element: 'strike', overrides: 's',
      },
      format_tags: 'p;h1;h2;h3;h4;h5;h6;pre',
    };
  }
}
