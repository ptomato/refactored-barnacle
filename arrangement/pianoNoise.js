/* exported PianoNoise */
/* global custom_modules */

const {Gdk, GLib, GObject, Gtk} = imports.gi;

const Module = imports.framework.interfaces.module;
const Dispatcher = imports.framework.dispatcher;
const {Piano} = imports.framework.modules.arrangement.piano;
const {AudioPlayer} = custom_modules.audioPlayer;

// Keep in sync with gen.js
const DISCO_CSS = `
.CardDefault {
    padding: 15px;
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab,
        #5073b8, #1098ad, #07b39b, #6fba82);
    background-size: 300% 300%;
    animation: animatedgradient 3s ease alternate infinite;
}

@keyframes animatedgradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
`;

var PianoNoise = new Module.Class({
    Name: 'Arrangement.PianoNoise',
    Extends: Piano,

    Properties: {
        noise: GObject.ParamSpec.boolean('noise', 'Noise', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            false),
    },

    _init(props = {}) {
        this._ncards = 0;
        this._playedNotes = [];
        this._cardHandlers = new Map();

        // eslint-disable-next-line no-restricted-syntax
        this.parent(props);
        this._audioPlayer = new AudioPlayer({
            channels: 4,
            soundpack: 'piano',
        });

        if (this._noise) {
            // Prevent clicks on cards from actually going anywhere
            // Priority slightly lower than the dispatcher priority
            GLib.idle_add(Gtk.PRIORITY_RESIZE - 9, () => {
                Dispatcher.get_default().pause();
                return GLib.SOURCE_REMOVE;
            });
        }
    },

    get noise() {
        return this._noise;
    },

    set noise(value) {
        this._noise = value;
    },

    // Module override
    drop_submodule() {
        this._audioPlayer.cleanup();
    },

    _wasPasstunePlayed() {
        if (this._playedNotes.length !== 4)
            return false;
        return [3, 1, 2, 0].every((note, ix) => this._playedNotes[ix] === note);
    },

    _playNote(id) {
        this._audioPlayer.play(id);
        this._playedNotes.push(id);
        if (this._playedNotes.length > 4)
            this._playedNotes = this._playedNotes.slice(-4);
        if (this._wasPasstunePlayed()) {
            // Add some celebratory disco borders
            const discoProvider = new Gtk.CssProvider();
            discoProvider.load_from_data(DISCO_CSS);
            Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
                discoProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

            // Stop the piano
            this._cardHandlers.forEach((handler, card) => card.disconnect(handler));
            this._cardHandlers.clear();

            // Resume normal operation of the app
            const dispatcher = Dispatcher.get_default();
            dispatcher._queue = [];  // FIXME need to add "public" API for this
            dispatcher.resume();
        }
    },

    // Piano override
    pack_card(card) {
        if (this._noise) {
            const id = this._ncards++;
            const handler = card.connect('clicked', () => this._playNote(id));
            this._cardHandlers.set(card, handler);
        }
        // eslint-disable-next-line no-restricted-syntax
        this.parent(card);
    },
});
