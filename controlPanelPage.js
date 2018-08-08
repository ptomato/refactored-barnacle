/* exported RbControlPanelPage */

const {GObject, Gtk} = imports.gi;

var RbControlPanelPage = GObject.registerClass({
    GTypeName: 'RbControlPanelPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/controlpanel.ui',
    InternalChildren: ['cardBorderAdjustment', 'fontSizeAdjustment'],
}, class RbControlPanelPage extends Gtk.Grid {
    bindModel(model) {
        model.bind_property('card-borders', this._cardBorderAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('font-size', this._fontSizeAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
    }
});
