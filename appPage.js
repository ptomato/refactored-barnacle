/* exported RbAppPage */

const {GObject, Gtk} = imports.gi;

var RbAppPage = GObject.registerClass({
    GTypeName: 'RbAppPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/app.ui',
    Children: ['playButton'],
}, class RbAppPage extends Gtk.Grid {
});
