/* exported RbArrangementWidget */

const {GObject, Gtk} = imports.gi;

const DISPLAY_NAMES = {
    'tiled-grid': 'Tiled Grid',
    windshield: 'Windshield',
};

var RbArrangementWidget = GObject.registerClass({
    Properties: {
        arrangement: GObject.ParamSpec.string('arrangement', 'Arrangement', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            ''),
    },
}, class RbArrangementWidget extends Gtk.Label {
    _init(props = {}) {
        props.useMarkup = true;
        props.visible = true;
        super._init(props);
    }

    get arrangement() {
        return this._arrangement;
    }

    set arrangement(value) {
        if ('_arrangement' in this && this._arrangement === value)
            return;
        this._arrangement = value;
        this.label = `<small>${DISPLAY_NAMES[this._arrangement]}</small>`;
        this.notify('arrangement');
    }
});
