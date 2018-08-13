/* exported RbModel */

const {Gio, GLib, GObject} = imports.gi;

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
promisify(Gio_File_prototype, 'delete_async', 'delete_finish');
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

    _createSCSS() {
        const scss = `
$primary-light-color: #f4d94f;
$primary-medium-color: #5a8715;

$title-font: Skranji;
$logo-font: 'Patrick Hand SC';

@import 'thematic';

.BannerDynamic__logo {
    font-weight: 400;
    color: white;
}

.home-page .Card__title {
    font-weight: bold;
    font-size: ${this._fontSize * 0.156}em;
}

.set-page .Card__title {
    font-weight: bold;
    font-size: ${this._fontSize * 0.338}em;
}

.LayoutSidebar .sidebar .ContentGroupNoResultsMessage {
    &__title {
        font-size: ${this._fontSize * 3}px;
    }

    &__subtitle {
        font-size: ${this._fontSize * 2}px;
    }
}

.CardDefault {
    &__title {
        font-size: ${this._fontSize * 1.8}px;
    }

    &__synopsis {
        font-size: ${this._fontSize * 1.6}px;
    }

    &__context {
        font-size: ${this._fontSize * 1.4}px;
    }

    &.CardText {
        &.width-h,
        &.width-g,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${this._fontSize * 4.8}px;
            }
            .CardDefault__synopsis {
                font-size: ${this._fontSize * 2}px;
            }
        }

        &.width-e.height-d,
        &.width-e.height-c {
            .CardDefault__title {
                font-size: ${this._fontSize * 3.68}px;
            }
        }

        &.width-e,
        &.width-d {
            .CardDefault__title {
                font-size: ${this._fontSize * 2.72}px;
            }
        }

        &.width-c {
            .CardDefault__title {
                font-size: ${this._fontSize * 2.304}px;
            }
        }

        &.width-b {
            .CardDefault__title {
                font-size: ${this._fontSize * 1.8}px;
            }
        }

        &.height-a {
            .CardDefault__title {
                font-size: ${this._fontSize * 1.6}px;
            }
        }
    }

    &.CardPolaroid {
        &.width-h,
        &.width-g,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${this._fontSize * 3.68}px;
            }
        }

        &.width-h.height-b,
        &.width-g.height-b,
        &.width-f.height-b,
        &.width-e,
        &.width-d.height-e,
        &.width-d.height-d {
            .CardDefault__title {
                font-size: ${this._fontSize * 2.4}px;
            }
        }

        &.width-d,
        &.width-c,
        &.width-b.height-e,
        &.width-b.height-d {
            .CardDefault__title {
                font-size: ${this._fontSize * 2}px;
            }
        }

        &.width-b,
        &.height-a {
            .CardDefault__title {
                font-size: ${this._fontSize * 1.6}px;
            }
        }
    }

    &.CardPost {
        .CardDefault__context {
            font-size: ${this._fontSize * 1.4}px;
        }

        &.width-h,
        &.width-g {
            .CardDefault__title {
                font-size: ${this._fontSize * 4.8}px;
            }
        }

        &.width-h.height-c,
        &.width-g.height-c,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${this._fontSize * 3.68}px;
            }
        }

        &.width-g.height-b,
        &.width-h.height-b,
        &.width-f.height-b,
        &.width-e,
        &.width-d.height-e,
        &.width-d.height-d {
            .CardDefault__title {
                font-size: ${this._fontSize * 2.4}px;
            }
        }

        &.width-d,
        &.width-c,
        &.width-b.height-e,
        &.width-b.height-d {
            .CardDefault__title {
                font-size: ${this._fontSize * 2}px;
            }
        }

        &.width-b,
        &.height-a {
            .CardDefault__title {
                font-size: ${this._fontSize * 1.6}px;
            }
        }
    }
}

.LayoutSidebar {
    .content .BannerSearch__title {
        font-size: ${this._fontSize * 7.2}px;
    }

    .sidebar .CardTitle {
        &__title {
            font-size: ${this._fontSize * 2}px;
        }
    }
}

.BannerSet .CardTitle {
    &__title {
        font-size: ${this._fontSize * 5.4}px;
    }
}

.BannerDynamic {
    font-size: ${this._fontSize * 2}px;
}

// Card borders

.CardDefault {
    border: ${this._cardBorders}px solid $primary-light-color;
}
`;
        return _writeToSandboxFile(scss, 'hack.scss');
    }

    _createWebSCSS() {
        const webSCSS = `
html, body {
    font-size: ${this._fontSize * 2.2}px;
}
`;
        return _writeToSandboxFile(webSCSS, 'hack_web.scss');
    }

    _createYAML() {
        const yaml = "!import 'thematic'";
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
            ],
        });
        proc.init(null);
        try {
            await proc.wait_check_async(null);
        } finally {
            scssFile.delete_async(GLib.PRIORITY_LOW, null);
            yamlFile.delete_async(GLib.PRIORITY_LOW, null);
            webFile.delete_async(GLib.PRIORITY_LOW, null);
        }
    }
});
