import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class ArticleBoxUI extends Plugin {
    init() {
        console.log('ArticleBoxUI#init() got called');

        const editor = this.editor;
        const t = editor.t;

        // The "articleBox" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('articleBox', locale => {
            // The state of the button will be bound to the widget command.
            const command = editor.commands.get('insertArticleBox');

            // The button will be an instance of ButtonView.
            const buttonView = new ButtonView(locale);

            buttonView.set({
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t('Simple Box'),
                withText: true,
                tooltip: true
            });

            // Bind the state of the button to the command.
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            // Execute the command when the button is clicked (executed).
            this.listenTo(buttonView, 'execute', () => editor.execute('insertArticleBox'));

            return buttonView;
        });
    }
}