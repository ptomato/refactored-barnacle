/* exported PianoNoise */
/* global custom_modules */

const {Gdk, GObject} = imports.gi;

const Module = imports.framework.interfaces.module;
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
        this._audioPlayer = new AudioPlayer({channels: 4});
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
            card.connect('enter-notify-event', () => {
                this._audioPlayer.play(id);
                return Gdk.EVENT_PROPAGATE;
            });
            card.connect('leave-notify-event', () => {
                this._audioPlayer.stop(id);
                return Gdk.EVENT_PROPAGATE;
            });
        }
        // eslint-disable-next-line no-restricted-syntax
        this.parent(card);
    },
});
