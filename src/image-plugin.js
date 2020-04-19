const LOCALE = 'zh-Hant';


/**
 * Initialize UI
 * @param {object} editor - Editor instance
 * @param {Array.<string>} preset - Preset for color palette
 * @ignore
 */
function initUI(editor, sdk) {
  const name = 'contentful-image';
  const className = 'tui-image';
  const toolbar = editor.getUI().getToolbar();

  editor.eventManager.addEventType('contentfulImageButtonClicked');

  toolbar.insertItem(3, {
    type: 'button',
    options: {
      name,
      className,
      event: 'contentfulImageButtonClicked',
      tooltip: 'Upload image'
    }
  });

  editor.eventManager.listen('contentfulImageButtonClicked', () => {
    sdk.dialogs.selectSingleAsset().then(entry => {
        const {title, file} = entry.fields;
        editor.exec('AddImage', {
            altText: title[LOCALE],
            imageUrl: file[LOCALE].url
        });
    })
  });
}

/**
 * Color syntax plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
export default function imagePlugin(editor, options = {}) {
  const { sdk } = options;

    initUI(editor, sdk);
}
