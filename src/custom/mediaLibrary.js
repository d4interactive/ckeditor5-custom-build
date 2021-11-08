import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MediaIcon from '@ckeditor/ckeditor5-media-embed/theme/icons/media.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class MediaLibrary extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('mediaLibrary', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Add Media',
        icon: MediaIcon,
        tooltip: true
      });


      const options = this.editor.config.get('mediaLibrary');

      // Callback executed once the image is clicked.
      view.on('execute', () => {


        if (options.callback) {
          options.callback()
        }


      });

      return view;
    });
  }
}

export default MediaLibrary;
