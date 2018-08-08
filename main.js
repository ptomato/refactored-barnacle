const {Gio} = imports.gi;
const System = imports.system;

const resource = Gio.Resource.load('/app/share/refactored-barnacle/app.gresource');
Gio.resources_register(resource);

const {RbApp} = imports.app;

const theApp = new RbApp();
theApp.run([System.programInvocationName].concat(ARGV));
