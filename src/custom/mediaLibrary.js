import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';
import MediaIcon from './icons/icons8-folder.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { findOptimalInsertionRange } from '@ckeditor/ckeditor5-widget/src'


class MediaLibrary extends Plugin {
  init() {
    const editor = this.editor;

    // Create bold command.
    editor.commands.add( 'callbackCommand', new CallbackCommand(editor) );

    editor.ui.componentFactory.add('mediaLibrary', locale => {
      const view = new ButtonView(locale);
      const command = editor.commands.get( 'callbackCommand' );

      view.set({
        label: 'Media Library',
        icon: MediaIcon,
        tooltip: true
      });

      const options = editor.config.get('mediaLibrary');

      view.bind( 'isEnabled' ).to( command);

      // Callback executed once the image is clicked.
      view.on('execute', () => {

        // if (options.callback) {
        //   options.callback()
        // }

        editor.execute( 'callbackCommand', options );
        editor.editing.view.focus();

      });

      return view;
    });
  }
}


class CallbackCommand extends Command {


  /**
   * @inheritDoc
   */
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedMedia = getSelectedMediaModelWidget( selection );

    this.isEnabled = isMediaSelected( selection ) || isAllowedInParent( selection, model );

  }

  /**
   * Executes the command.
   *
   * @fires execute
   */
  execute(options) {
    if (options.callback) {
      options.callback()
    }
  }
}

function isAllowedInParent( selection, model ) {
  const insertionRange = findOptimalInsertionRange( selection, model );
  let parent = insertionRange.start.parent;

  // The model.insertContent() will remove empty parent (unless it is a $root or a limit).
  if ( parent.isEmpty && !model.schema.isLimit( parent ) ) {
    parent = parent.parent;
  }

  return model.schema.checkChild( parent, 'media' );
}

function getSelectedMediaModelWidget( selection ) {
  const selectedElement = selection.getSelectedElement();

  if ( selectedElement && selectedElement.is( 'element', 'media' ) ) {
    return selectedElement;
  }

  return null;
}

function isMediaSelected( selection ) {
  const element = selection.getSelectedElement();
  return !!element && element.name === 'media';
}

export default MediaLibrary;
