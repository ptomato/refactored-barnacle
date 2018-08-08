/* exported RbModel */

const {GLib, GObject} = imports.gi;

var RbModel = GObject.registerClass({
    Properties: {
        'font-size': GObject.ParamSpec.uint('font-size', 'Font Size', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            0, GLib.MAXUINT32, 10),
        'card-borders': GObject.ParamSpec.uint('card-borders', 'Card Borders', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            0, GLib.MAXUINT32, 0),
        'color-scheme': GObject.ParamSpec.string('color-scheme', 'Color Scheme', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            'default'),
        arrangement: GObject.ParamSpec.string('arrangement', 'Arrangement', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            'grid'),
    },
}, class RbModel extends GObject.Object {
    get font_size() {
        return this._fontSize;
    }

    set font_size(value) {
        if ('_fontSize' in this && this._fontSize === value)
            return;
        this._fontSize = value;
        this.notify('font-size');
    }

    get card_borders() {
        return this._cardBorders;
    }

    set card_borders(value) {
        if ('_cardBorders' in this && this._cardBorders === value)
            return;
        this._cardBorders = value;
        this.notify('card-borders');
    }

    get color_scheme() {
        return this._colorScheme;
    }

    set color_scheme(value) {
        if ('_colorScheme' in this && this._colorScheme === value)
            return;
        this._colorScheme = value;
        this.notify('color-scheme');
    }

    get arrangement() {
        return this._arrangement;
    }

    set arrangement(value) {
        if ('_arrangement' in this && this._arrangement === value)
            return;
        this._arrangement = value;
        this.notify('arrangement');
    }

    launch() {
        print('Launching');
        print('- Font size:', this._fontSize);
        print('- Card borders:', this._cardBorders);
        print('- Color scheme:', this._colorScheme);
        print('- Arrangement:', this._arrangement);
    }
});
