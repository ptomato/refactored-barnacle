/* exported Rot13 */

const {Gio, GObject, Gtk} = imports.gi;

const Module = imports.framework.interfaces.module;
const Utils = imports.framework.utils;
// Make sure included for glade template
void imports.framework.widgets.dynamicLogo;
void imports.framework.widgets.formattableLabel;

const LOGO_URI = 'resource:///app/assets/logo';

var Rot13 = new Module.Class({
    Name: 'Banner.Rot13',
    Extends: Gtk.Grid,

    Properties: {
        'show-subtitle': GObject.ParamSpec.boolean('show-subtitle',
            'Show Subtitle', 'Show Subtitle',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            false),
        mode: GObject.ParamSpec.string('mode', 'mode', 'mode',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT, 'text'),
        layout: GObject.ParamSpec.string('layout', 'layout', 'layout',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY, 'auto'),
        rotation: GObject.ParamSpec.uint('rotation', 'Rotation',
            'Number of positions to advance each letter in the string',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            0, 25, 13),
        decodefunc: GObject.ParamSpec.string('decodefunc', 'Decode Function',
            'Source code of function to evaluate to decode the text',
            GObject.ParamFlags.WRITABLE | GObject.ParamFlags.CONSTRUCT,
            ''),
    },

    Template: 'resource:///name/ptomato/RefactoredBarnacle/banner/rot13.ui',
    InternalChildren: ['subtitle-label', 'logo'],

    _init(props = {}) {
        // We don't want the module to autoexpand, but it will unless explicitly
        // forced not to because logo child has expand=true set.
        props.expand = props.expand || false;
        // eslint-disable-next-line no-restricted-syntax
        this.parent(props);

        // Drop-in replacement for Banner.Dynamic, assume all its theming
        this.get_style_context().add_class('BannerDynamic');

        if (this.mode !== 'text') {
            const file = Gio.File.new_for_uri(LOGO_URI);
            if (file.query_exists(null))
                this._logo.image_uri = LOGO_URI;
            else
                this.mode = 'text';
        }

        this._logo.mode = this.mode;
        this._logo.layout = this.layout;

        const app_info = Utils.get_desktop_app_info();
        if (app_info && app_info.get_name())
            this._logo.text = this._processText(app_info.get_name());

        let subtitle = '';
        if (app_info)
            subtitle = app_info.get_description();
        if (this.show_subtitle && subtitle) {
            this._subtitle_label.label = this._processText(subtitle);
            this._subtitle_label.justify = Utils.alignment_to_justification(this.halign);
        }
        this._subtitle_label.visible = this.show_subtitle;
    },

    get rotation() {
        return this._rotation;
    },

    set rotation(value) {
        this._rotation = value;
    },

    get decodefunc() {
        throw new Error('property not readable');
    },

    set decodefunc(value) {
        if (!value) {
            this._decodefunc = null;
            return;
        }
        // eslint-disable-next-line no-new-func
        this._decodefunc = new Function('letter', value);
    },

    // Adapted from https://gist.github.com/EvanHahn/2587465, public domain
    _processText(text) {
        const decomposedText = text.normalize('NFKD');
        let output = '';

        for (let i = 0; i < decomposedText.length; i++) {
            let c = decomposedText[i];
            const code = decomposedText.codePointAt(i);

            if (code >= 65 && code <= 90) {
                // Uppercase letters
                c = String.fromCodePoint((code - 65 + this._rotation) % 26 + 65);
                if (this._decodefunc)
                    c = String.fromCodePoint(this._decodefunc(c.codePointAt(0) - 65) + 65);
            } else if (code >= 97 && code <= 122) {
                // Lowercase letters
                c = String.fromCodePoint((code - 97 + this._rotation) % 26 + 97);
                if (this._decodefunc)
                    c = String.fromCodePoint(this._decodefunc(c.codePointAt(0) - 97) + 97);
            }

            output += c;
        }

        return output;
    },

    set subtitle(value) {
        if (this._subtitle === value)
            return;
        this._subtitle = value;
        this.notify('subtitle');
    },

    get subtitle() {
        return this._subtitle || '';
    },
});
