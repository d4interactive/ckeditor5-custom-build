/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';


import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';

import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed.js';

import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';

import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import MediaLibrary from './custom/mediaLibrary';

import ContentCard from './custom/contentCard/contentCard';


import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';


class Editor extends ClassicEditor { }

// Plugins to include in the build.
Editor.builtinPlugins = [
	SourceEditing,
	Alignment,
	Autosave,
	BlockQuote,
	Bold,
	Strikethrough,
	Subscript,
	Superscript,
	Code,
	CodeBlock,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontSize,
	Heading,
	HtmlEmbed,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageUpload,
	LinkImage,
	ImageToolbar,
	SimpleUploadAdapter,
	Indent,
	Italic,
	Link,
	List,
	TodoList,
	PageBreak,
	Paragraph,
	Underline,
	WordCount,
	MediaLibrary,
	PasteFromOffice,
	FindAndReplace,
	HorizontalLine,
	MediaEmbed,
	Table,
	TableToolbar,
	TableProperties,
	TableCellProperties,
	ContentCard
];


// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'|',
			'bulletedList',
			'numberedList',
			'todoList',
			'|',
			'outdent',
			'indent',
			'|',
			'undo',
			'redo',
			'|',
			'imageUpload',
			'mediaLibrary',
			'mediaEmbed',
			'|',
			'alignment',
			'blockQuote',
			'link',
			'|',
			'fontSize',
			'fontBackgroundColor',
			'fontColor',
			'subscript',
			'superscript',
			'code',
			'horizontalLine',
			'|',
			'insertTable',
			'imageInsert',
			'|',
			'pageBreak',
			'htmlEmbed',
			'codeBlock',
			'sourceEditing',
			'|',
			'findAndReplace',
		],
		shouldNotGroupWhenFull: false
	},
	language: 'en',
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'linkImage'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn', 'tableRow', 'mergeTableCells',
			'tableProperties', 'tableCellProperties'
		]
	},
	link: {

		defaultProtocol: 'http://',

		// Let the users control the "download" attribute of each link.
		decorators: {
			openInNewTab: {
				mode: 'manual',
				label: 'Open in a new tab',
				defaultValue: true,			// This option will be selected by default.
				attributes: {
					target: '_blank',
					rel: 'noopener noreferrer'
				}
			}
		}
	},
	extraPlugins: [
		function (editor) {
			// Allow <iframe> elements in the model.
			editor.model.schema.register('iframe', {
				allowWhere: '$text',
				allowContentOf: '$block'
			});
			// Allow <iframe> elements in the model to have all attributes.
			editor.model.schema.addAttributeCheck(context => {
				if (context.endsWith('iframe')) {
					return true;
				}
			});
			// View-to-model converter converting a view <iframe> with all its attributes to the model.
			editor.conversion.for('upcast').elementToElement({
				view: 'iframe',
				model: (viewElement, modelWriter) => {
					return modelWriter.createElement('iframe', viewElement.getAttributes());
				}
			});

			// Model-to-view converter for the <iframe> element (attributes are converted separately).
			editor.conversion.for('downcast').elementToElement({
				model: 'iframe',
				view: 'iframe'
			});

			// Model-to-view converter for <iframe> attributes.
			// Note that a lower-level, event-based API is used here.
			editor.conversion.for('downcast').add(dispatcher => {
				dispatcher.on('attribute', (evt, data, conversionApi) => {
					// Convert <iframe> attributes only.
					if (data.item.name != 'iframe') {
						return;
					}

					const viewWriter = conversionApi.writer;
					const viewIframe = conversionApi.mapper.toViewElement(data.item);

					// In the model-to-view conversion we convert changes.
					// An attribute can be added or removed or changed.
					// The below code handles all 3 cases.
					if (data.attributeNewValue) {
						viewWriter.setAttribute(data.attributeKey, data.attributeNewValue, viewIframe);
					} else {
						viewWriter.removeAttribute(data.attributeKey, viewIframe);
					}
				});
			});
		}
	]
};



export default Editor;
