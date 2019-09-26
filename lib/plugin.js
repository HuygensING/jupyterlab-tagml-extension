const CodeMirror = require('codemirror');
require('codemirror/addon/mode/simple');

const TAGML = {
  name: 'tagml',
  displayName: 'TAGML',
  extensions: ['tag', 'tagml'],
  mimetype: 'text/tagml'
}

module.exports = [{
  id: 'tagml-extension',
  autoStart: true,
  activate: function(app) {
    registerTagmlFileType(app);
    registerTagmlWithCodeMirror();
    console.log('JupyterLab extension tagml-extension is activated!');
  }
}];

function registerTagmlFileType(app) {
  app.docRegistry.addFileType({
    name: TAGML.name,
    displayName: TAGML.displayName,
    extensions: TAGML.extensions,
    mimeTypes: [TAGML.mimetype]
  });
}

function registerTagmlWithCodeMirror(){
  CodeMirror.defineSimpleMode(TAGML.name,{
    // The start state contains the rules that are initially used
    start: [
      // namespace
      {regex: /\[\!ns [^\]]+]/, token: 'atom'},

      // Comments
      {regex: /\[\!/, token: 'comment', push: 'comments_block'},

      // Open tags
      {regex: /\[/, token: 'bracket', push: 'open_tag'},

      // Text divergence
      {regex: /<\|/, token: 'bracket', push: 'non_linearity'},

      // Close tags
      {regex: /</, token: 'bracket', push: 'close_tag'}
    ],

    open_tag: [
      {regex: /[a-zA-Z0-9_]+/, token: 'tag'},
      {regex: /\|/, token: 'bracket', push: 'layer_ctx'},
      {regex: /[\+\-,\?:\"']+/, token: 'operator'},
      {regex: / +/, push: 'annotation'},
      // close open tag
      {regex: />/, token: 'bracket', pop: true},
      // close empty tag
      {regex: /]/, token: 'bracket', pop: true}
    ],

    close_tag: [
      {regex: /[a-zA-Z0-9_]+/, token: 'tag'},
      {regex: /\|/, token: 'bracket', push: 'layer_ctx'},
      {regex: /[\+\-,\?:\"']+/, token: 'operator'},
      {regex: /]/, token: 'bracket', pop: true}
    ],

    layer_ctx: [
      {regex: /[\\+,a-zA-Z0-9]+/, token: 'variable', pop: true}
    ],

    annotation: [
      // number annotation
      {regex: /([a-zA-Z0-9_]+)(=)([0-9]+\.?[0-9]*)/, token: ['property','operator','number'], pop: true},

      // string annotations
      {regex: /([a-zA-Z0-9_]+)(=)("[^"]*")/, token: ['property','operator','string'], pop: true},
      {regex: /([a-zA-Z0-9_]+)(=)('[^']*')/, token: ['property','operator','string'], pop: true},

      // boolean annotations
      {regex: /([a-zA-Z0-9_]+)(=)([Tt][Rr][Uu][Ee])/, token: ['property','operator','keyword'], pop: true},
      {regex: /([a-zA-Z0-9_]+)(=)([Ff][Aa][Ll][Ss][Ee])/, token: ['property','operator','keyword'], pop: true},

      // object annotation
      {regex: /([a-zA-Z0-9_]+)(=)({)(.*)(})/, token: ['property','operator','bracket','keyword','bracket'], pop: true},

      // rich text annotation
      {regex: /([a-zA-Z0-9_]+)(=)(\[>)(.*)(<])/, token: ['property','operator','bracket','keyword','bracket'], pop: true},

      // list annotation
      {regex: /([a-zA-Z0-9_]+)(=)(\[)([^\]]*)(])/, token: ['property','operator','bracket','keyword','bracket'], pop: true},

      // reference annotation
      {regex: /([a-zA-Z0-9_]+)(->)([a-zA-Z0-9_]+)/, token: ['property','operator','def'], pop: true}
    ],

    non_linearity: [
      {regex: /\|>/, token: 'bracket', pop: true},
      {regex: /\|/, token: 'bracket'},
      {regex: /./}
    ],

    comments_block: [
      // nested comments block
      {regex: /\[\!/, token: 'comment', push: 'comments_block'},
      // end comments block
      {regex: /\!]/, token: 'comment', pop: true},
      // Match anything else as a character inside the comment
      {regex: /./, token: 'comment'}
    ],

    meta: {
      closeBrackets: {pairs: "{}''\"\""},
      dontIndentStates: ['start','comment'],
      electricInput: /^\s*\}$/,
      blockCommentStart: '[!',
      blockCommentEnd: '!]'
    }
  });

  CodeMirror.defineMIME(TAGML.mimetype, TAGML.name);

  CodeMirror.modeInfo.push({
    name: TAGML.displayName,
    mime: TAGML.mimetype,
    mode: TAGML.name,
    ext: TAGML.extensions
  });
}