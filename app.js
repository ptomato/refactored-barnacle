/* exported RbApp */

const {GObject, Gtk} = imports.gi;

const {RbAppWindow} = imports.appWindow;

var RbApp = GObject.registerClass(class RbApp extends Gtk.Application {
    _init(props = {}) {
        props.applicationId = 'name.ptomato.RefactoredBarnacle';
        super._init(props);
    }

    vfunc_activate() {
        if (!this.activeWindow) {
            this.add_window(new RbAppWindow());
            this.activeWindow.present();
        }

        super.vfunc_activate();
    }
});
