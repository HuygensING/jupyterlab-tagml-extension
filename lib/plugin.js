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

	//    // Open tags
	//    {regex: /\[/, token: 'tag', push: 'open_tag'},
	//
	//    // Close tags
	//    {regex: /\</, token: 'tag', push: 'close_tag'},


	//    // Strings
	//    {regex: /"/, token: 'string', push: 'string_regular'},
	//    {regex: /`"/, token: 'string', push: 'string_compound'},
	//
	//    // Macros
	//    {regex: /`/, token: 'variable-2', push: 'macro_local'},
	//    {regex: /\$/, token: 'variable-2', push: 'macro_global'},

	    // Decimal Numbers
	    {regex: /\b[+-]?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+|\.)(?:[eE][+-]?[0-9]+)?[i]?\b/,
	      token: 'number'},

	    {regex: /-|==|<=|>=|<|>|&|!=/, token: 'operator'},
	    {regex: /\*|\+|\^|\/|!|~|=|~=/, token: 'operator'},
	  ],

	  open_tag: [
	  ],

	  close_tag: [
	  ],

	  comments_block: [
	    // nested comments block
	    {regex: /\[\!/, token: 'comment', push: 'comments_block'},
	    // end comments block
	    {regex: /\!]/, token: 'comment', pop: true},
	    // Match anything else as a character inside the comment
	    {regex: /./, token: 'comment'},
	  ],

	  string_compound: [
	    {regex: /`"/, token: 'string', push: 'string_compound'},
	    {regex: /"'/, token: 'string', pop: true},
	    // {regex: /`/, token: 'variable-2', push: 'macro_local'},
	    // {regex: /\$/, token: 'variable-2', push: 'macro_global'},
	    {regex: /./, token: 'string'}
	  ],

	  string_regular: [
	    {regex: /"/, token: 'string', pop: true},
	    // {regex: /`/, token: 'variable-2', push: 'macro_local'},
	    // {regex: /\$/, token: 'variable-2', push: 'macro_global'},
	    {regex: /./, token: 'string'}
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
