import DragWidgetEditing from './dragWidgetEditing';
import DragWidgetUi from './dragWidgetUi';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class SimpleBox extends Plugin {
    static get requires() {
        return [DragWidgetEditing, DragWidgetUi];
    }
}