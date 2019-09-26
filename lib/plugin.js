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
	    // Comments
	    {regex: /\[\!/, token: 'comment', push: 'comments_block'},

	    // Open tags
	    {regex: /\[/, token: 'keyword', push: 'open_tag'},
	
	    // Close tags
	    {regex: /\</, token: 'keyword', push: 'close_tag'}
	  ],

	  open_tag: [
	    // close open tag
	    {regex: />/, token: 'keyword', pop: true},
	    // close empty tag
	    {regex: /]/, token: 'keyword', pop: true},
	    {regex: /\|/, token: 'keyword'},
	    {regex: /./, token: 'variable-2'}
	  ],

	  close_tag: [
	    {regex: /\]/, token: 'keyword', pop: true},
	    {regex: /\|/, token: 'keyword'},
	    {regex: /./, token: 'variable-2'}
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
