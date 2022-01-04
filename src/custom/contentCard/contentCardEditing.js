import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import Element from '@ckeditor/ckeditor5-engine/src/model/element';
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
        });

        schema.register('contentCardImage', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'contentCard',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$root',

        });

        schema.register('contentCardParagraph', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'contentCard',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$root',

        });

        // schema.register('contentCardImage', {
        //
        //     allowIn: 'contentCard',
        //
        //     // Allow content which is allowed in blocks (i.e. text with attributes).
        //     allowContentOf: '$block',
        //
        // });

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

                // renderContent( { domElement, editor, state, props } );

                return toWidget(section, viewWriter, { hasSelectionHandle: true });
            }
        });

        // <contentCardTitle> converters
        conversion.for('upcast').elementToElement({
            model: 'contentCardTitle',
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

        // <contentCardImage> converters
        conversion.for('upcast').elementToElement({
            model: 'contentCardImage',
            view: {
                name: 'div',
                classes: 'content-card-image'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'contentCardImage',
            view: {
                name: 'div',
                classes: 'content-card-image',
                styles: {
                    float: 'left',
                    'max-width': '25%',
                    margin: '5px 0.625rem 5px 0'
                }
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'contentCardImage',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', { class: 'content-card-image', style: "max-width: 25%;  float: left; margin: 5px 0.625rem 5px 0" });
                return toWidgetEditable(div, viewWriter);
            }
        });

        // <contentCardParagraph> converters
        conversion.for('upcast').elementToElement({
            model: 'contentCardParagraph',
            view: {
                name: 'div',
                classes: 'content-card-paragraph'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'contentCardParagraph',
            view: {
                name: 'div',
                classes: 'content-card-paragraph'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'contentCardParagraph',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', { class: 'content-card-paragraph' });
                return toWidgetEditable(div, viewWriter);
            }
        });

    }
    /**
     * If query params contain Frill.co SSO
     * Authenticate user and redirect to frill redirect URI
     */
    _defineClipboardInputOutput() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const model = this.editor.model
        // Processing pasted or dropped content.
        this.listenTo(viewDocument, 'clipboardInput', (evt, data) => {
            // The clipboard content was already processed by the listener on the higher priority
            // (for example while pasting into the code block).


            const dataTransfer = data.dataTransfer.getData('myData');

            if (!dataTransfer) {
                return;
            }

            // Use JSON data encoded in the DataTransfer.
            let dataTransforObj = JSON.parse(dataTransfer);
            let { heading, media, p, link, type } = dataTransforObj;

            console.debug('clipboardInput', heading)

            // this.editor.execute('InsertContentCard', val)

            //Translate the data to a view fragment.
            const writer = new UpcastWriter(viewDocument);
            const fragment = writer.createDocumentFragment();

            if (type === 'article') {
                let imgBlock = writer.createElement('span', { class: 'image-inline' }, [
                    writer.createElement('img', { src: media }),
                ])

                let paragraphBlock = this.editor.data.htmlProcessor.toView(p + `<p><a class="ck-link_selected" target="_blank" href="${link}">Read More</a></p>`)

                writer.appendChild(
                    writer.createElement('section', { class: 'content-card' }, [
                        writer.createElement('h3', { class: 'content-card-title' }, heading),
                        writer.createElement('div', { class: 'content-card-image' }, imgBlock),
                        writer.createElement('div', { class: 'content-card-paragraph' }, paragraphBlock)
                    ]),
                    fragment
                );
            } else if (type === 'embed') {

                let mediaElement = this.editor.data.htmlProcessor.toView(`<figure class="media">
                                                                                <oembed url="${media}"></oembed>
                                                                            </figure>`)

                writer.appendChild(
                    writer.createElement('section', { class: 'content-card' }, [
                        writer.createElement('div', { class: 'content-card-paragraph' }, mediaElement)
                    ]),
                    fragment
                );

            } else if (type === 'image') {
                if (!p) {
                    p = ''
                }

                let innerHtml = ` <figure class="image">
                                    <img src="${media}">
                                     <figcaption>
                                        ${p}
                                    </figcaption>
                                </figure>`

                let mediaElement = this.editor.data.htmlProcessor.toView(innerHtml)

                writer.appendChild(
                    writer.createElement('section', { class: 'content-card' }, [
                        writer.createElement('div', { class: 'content-card-paragraph' }, mediaElement)
                    ]),
                    fragment
                );

            }

            // Provide the content to the clipboard pipeline for further processing.
            data.content = fragment;


            // let img = `
            //         <span class="image-inline" style="max-width: 50%;  float: right;" contenteditable="false">
            //            <img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg">
            //         </span>
            // `
            // const imgBlock = this.editor.data.htmlProcessor.toView( img )
            // imgBlock.set( 'bar', 1 )

            // writer.setAttribute( 'data-some', 'http://ckeditor.com', imgBlock );

            // const view = this.editor.data.htmlProcessor.toView( innerHtml );

            // const imageElement =  new Element('imageBlock', {
            //     src: link
            // })
            //

            // let model = this.editor.model.change( writer => {
            //     const imageElement = writer.createElement( 'imageBlock', {
            //         src: link
            //     } );
            //
            //     const innerHtml = this.editor.data.htmlProcessor.toData( imageElement );
            //
            //     console.log(innerHtml)
            //
            // } );


            // data.content = this.editor.data.htmlProcessor.toView( data.content );

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


function createDomButton(editor, type) {
    const t = editor.locale.t;
    const buttonView = new ButtonView(editor.locale);
    // const command = editor.commands.get( 'updateHtmlEmbed' );

    buttonView.set({
        tooltipPosition: editor.locale.uiLanguageDirection === 'rtl' ? 'e' : 'w',
        icon: icons.pencil,
        tooltip: true
    });

    buttonView.render();

    if (type === 'edit') {
        buttonView.set({
            icon: icons.pencil,
            label: t('Edit source'),
            class: 'raw-html-embed__edit-button'
        });
    } else if (type === 'save') {
        buttonView.set({
            icon: icons.check,
            label: t('Save changes'),
            class: 'raw-html-embed__save-button'
        });
        // buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );
    } else {
        buttonView.set({
            icon: icons.cancel,
            label: t('Cancel'),
            class: 'raw-html-embed__cancel-button'
        });
    }

    buttonView.destroy();

    return buttonView.element.cloneNode(true);
}


function getText(viewElement) {
    return Array.from(viewElement.getChildren())
        .map(node => node.is('$text') ? node.data : '')
        .join('');
}
