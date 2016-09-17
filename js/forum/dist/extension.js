'use strict';

System.register('sijad/editor/components/TextEditorCKEditor', ['flarum/components/TextEditor', 'flarum/helpers/listItems', 'flarum/components/LoadingIndicator'], function (_export, _context) {
  "use strict";

  var TextEditor, listItems, LoadingIndicator, TextEditorCKEditor;
  return {
    setters: [function (_flarumComponentsTextEditor) {
      TextEditor = _flarumComponentsTextEditor.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }],
    execute: function () {
      TextEditorCKEditor = function (_TextEditor) {
        babelHelpers.inherits(TextEditorCKEditor, _TextEditor);

        function TextEditorCKEditor() {
          babelHelpers.classCallCheck(this, TextEditorCKEditor);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TextEditorCKEditor).apply(this, arguments));
        }

        babelHelpers.createClass(TextEditorCKEditor, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            this.value = m.prop(this.props.value || '');

            this.loading = false;
            if (typeof CKEDITOR === 'undefined') {
              this.loading = true;
              $.ajax({
                url: 'https://cdn.ckeditor.com/4.5.11/full/ckeditor.js',
                dataType: 'script',
                cache: true,
                success: function success() {
                  _this2.loading = false;
                  m.redraw(true);
                }
              });
            }
          }
        }, {
          key: 'view',
          value: function view() {
            if (this.loading) {
              return m(
                'p',
                {
                  className: 'TextEditor TextEditor-placeholder'
                },
                LoadingIndicator.component({ size: 'large' })
              );
            }

            return m(
              'div',
              { className: 'TextEditor' },
              m('textarea', {
                className: 'FormControl Composer-flexible-editor',
                config: this.configTextarea.bind(this)
                // disabled={!!this.props.disabled}
                , value: this.value()
              }),
              m(
                'ul',
                { className: 'TextEditor-controls Composer-footer' },
                listItems(this.controlItems().toArray())
              )
            );
          }
        }, {
          key: 'configTextarea',
          value: function configTextarea(element, isInitialized) {
            var _this3 = this;

            if (isInitialized) return;

            var editor = CKEDITOR.replace(element, this.editorConfig());

            editor.on('change', function () {
              _this3.oninput(editor.getData());
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
        }, {
          key: 'editorConfig',
          value: function editorConfig() {
            return {
              toolbar: [{
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat']
              }, { name: 'links', items: ['Link', 'Unlink'] }, {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight']
              }, { name: 'colors', items: ['TextColor'] }, { name: 'styles', items: ['Format'] }, { name: 'tools', items: ['Maximize'] }],
              removePlugins: 'elementspath',
              resize_enabled: false,
              height: 120,
              coreStyles_strike: {
                element: 'strike', overrides: 's'
              },
              format_tags: 'p;h1;h2;h3;h4;h5;h6;pre'
            };
          }
        }]);
        return TextEditorCKEditor;
      }(TextEditor);

      _export('default', TextEditorCKEditor);
    }
  };
});;
'use strict';

System.register('sijad/editor/main', ['flarum/extend', 'flarum/app', 'flarum/components/ComposerBody', 'flarum/components/Composer', 'sijad/editor/components/TextEditorCKEditor'], function (_export, _context) {
  "use strict";

  var extend, app, ComposerBody, Composer, TextEditorCKEditor;
  return {
    setters: [function (_flarumExtend) {
      /* global CKEDITOR */
      /* global $ */

      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsComposerBody) {
      ComposerBody = _flarumComponentsComposerBody.default;
    }, function (_flarumComponentsComposer) {
      Composer = _flarumComponentsComposer.default;
    }, function (_sijadEditorComponentsTextEditorCKEditor) {
      TextEditorCKEditor = _sijadEditorComponentsTextEditorCKEditor.default;
    }],
    execute: function () {

      app.initializers.add('sijad-editor', function () {
        extend(ComposerBody.prototype, 'init', function init() {
          this.editor = new TextEditorCKEditor({
            submitLabel: this.props.submitLabel,
            placeholder: this.props.placeholder,
            onchange: this.content,
            onsubmit: this.onsubmit.bind(this),
            value: this.content()
          });
        });

        extend(Composer.prototype, 'updateHeight', function updateHeight() {
          var _this = this;

          if (!this.$('.TextEditor').length) return;

          var clear = function clear() {
            clearInterval(_this.interval);
          };

          var updateCKEHeight = function updateCKEHeight() {
            var name = _this.$('.Composer-flexible-editor').data('ckeditor');
            if (name) {
              var _ret = function () {
                clear();
                var editor = CKEDITOR.instances[name];
                if (editor) {
                  var update = function update() {
                    var headerHeight = $(editor.container.$).offset().top - _this.$().offset().top;
                    var footerHeight = _this.$('.Composer-footer').outerHeight(true);
                    var height = _this.$().outerHeight() - headerHeight - footerHeight;
                    editor.resize('100%', height);
                  };

                  if (editor.status === 'ready') {
                    update();
                  } else {
                    editor.on('instanceReady', update);
                  }
                  return {
                    v: true
                  };
                }
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
            }
            return false;
          };

          if (updateCKEHeight() !== true) {
            (function () {
              var count = 0;
              clear();
              _this.interval = setInterval(function () {
                updateCKEHeight();
                count += 1;
                if (count > 25) {
                  clear();
                }
              }, 500);
            })();
          }
        });
      });
    }
  };
});