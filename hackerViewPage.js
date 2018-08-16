/* exported RbHackerViewPage */

const {GLib, GObject, Gtk, GtkSource} = imports.gi;

var RbHackerViewPage = GObject.registerClass({
    GTypeName: 'RbHackerViewPage',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/hackerview.ui',
    InternalChildren: ['scroll', 'helpButton', 'helpHeading', 'helpLabel',
        'helpMessage', 'okButton'],
}, class RbHackerViewPage extends Gtk.Overlay {
    _init(props = {}) {
        super._init(props);

        this._codeView = new GtkSource.View({visible: true});
        this._scroll.add(this._codeView);

        const provider = new Gtk.CssProvider();
        provider.load_from_data('*{font-family: monospace;}');
        this._codeView.get_style_context().add_provider(provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

        this._codeView.buffer.connect('changed',
            this._onBufferChanged.bind(this));
        this._helpButton.connect('clicked', this._onHelpClicked.bind(this));
        this._okButton.connect('clicked', this._onOkClicked.bind(this));

        this._compileTimeout = null;
    }

    _onBufferChanged() {
        this.ensureNoTimeout();
        this._compileTimeout = GLib.timeout_add_seconds(GLib.PRIORITY_HIGH, 1,
            this.compile.bind(this));
    }

    _onHelpClicked() {
        this.ensureNoTimeout();
        this.compile();
        this._helpMessage.popup();
    }

    _onOkClicked() {
        this._helpMessage.popdown();
    }

    bindModel(model) {
        this._model = model;
    }

    ensureNoTimeout() {
        if (!this._compileTimeout)
            return;
        GLib.Source.remove(this._compileTimeout);
        this._compileTimeout = null;
    }

    compile() {
        const code = this._codeView.buffer.text;

        if (code === '') {
            this._helpHeading.label = 'Type here!';
            this._helpLabel.label = `Here are some things I understand:
fontSize, cardBorders, colorScheme, arrangement…`;
            return GLib.SOURCE_REMOVE;
        }

        const scope = {
            fontSize: null,
            cardBorders: null,
            colorScheme: null,

            // define variables for all the palettes so that we don't have to
            // care about whether they enter quotes or not
            arctic: 'arctic',
            auroraBorealis: 'aurora-borealis',
            gold: 'gold',
            heavyMetal: 'heavy-metal',
            jungle: 'jungle',
            rose: 'rose',
            spacePigs: 'space-pigs',
            whyColors: 'why-colors',
        };
        try {
            // eslint-disable-next-line no-new-func
            const func = new Function('scope', `with(scope){\n${code}\n;}`);
            func(scope);

            this._helpHeading.label = 'All good 👍';
            this._helpLabel.label = 'Try going back up to the app and launching it!';

            if (scope.fontSize === null && scope.cardBorders === null &&
                scope.colorScheme === null) {
                this._helpHeading.label = "That code isn't doing anything";
                this._helpLabel.label = `Try changing one of these things:
fontSize, cardBorders, colorScheme, arrangement…`;
                return GLib.SOURCE_REMOVE;
            }

            print('new scope', JSON.stringify(scope));
            if (scope.fontSize !== null)
                this._model.font_size = scope.fontSize;
            if (scope.cardBorders !== null)
                this._model.card_borders = scope.cardBorders;
            if (scope.colorScheme !== null)
                this._model.color_scheme = scope.colorScheme;
        } catch (e) {
            this._helpHeading.label = 'Error…';
            this._helpLabel.label = `${e}\n${e.stack}`;
        }

        this._compileTimeout = null;
        return GLib.SOURCE_REMOVE;
    }
});
