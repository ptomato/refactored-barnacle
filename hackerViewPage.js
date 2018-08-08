/* exported RbHackerViewPage */

const {GObject, Gtk, GtkSource} = imports.gi;

var RbHackerViewPage = GObject.registerClass({
    GTypeName: 'RbHackerViewPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/hackerview.ui',
    InternalChildren: ['scroll'],
}, class RbHackerViewPage extends Gtk.Overlay {
    _init(props = {}) {
        super._init(props);

        this._codeView = new GtkSource.View({visible: true});
        this._scroll.add(this._codeView);
    }
});
