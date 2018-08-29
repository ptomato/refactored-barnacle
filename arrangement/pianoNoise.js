/* exported PianoNoise */
/* global custom_modules */

const {GLib, GObject, Gtk} = imports.gi;

const Module = imports.framework.interfaces.module;
const Dispatcher = imports.framework.dispatcher;
const {Piano} = imports.framework.modules.arrangement.piano;
const {AudioPlayer} = custom_modules.audioPlayer;

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

    // Piano override
    pack_card(card) {
        if (this._noise) {
            const id = this._ncards++;
            card.connect('clicked', () => {
                this._audioPlayer.play(id);
            });
        }
        // eslint-disable-next-line no-restricted-syntax
        this.parent(card);
    },
});
