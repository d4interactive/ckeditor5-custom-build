//the master (glue) plugin. Its role is to simply load the “editing” and “UI” parts.

import ArticleBoxEditing from './articleBoxEditing';
import ArticleBoxUi from './articleBoxUi';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ArticleBox extends Plugin {
    static get requires() {
        return [ArticleBoxEditing, ArticleBoxUi];
    }
}