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

System.register('sijad/editor/components/TextEditorTinyMCE', ['flarum/components/TextEditor', 'flarum/helpers/listItems', 'flarum/components/LoadingIndicator'], function (_export, _context) {
  "use strict";

  var TextEditor, listItems, LoadingIndicator, TextEditorTinyMCE;
  return {
    setters: [function (_flarumComponentsTextEditor) {
      TextEditor = _flarumComponentsTextEditor.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }],
    execute: function () {
      TextEditorTinyMCE = function (_TextEditor) {
        babelHelpers.inherits(TextEditorTinyMCE, _TextEditor);

        function TextEditorTinyMCE() {
          babelHelpers.classCallCheck(this, TextEditorTinyMCE);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TextEditorTinyMCE).apply(this, arguments));
        }

        babelHelpers.createClass(TextEditorTinyMCE, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            this.value = m.prop(this.props.value || '');

            this.loading = false;
            if (typeof tinymce === 'undefined') {
              this.loading = true;
              $.ajax({
                url: 'https://cdn.tinymce.com/4/tinymce.min.js',
                dataType: 'script',
                cache: true,
                success: function success() {
                  _this2.loading = false;
                  m.redraw(true);
                }
              });
            }

            // Unfortunately fixed_toolbar_container does not support
            // calling with an element so we have to add an ID to container.
            this.elID = Math.round(Math.random() * 1000000);
          }
        }, {
          key: 'view',
          value: function view() {
            return m(
              'div',
              { id: 'tinymce-' + this.elID, className: 'TextEditor TextEditor-TinyMCE' },
              this.loading ? m(
                'p',
                {
                  className: 'TextEditor-placeholder'
                },
                LoadingIndicator.component({ size: 'large' })
              ) : m(
                'div',
                null,
                m('div', { className: 'toolbar' }),
                m('div', {
                  className: 'Composer-flexible-editor',
                  config: this.configTextarea.bind(this)
                }),
                m(
                  'ul',
                  { className: 'TextEditor-controls Composer-footer' },
                  listItems(this.controlItems().toArray())
                )
              )
            );
          }
        }, {
          key: 'configTextarea',
          value: function configTextarea(element, isInitialized) {
            if (isInitialized) return;

            tinymce.init({
              target: element,
              init_instance_callback: this.editorInit.bind(this),
              menubar: false,
              elementpath: false,
              resize: false,
              statusbar: false,
              inline: true,
              fixed_toolbar_container: '#tinymce-' + this.elID + ' .toolbar'
            });
          }
        }, {
          key: 'getEditor',
          value: function getEditor() {
            return TextEditorTinyMCE.getEditor(this.editorID);
          }
        }, {
          key: 'editorInit',
          value: function editorInit(editor) {
            var _this3 = this;

            editor.setContent(this.value());
            var id = editor.id;

            this.$().data('tinymceid', id);

            this.editorID = id;

            this.$().trigger('tinymce:loaded', [id]);

            m.redraw(true);

            var onChange = function onChange() {
              _this3.oninput(editor.getContent());
            };

            editor.on('KeyUp', onChange);
            editor.on('Change', onChange);
          }
        }, {
          key: 'onunload',
          value: function onunload() {
            var editor = this.getEditor();
            if (editor) {
              editor.destroy();
            }
            babelHelpers.get(Object.getPrototypeOf(TextEditorTinyMCE.prototype), 'onunload', this).call(this);
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit() {
            var editor = this.getEditor();
            if (editor) {
              this.oninput(editor.getContent());
            }
            babelHelpers.get(Object.getPrototypeOf(TextEditorTinyMCE.prototype), 'onsubmit', this).call(this);
          }
        }], [{
          key: 'getEditor',
          value: function getEditor(id) {
            if (typeof tinymce !== 'undefined') {
              var editor = tinymce.get(id);
              if (editor) {
                return editor;
              }
            }
            return null;
          }
        }]);
        return TextEditorTinyMCE;
      }(TextEditor);

      _export('default', TextEditorTinyMCE);
    }
  };
});;
'use strict';

System.register('sijad/editor/main', ['flarum/extend', 'flarum/app', 'flarum/components/ComposerBody', 'flarum/components/Composer', 'sijad/editor/components/TextEditorTinyMCE'], function (_export, _context) {
  "use strict";

  var extend, app, ComposerBody, Composer, TextEditorTinyMCE;
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
    }, function (_sijadEditorComponentsTextEditorTinyMCE) {
      TextEditorTinyMCE = _sijadEditorComponentsTextEditorTinyMCE.default;
    }],
    execute: function () {

      app.initializers.add('sijad-editor', function () {
        extend(ComposerBody.prototype, 'init', function init() {
          this.editor = new TextEditorTinyMCE({
            submitLabel: this.props.submitLabel,
            placeholder: this.props.placeholder,
            onchange: this.content,
            onsubmit: this.onsubmit.bind(this),
            value: this.content()
          });
        });

        extend(Composer.prototype, 'updateHeight', function updateHeight() {
          var $editor = this.$('.TextEditor');
          if (!$editor.length) return;

          var editor = TextEditorTinyMCE.getEditor($editor.data('tinymceid'));

          var resize = function resize() {
            // editor();
            console.log('do resize here');
          };

          if (!editor) {
            if (!this.tinymceLoaded) {
              this.tinymceLoaded = true;
              $editor.on('tinymce:loaded', function (_, id) {
                editor = TextEditorTinyMCE.getEditor(id);
              });
            }
          } else {
            resize();
          }

          // editorID

          // const clear = () => {
          //   clearInterval(this.interval);
          // };

          // const updateCKEHeight = () => {
          //   const name = this.$('.Composer-flexible-editor').data('ckeditor');
          //   if (name) {
          //     clear();
          //     const editor = CKEDITOR.instances[name];
          //     if (editor) {
          //       const update = () => {
          //         const headerHeight = $(editor.container.$).offset().top - this.$().offset().top;
          //         const footerHeight = this.$('.Composer-footer').outerHeight(true);
          //         const height = this.$().outerHeight() - headerHeight - footerHeight;
          //         editor.resize('100%', height);
          //       };

          //       if (editor.status === 'ready') {
          //         update();
          //       } else {
          //         editor.on('instanceReady', update);
          //       }
          //       return true;
          //     }
          //   }
          //   return false;
          // };

          // if (updateCKEHeight() !== true) {
          //   let count = 0;
          //   clear();
          //   this.interval = setInterval(() => {
          //     updateCKEHeight();
          //     count += 1;
          //     if (count > 25) {
          //       clear();
          //     }
          //   }, 500);
          // }
        });
      });
    }
  };
});