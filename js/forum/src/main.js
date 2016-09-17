/* global CKEDITOR */
/* global $ */

import { extend } from 'flarum/extend';
import app from 'flarum/app';
import ComposerBody from 'flarum/components/ComposerBody';
import Composer from 'flarum/components/Composer';
import TextEditorCKEditor from 'sijad/editor/components/TextEditorCKEditor';

app.initializers.add('sijad-editor', () => {
  extend(ComposerBody.prototype, 'init', function init() {
    this.editor = new TextEditorCKEditor({
      submitLabel: this.props.submitLabel,
      placeholder: this.props.placeholder,
      onchange: this.content,
      onsubmit: this.onsubmit.bind(this),
      value: this.content(),
    });
  });

  extend(Composer.prototype, 'updateHeight', function updateHeight() {
    if (!this.$('.TextEditor').length) return;

    const clear = () => {
      clearInterval(this.interval);
    };

    const updateCKEHeight = () => {
      const name = this.$('.Composer-flexible-editor').data('ckeditor');
      if (name) {
        clear();
        const editor = CKEDITOR.instances[name];
        if (editor) {
          const update = () => {
            const headerHeight = $(editor.container.$).offset().top - this.$().offset().top;
            const footerHeight = this.$('.Composer-footer').outerHeight(true);
            const height = this.$().outerHeight() - headerHeight - footerHeight;
            editor.resize('100%', height);
          };

          if (editor.status === 'ready') {
            update();
          } else {
            editor.on('instanceReady', update);
          }
          return true;
        }
      }
      return false;
    };

    if (updateCKEHeight() !== true) {
      let count = 0;
      clear();
      this.interval = setInterval(() => {
        updateCKEHeight();
        count += 1;
        if (count > 25) {
          clear();
        }
      }, 500);
    }
  });
});
