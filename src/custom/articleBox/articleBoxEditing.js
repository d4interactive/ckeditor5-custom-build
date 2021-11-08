import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertArticleBoxcommand from './insertArticleBoxcommand';

export default class ArticleBoxEditing extends Plugin {

    static get requires() {                                                    // ADDED
        return [Widget];
    }

    init() {
        console.log('ArticleBoxEditing#init() got called');

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('insertArticleBox', new InsertArticleBoxcommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('articleBox', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        });

        schema.register('articleBoxTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'articleBox',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        });

        schema.register('articleBoxDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'articleBox',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <articleBox> converters
        conversion.for('upcast').elementToElement({
            model: 'articleBox',
            view: {
                name: 'section',
                classes: 'article-box'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'articleBox',
            view: {
                name: 'section',
                classes: 'article-box'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'articleBox',
            view: (modelElement, { writer: viewWriter }) => {
                const section = viewWriter.createContainerElement('section', { class: 'article-box' });

                return toWidget(section, viewWriter, { label: 'simple box widget', hasSelectionHandle: true });
            }
        });

        // <articleBoxTitle> converters
        conversion.for('upcast').elementToElement({
            model: 'articleBoxTitle',
            view: {
                name: 'h1',
                classes: 'article-box-title'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'articleBoxTitle',
            view: {
                name: 'h1',
                classes: 'article-box-title'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'articleBoxTitle',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement('h1', { class: 'article-box-title' });

                return toWidgetEditable(h1, viewWriter);
            }
        });

        // <articleBoxDescription> converters
        conversion.for('upcast').elementToElement({
            model: 'articleBoxDescription',
            view: {
                name: 'div',
                classes: 'article-box-description'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'articleBoxDescription',
            view: {
                name: 'div',
                classes: 'article-box-description'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'articleBoxDescription',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', { class: 'article-box-description' });

                return toWidgetEditable(div, viewWriter);
            }
        });
    }
}
