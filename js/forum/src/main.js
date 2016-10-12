/* global CKEDITOR */
/* global $ */

import { extend } from 'flarum/extend';
import app from 'flarum/app';
import ComposerBody from 'flarum/components/ComposerBody';
import Composer from 'flarum/components/Composer';
import TextEditorTinyMCE from 'sijad/editor/components/TextEditorTinyMCE';

app.initializers.add('sijad-editor', () => {
  extend(ComposerBody.prototype, 'init', function init() {
    this.editor = new TextEditorTinyMCE({
      submitLabel: this.props.submitLabel,
      placeholder: this.props.placeholder,
      onchange: this.content,
      onsubmit: this.onsubmit.bind(this),
      value: this.content(),
    });
  });

  extend(Composer.prototype, 'updateHeight', function updateHeight() {
    const $editor = this.$('.TextEditor');
    if (!$editor.length) return;

    let editor = TextEditorTinyMCE.getEditor($editor.data('tinymceid'));

    const resize = () => {
      // editor();
      console.log('do resize here');
    };

    if (!editor) {
      if (!this.tinymceLoaded) {
        this.tinymceLoaded = true;
        $editor.on('tinymce:loaded', (_, id) => {
          editor = TextEditorTinyMCE.getEditor(id);
        });
      }
    } else {
      resize();
    }
  });
});
