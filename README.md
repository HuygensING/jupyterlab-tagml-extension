# tagml-jupyterlab-extension
Custom syntax highlighting for TAGML in the CodeMirror-based editor of jupyterlab

## Prerequisites

* JupyterLab

## Installation

To install using pip:

```bash
jupyter labextension install tagml-extension
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

