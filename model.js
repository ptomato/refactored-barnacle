/* exported RbModel */

const {Gio, GLib, GObject} = imports.gi;

const {generateSCSS, generateWebSCSS, generateYAML} = imports.gen;

const _SANDBOX_PATH = `${GLib.get_home_dir()}/.var/app/name.ptomato.RefactoredBarnacle/sandbox`;
const _SANDBOX = Gio.File.new_for_path(_SANDBOX_PATH);
const _PRIO = GLib.PRIORITY_DEFAULT;

function promisify(prototype, asyncName, finishName) {
    prototype[`_real_${asyncName}`] = prototype[asyncName];
    prototype[asyncName] = function(...args) {
        if (!args.every(arg => typeof arg !== 'function'))
            return this[`_real_${asyncName}`](...args);

        return new Promise((resolve, reject) => {
            const callerStack = new Error().stack
                .split('\n')
                .filter(line => !line.match(/promisify/))
                .join('\n');
            this[`_real_${asyncName}`](...args, function(source, res) {
                try {
                    const result = source[finishName](res);
                    resolve(result);
                } catch (error) {
                    if (error.stack)
                        error.stack += `--- Called from: ---\n${callerStack}`;
                    else
                        error.stack = callerStack;
                    reject(error);
                }
            });
        });
    };
}
const Gio_File_prototype = Gio.File.new_for_path('dummy').constructor.prototype;
promisify(Gio_File_prototype, 'make_directory_async', 'make_directory_finish');
promisify(Gio_File_prototype, 'replace_async', 'replace_finish');
promisify(Gio.OutputStream.prototype, 'close_async', 'close_finish');
promisify(Gio.Subprocess.prototype, 'wait_check_async', 'wait_check_finish');

async function _writeToSandboxFile(string, filename) {
    try {
        await _SANDBOX.make_directory_async(_PRIO, null);
    } catch (e) {
        if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.EXISTS))
            throw e;
    }
    const file = _SANDBOX.get_child(filename);
    const baseStream = await file.replace_async(null, false,
        Gio.FileCreateFlags.NONE, _PRIO, null);
    const stream = new Gio.DataOutputStream({baseStream});
    stream.put_string(string, null);
    await stream.close_async(_PRIO, null);
    return file;
}

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
        disco: GObject.ParamSpec.boolean('disco', 'Disco', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            false),
        decodefunc: GObject.ParamSpec.string('decodefunc', 'Decode function', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            ''),
        noise: GObject.ParamSpec.boolean('noise', 'Noise', '',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
            false),
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

    get disco() {
        return this._disco;
    }

    set disco(value) {
        if ('_disco' in this && this._disco === value)
            return;
        this._disco = value;
        this.notify('disco');
    }

    get decodefunc() {
        return this._decodefunc;
    }

    set decodefunc(value) {
        if ('_decodefunc' in this && this._decodefunc === value)
            return;
        this._decodefunc = value;
        this.notify('decodefunc');
    }

    get noise() {
        return this._noise;
    }

    set noise(value) {
        if ('_noise' in this && this._noise === value)
            return;
        this._noise = value;
        this.notify('noise');
    }

    _createSCSS() {
        const scss = generateSCSS(this._fontSize, this._cardBorders,
            this._colorScheme, this._disco);
        return _writeToSandboxFile(scss, 'hack.scss');
    }

    _createWebSCSS() {
        const webSCSS = generateWebSCSS(this._fontSize);
        return _writeToSandboxFile(webSCSS, 'hack_web.scss');
    }

    _createYAML() {
        const yaml = generateYAML(this._arrangement, this._decodefunc,
            this._noise);
        return _writeToSandboxFile(yaml, 'hack.yaml');
    }

    async launch() {
        const scssFile = await this._createSCSS();
        const yamlFile = await this._createYAML();
        const webFile = await this._createWebSCSS();
        const proc = new Gio.Subprocess({
            argv: [
                'com.endlessm.dinosaurs.en',
                '-J', `${_SANDBOX_PATH}/hack.yaml`,
                '-O', `${_SANDBOX_PATH}/hack.scss`,
                '-w', `${_SANDBOX_PATH}/hack_web.scss`,
                '-E', '/app/share/refactored-barnacle/app.gresource',
            ],
        });
        proc.init(null);
        try {
            await proc.wait_check_async(null);
        } finally {
            // delete, but ignore errors
            scssFile.delete_async(GLib.PRIORITY_LOW, null, () => void 0);
            yamlFile.delete_async(GLib.PRIORITY_LOW, null, () => void 0);
            webFile.delete_async(GLib.PRIORITY_LOW, null, () => void 0);
        }
    }
});
