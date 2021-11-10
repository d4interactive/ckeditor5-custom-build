import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';

import InsertDragBoxCommand from './dragWidgetCommand';

export default class DragWidgetEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this._defineClipboardInputOutput();

        this.editor.commands.add('insertDragBox', new InsertDragBoxCommand(this.editor))
    }

    /**
     * The model’s schema defines several aspects of how the model should look
     * 
     * Where a node is allowed or disallowed (e.g. paragraph is allowed in $root, but not in heading1).
     * What attributes are allowed for a certain node (e.g. image can have the src and alt attributes).
     * Additional semantics of model nodes (e.g. image is of the “object” type and paragraph of the “block” type).
     * 
     * Read more: https://ckeditor.com/docs/ckeditor5/latest/framework/guides/architecture/editing-engine.html#schema
     */
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('dragedBox', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,
            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',
            isLimit: true,
            allowAttributes: ['text', 'type'],
        });


        schema.register('dragedBoxTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'dragedBox',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        });


        // View-to-model position mapping is needed because an draged-box element in the model is represented by a single element,
        // but in the view it is a more complex structure.
        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('draged-box'))
        );
    }

    /**
     * Model and the view as about two completely independent subsystems. Used converters to connect them.
     * 
     * The three main situations in which these two layers meet are:
     * Data upcasting - Loading the data to the editor.
     * Data downcasting - Retrieving the data from the editor.
     * Editing downcasting - Rendering the editor content to the user for editing.
     */
    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: {
                name: 'section',
                classes: 'draged-box'
            },
            model: (viewElement, { writer }) => {
                console.log(getCardDataFromViewElement(viewElement))
                return writer.createElement('dragedBox', getCardDataFromViewElement(viewElement));
            },

        });

        conversion.for('dataDowncast').elementToElement({
            model: 'dragedBox',
            view: (modelItem, { writer: viewWriter }) => createWidget(modelItem, viewWriter)
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'dragedBox',
            view: (modelItem, { writer: viewWriter }) => toWidget(createWidget(modelItem, viewWriter), viewWriter, { label: 'draged box widget', hasSelectionHandle: true })
        });

        // Title
        conversion.for('upcast').elementToElement({
            model: 'dragedBoxTitle',
            view: {
                name: 'h1',
                classes: 'draged-box-title'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'dragedBoxTitle',
            view: {
                name: 'h1',
                classes: 'draged-box-title'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'dragedBoxTitle',
            view: (modelElement, { writer: viewWriter }) => {

                const text = modelItem.getAttribute('text');
                console.log('text', modelItem)

                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement('h1', { class: 'draged-box-title' });

                viewWriter.insert(viewWriter.createPositionAt(h1, 0), viewWriter.createText(text));

                return toWidgetEditable(h1, viewWriter);
            }
        });

        // Helper method for both downcast converters.
        function createWidget(modelItem, viewWriter) {


            const text = modelItem.getAttribute('text');
            console.log('text', modelItem)

            const cardView = viewWriter.createContainerElement('section', { class: 'draged-box' });
            // const linkView = viewWriter.createContainerElement( 'a', { href: `#`, class: 'p-name u-email' } );
            // const textView = viewWriter.createContainerElement('p', { class: 'draged-box-text', style: '' });

            // viewWriter.insert( viewWriter.createPositionAt( linkView, 0 ), viewWriter.createText( '' ) );
            // viewWriter.insert(viewWriter.createPositionAt(textView, 0), viewWriter.createText(text));

            // viewWriter.insert( viewWriter.createPositionAt( cardView, 0 ), linkView );
            // viewWriter.insert(viewWriter.createPositionAt(cardView, 'end'), textView);

            return cardView;
        }
    }

    _defineClipboardInputOutput() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;

        // Processing pasted or dropped content.
        this.listenTo(viewDocument, 'clipboardInput', (evt, data) => {
            // The clipboard content was already processed by the listener on the higher priority
            // (for example while pasting into the code block).


            const dataTransfer = data.dataTransfer.getData('myData');

            if (!dataTransfer) {
                return;
            }

            // Use JSON data encoded in the DataTransfer.
            const { val } = JSON.parse(dataTransfer);

            console.debug('clipboardInput', val)


            // Translate the data to a view fragment.
            const writer = new UpcastWriter(viewDocument);
            const fragment = writer.createDocumentFragment();

            writer.appendChild(
                writer.createElement('section', { class: 'draged-box' }, [
                    writer.createElement('h1', { class: 'draged-box-title', style: '' }, val)
                ]),
                fragment
            );

            // Provide the content to the clipboard pipeline for further processing.
            data.content = fragment;

        });

        // Processing copied, pasted or dragged content.
        this.listenTo(document, 'clipboardOutput', (evt, data) => {
            console.debug('clipboardOutput')
        });

    }

}

function getCardDataFromViewElement(viewElement) {
    const children = Array.from(viewElement.getChildren());
    const textElement = children.find(element => element.is('element', 'p') && element.hasClass('draged-box-text'));

    return {
        text: getText(textElement)
    };
}

function getText(viewElement) {
    return Array.from(viewElement.getChildren())
        .map(node => node.is('$text') ? node.data : '')
        .join('');
}