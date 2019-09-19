import './tagml'

export default [{
    id: 'tagml-extension',
    autoStart: true,
    activate: function(app) {
      console.log('JupyterLab extension tagml-extension is activated!');
      console.log(app.commands);
      registerTagmlFileType(app);
    }
}];

function registerTagmlFileType(app) {
  app.docRegistry.addFileType({
    name: 'tagml',
    displayName: 'TAGML',
    extensions: ['tag', 'tagml'],
    mimeTypes: ['text/tagml']
  });
}