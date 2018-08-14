/* exported RbColorSchemeWidget */

const {Gdk, GObject, Gtk} = imports.gi;

const {DISPLAY_NAMES, PALETTES} = imports.palette;

var RbColorSchemeWidget = GObject.registerClass({
    Properties: {
        'color-scheme': GObject.ParamSpec.string('color-scheme', 'Color Scheme', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            'default'),
    },
    GTypeName: 'RbColorSchemeWidget',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/colorschemewidget.ui',
    InternalChildren: ['canvas', 'label'],
}, class RbColorSchemeWidget extends Gtk.Grid {
    _init(props = {}) {
        super._init(props);
        this._setLabelText();
        this._canvas.connect('draw', this._draw.bind(this));
    }

    _setLabelText() {
        if (this._label)
            this._label.label = `<small>${DISPLAY_NAMES[this._colorScheme]}</small>`;
    }

    get color_scheme() {
        return this._colorScheme;
    }

    set color_scheme(value) {
        if (this._colorScheme && this._colorScheme === value)
            return;
        this._colorScheme = value;
        this._setLabelText();
        this.queue_draw();
        this.notify('color-scheme');
    }

    _draw(canvas, cr) {
        function rect(c, x, y, width, height, r, g, b) {
            c.save();
            c.setSourceRGB(r / 63, g / 63, b / 63);
            c.moveTo(x, y);
            c.lineTo(x + width, y);
            c.lineTo(x + width, y + height);
            c.lineTo(x, y + height);
            c.fill();
            c.restore();
        }

        const width = canvas.get_allocated_width();
        const height = canvas.get_allocated_height();

        if (this._colorScheme !== 'default') {
            let x = 0;
            let y = 0;
            PALETTES[this._colorScheme].forEach(([r, g, b], ix) => {
                rect(cr, x, y, width / 3, height / 3, r, g, b);
                x += width / 3;
                if (ix % 3 === 2) {
                    x = 0;
                    y += height / 3;
                }
            });
        }

        cr.$dispose();
        return Gdk.EVENT_PROPAGATE;
    }
});
