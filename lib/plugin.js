const CodeMirror = require('codemirror');
require('codemirror/addon/mode/simple');

var tagml_name = 'tagml';
var tagml_displayName = 'TAGML';
var tagml_extensions = ['tag', 'tagml'];
var tagml_mimetype = 'text/tagml';

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
    name: tagml_name,
    displayName: tagml_displayName,
    extensions: tagml_extensions,
    mimeTypes: [tagml_mimetype]
  });
}

function registerTagmlWithCodeMirror(){
	CodeMirror.defineSimpleMode(tagml_name,{
	  // The start state contains the rules that are initially used
	  start: [
	    // Comments
	//    {regex: /\[\!/, token: 'comment', push: 'comments_block'},

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
	    {regex: /\/\*/, token: 'comment', push: 'comments_block'},
	    // this ends and restarts a comment block. but need to catch this so
	    // that it doesn't start _another_ level of comment blocks
	    {regex: /\*\/\*/, token: 'comment'},
	    {regex: /(\*\/\s+\*(?!\/)[^\n]*)|(\*\/)/, token: 'comment', pop: true},
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

	CodeMirror.defineMIME(tagml_mimetype, tagml_name);

	CodeMirror.modeInfo.push({
	  name: tagml_displayName,
	  mime: tagml_mimetype,
	  mode: tagml_name,
	  ext: tagml_extensions
	});
}
