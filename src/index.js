import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import 'codemirror/lib/codemirror.css';
import './toastui-editor.css';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import 'tui-color-picker/dist/tui-color-picker.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  detachExternalChangeHandler = null;
  editorRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || '',
      changed: false,
      isSaving: false,
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value) => {
    this.setState({ value });
  };

  handleChange = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      const md = this.editorRef.current.getInstance().getMarkdown();
      this.setState({ isSaving: true });
      this.props.sdk.field.setValue(md).then(() => {
        this.setState({ isSaving: false });
      });
    }, 500)
  }

  handleClick = () => {
    this.setState({ isSaving: true });
    const md = this.editorRef.current.getInstance().getMarkdown();
    this.props.sdk.field.setValue(md).then((data) => {
      this.setState({ isSaving: false });
    });
  };

  render() {
    const { isSaving, value, changed } = this.state;
    return (
      <>
        <Editor
          plugins={[tableMergedCell, colorSyntax]}
          initialValue={value}
          initialEditType="wysiwyg"
          previewStyle="vertical"
          height="600px"
          useCommandShortcut={true}
          ref={this.editorRef}
          onChange={this.handleChange}
        />
        <div style={{marginTop: '10px'}} />
        <button
          style={{
            color: '#fff',
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            fontWeight: '400',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            padding: '.375rem .75rem',
            fontSize: '1rem',
            width: '100%',
            borderRdius: '.25rem',
          }}
          onClick={this.handleClick}
          disabled={!changed}
        >
          {isSaving ? '存檔中..' : '存檔'}
        </button>
      </>
    );
  }
}

init((sdk) => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
