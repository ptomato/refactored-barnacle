project('refactored-barnacle')

gnome = import('gnome')

resource = gnome.compile_resources('app', 'app.gresource.xml',
    gresource_bundle: true,
    install: true, install_dir: 'share/refactored-barnacle')

sources = [
    'app.js',
    'appPage.js',
    'appWindow.js',
    'controlPanelPage.js',
    'hackerViewPage.js',
    'main.js',
    'model.js',
]

install_data(sources)

install_data('name.ptomato.RefactoredBarnacle', install_dir: 'bin')
