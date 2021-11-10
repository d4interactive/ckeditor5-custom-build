import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionRange } from '@ckeditor/ckeditor5-widget'
export default class ContentCardBoxCommand extends Command {
    execute(data) {
        const model = this.editor.model;
        const selection = model.document.selection;
        const insertionRange = findOptimalInsertionRange(selection, model);

        console.log('execute', data)

        model.change(writer => {
            // Insert <contentCard>*</contentCard> at the current selection position
            // in a way that will result in creating a valid model structure.
            // writer.setAttribute('text', data);
            this.editor.model.insertContent(createContentCard(writer, data), insertionRange);

        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'contentCard');

        this.isEnabled = allowedIn !== null;
    }
}

function createContentCard(writer, data) {
    console.debug("createContentCard")
    const contentCard = writer.createElement('contentCard');
    const contentCardTitle = writer.createElement('contentCardTitle', { text: data });
    // contentCardTitle.setAttribute('text', data);
    writer.append(contentCardTitle, contentCard);


    return contentCard;
}