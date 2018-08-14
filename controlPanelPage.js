/* exported RbControlPanelPage */

const {GObject, Gtk} = imports.gi;

const {RbColorSchemeWidget} = imports.colorSchemeWidget;

const {NAMES} = imports.palette;

var RbControlPanelPage = GObject.registerClass({
    GTypeName: 'RbControlPanelPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/controlpanel.ui',
    InternalChildren: ['cardBorderAdjustment', 'colorSchemeButton',
        'colorSchemeGrid', 'colorSchemeMenu', 'fontSizeAdjustment'],
}, class RbControlPanelPage extends Gtk.Grid {
    _init(props = {}) {
        super._init(props);

        NAMES.forEach(colorScheme => {
            const widget = new RbColorSchemeWidget({colorScheme});
            this._colorSchemeGrid.add(widget);
        });

        this._selectedColorScheme = new RbColorSchemeWidget({
            colorScheme: 'default',
        });
        this._colorSchemeButton.add(this._selectedColorScheme);

        this._colorSchemeGrid.connect('child-activated',
            this._onColorSchemeActivated.bind(this));
    }

    _onColorSchemeActivated(widget, child) {
        this._selectedColorScheme.color_scheme = child.get_child().color_scheme;
        this._colorSchemeMenu.popdown();
    }

    bindModel(model) {
        model.bind_property('card-borders', this._cardBorderAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('font-size', this._fontSizeAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('color-scheme',
            this._selectedColorScheme, 'color-scheme',
            GObject.BindingFlags.BIDIRECTIONAL);
    }
});
