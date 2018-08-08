/* exported RbAppWindow */

const {GObject, Gtk} = imports.gi;

const {RbAppPage} = imports.appPage;
const {RbControlPanelPage} = imports.controlPanelPage;
const {RbHackerViewPage} = imports.hackerViewPage;
const {RbModel} = imports.model;

const PAGES = ['app-page', 'control-panel-page', 'hacker-view-page'];

var RbAppWindow = GObject.registerClass({
    GTypeName: 'RbAppWindow',
    Template: 'resource:///name/ptomato/RefactoredBarnacle/appwindow.ui',
    InternalChildren: ['deeperButton', 'deeperRevealer', 'labelStack',
        'pageStack', 'shallowerButton', 'shallowerRevealer'],
}, class RbAppWindow extends Gtk.ApplicationWindow {
    _init(props = {}) {
        super._init(props);
        this.show_all();

        this._appPage = new RbAppPage();
        this._controlPanelPage = new RbControlPanelPage();
        this._hackerViewPage = new RbHackerViewPage();

        this._pageStack.add_named(this._appPage, PAGES[0]);
        this._pageStack.add_named(this._controlPanelPage, PAGES[1]);
        this._pageStack.add_named(this._hackerViewPage, PAGES[2]);

        this._model = new RbModel();

        this._controlPanelPage.bindModel(this._model);
        this._deeperButton.connect('clicked', this._onDeeperClicked.bind(this));
        this._shallowerButton.connect('clicked', this._onShallowerClicked.bind(this));
        this._appPage.playButton.connect('clicked', this._onPlayClicked.bind(this));
    }

    _onDeeperClicked() {
        this._labelStack.transitionType = Gtk.StackTransitionType.UNDER_UP;
        this._pageStack.transitionType = Gtk.StackTransitionType.UNDER_UP;

        const oldPage = this._labelStack.visibleChildName;
        const newIndex = PAGES.indexOf(oldPage) + 1;
        const newPage = PAGES[newIndex];

        this._deeperRevealer.revealChild = !(newIndex === PAGES.length - 1);
        this._shallowerRevealer.revealChild = true;

        this._labelStack.visibleChildName = newPage;
        this._pageStack.visibleChildName = newPage;
    }

    _onShallowerClicked() {
        this._labelStack.transitionType = Gtk.StackTransitionType.OVER_DOWN;
        this._pageStack.transitionType = Gtk.StackTransitionType.OVER_DOWN;

        const oldPage = this._labelStack.visibleChildName;
        const newIndex = PAGES.indexOf(oldPage) - 1;
        const newPage = PAGES[newIndex];

        this._shallowerRevealer.revealChild = !(newIndex === 0);
        this._deeperRevealer.revealChild = true;

        this._labelStack.visibleChildName = newPage;
        this._pageStack.visibleChildName = newPage;
    }

    _onPlayClicked() {
        this._model.launch();
    }
});
