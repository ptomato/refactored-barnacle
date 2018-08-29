/* exported RbControlPanelPage */

const {GObject, Gtk} = imports.gi;

const {RbColorSchemeWidget} = imports.colorSchemeWidget;
const {RbArrangementWidget} = imports.arrangement;

const {NAMES} = imports.palette;

var RbControlPanelPage = GObject.registerClass({
    GTypeName: 'RbControlPanelPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/controlpanel.ui',
    InternalChildren: ['arrangementButton', 'arrangementGrid',
        'arrangementMenu', 'cardBorderAdjustment', 'colorSchemeButton',
        'colorSchemeGrid', 'colorSchemeMenu', 'discoSwitch',
        'fontSizeAdjustment', 'noiseSwitch', 'passtuneRevealer'],
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

        ['tiled-grid', 'windshield', 'piano'].forEach(arrangement => {
            const widget = new RbArrangementWidget({arrangement});
            this._arrangementGrid.add(widget);
        });
        this._selectedArrangement = new RbArrangementWidget({
            arrangement: 'tiled-grid',
        });
        this._arrangementButton.add(this._selectedArrangement);

        this._colorSchemeGrid.connect('child-activated',
            this._onColorSchemeActivated.bind(this));
        this._arrangementGrid.connect('child-activated',
            this._onArrangementActivated.bind(this));
        this._cardBorderAdjustment.connect('notify::value',
            this._onCardBorderChanged.bind(this));
    }

    _onColorSchemeActivated(widget, child) {
        this._selectedColorScheme.color_scheme = child.get_child().color_scheme;
        this._colorSchemeMenu.popdown();
    }

    _onArrangementActivated(widget, child) {
        this._selectedArrangement.arrangement = child.get_child().arrangement;
        this._arrangementMenu.popdown();
    }

    _onCardBorderChanged() {
        this._discoSwitch.sensitive = this._cardBorderAdjustment.value > 0;
    }

    _updatePasstuneHint() {
        this._passtuneRevealer.revealChild = this._model.arrangement === 'piano' &&
            this._model.noise;
    }

    bindModel(model) {
        model.bind_property('card-borders', this._cardBorderAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('font-size', this._fontSizeAdjustment, 'value',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('color-scheme',
            this._selectedColorScheme, 'color-scheme',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('arrangement',
            this._selectedArrangement, 'arrangement',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('disco', this._discoSwitch, 'active',
            GObject.BindingFlags.BIDIRECTIONAL);
        model.bind_property('noise', this._noiseSwitch, 'active',
            GObject.BindingFlags.BIDIRECTIONAL);

        model.connect('notify::arrangement', this._updatePasstuneHint.bind(this));
        model.connect('notify::noise', this._updatePasstuneHint.bind(this));

        this._model = model;
    }
});
