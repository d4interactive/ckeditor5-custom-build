import ContentCardEditing from './contentCardEditing';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ContentCard extends Plugin {
    static get requires() {
        return [ContentCardEditing];
    }
}