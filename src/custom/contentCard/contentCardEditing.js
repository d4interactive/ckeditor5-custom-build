import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import InsertContentCardCommand from './contentCardCommand';

export default class contentCardEditing extends Plugin {

    static get requires() {
        return [Widget];
    }


    init() {
        console.log('contentCardEditing#init() got called');

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('InsertContentCard', new InsertContentCardCommand(this.editor));

        this._defineClipboardInputOutput();

        // View-to-model position mapping is needed because an content-card element in the model is represented by a single element,
        // but in the view it is a more complex structure.
        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('content-card'))
        );
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


        schema.register('contentCard', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        });

        schema.register('contentCardTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'contentCard',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block',

            // Allow attributes 
            allowAttributes: ['text', 'type'],
        });

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

        // <contentCard> converters
        conversion.for('upcast').elementToElement({
            model: 'contentCard',
            view: {
                name: 'section',
                classes: 'content-card'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'contentCard',
            view: {
                name: 'section',
                classes: 'content-card'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'contentCard',
            view: (modelElement, { writer: viewWriter }) => {
                const section = viewWriter.createContainerElement('section', { class: 'content-card' });

                return toWidget(section, viewWriter, { hasSelectionHandle: true });
            }
        });

        // <contentCardTitle> converters
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer }) => {

                return writer.createElement('contentCardTitle', () => {
                    return {
                        text: getText(viewElement)
                    };
                });
            },
            view: {
                name: 'h3',
                classes: 'content-card-title'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'contentCardTitle',
            view: {
                name: 'h3',
                classes: 'content-card-title'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'contentCardTitle',
            view: (modelElement, { writer: viewWriter }) => {
                const h3 = viewWriter.createEditableElement('h3', { class: 'content-card-title' });
                return toWidgetEditable(h3, viewWriter);
            }
        });

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

            // this.editor.execute('InsertContentCard', val)

            //Translate the data to a view fragment.
            const writer = new UpcastWriter(viewDocument);
            const fragment = writer.createDocumentFragment();

            writer.appendChild(
                writer.createElement('section', { class: 'content-card' }, [
                    writer.createElement('h3', { class: 'content-card-title' }, val),
                    writer.createElement('p', { class: 'content-card-paragraph' }, val)
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

        function createContentCard(writer) {
            const contentCard = writer.createElement('contentCard');
            const contentCardTitle = writer.createElement('contentCardTitle');


            writer.append(contentCardTitle, contentCard);

            return contentCard;
        }
    }
}

function getText(viewElement) {
    return Array.from(viewElement.getChildren())
        .map(node => node.is('$text') ? node.data : '')
        .join('');
}