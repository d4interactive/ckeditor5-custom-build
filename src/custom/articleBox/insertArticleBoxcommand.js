import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertArticleBoxCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            // Insert <articleBox>*</articleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent(createArticleBox(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'articleBox');

        this.isEnabled = allowedIn !== null;
    }
}

function createArticleBox(writer) {
    const articleBox = writer.createElement('articleBox');
    const articleBoxTitle = writer.createElement('articleBoxTitle');
    const articleBoxDescription = writer.createElement('articleBoxDescription');

    writer.append(articleBoxTitle, articleBox);
    writer.append(articleBoxDescription, articleBox);

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement('paragraph', articleBoxDescription);

    return articleBox;
}
