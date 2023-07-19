// Import necessary libraries
const { useEffect } = React;
const { createStore } = Redux;
const { Provider, connect } = ReactRedux;

// Action type for updating the markdown content
const mdUpdate = "MD_UPDATE";

// Initial markdown state
const defState = `# Markdown Previewer

## A Simple Tool for Previewing Markdown

Welcome to the Markdown Previewer! This tool allows you to see how your Markdown content will be rendered. 

Feel free to experiment and see the changes in real time.

To learn more about Markdown, visit the [Markdown Guide](https://www.markdownguide.org/).

Inline code example: \`print("Hello, Markdown!")\`

Code block example:
\`\`\`python
def greet():
    print("Hello, Markdown!")
greet()
\`\`\`

Programming languages:
 - Python
 - JavaScript
 - Rust
 
> "The previewer is a useful tool for developers and writers to visualize their Markdown content before publishing."
 
![github logo](https://cdn-icons-png.flaticon.com/32/25/25231.png) **GitHub flavored markdown**

**Developed by [Jovan Tomovic](https://linktr.ee/jovantomovic)**`

// Redux reducer to handle state updates
const reducer = (state = defState, action) => {
  switch (action.type) {
    case mdUpdate:
      return action.input;
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

// Editor component to input Markdown
const Editor = (props) => {
  const handleChange = (event) => props.changeInput(event.target.value);

  return (
    <div className="section">
      <textarea id="editor" onChange={handleChange} value={props.input} />
    </div>
  );
}

// Settings for Marked (Markdown parser)
marked.use({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false
});

// Preview component to render the parsed Markdown
const Preview = (props) => {
  // This effect will run every time the component is mounted (rendered)
  useEffect(() => {
    // Get all anchors
    const anchors = document.querySelectorAll('a');
    // Make all anchors open in a new tab
    anchors.forEach(anchor => {
      anchor.setAttribute('target', '_blank');
    });
  });

  // Parse the Markdown content and sanitize it to prevent XSS attacks
  const output = DOMPurify.sanitize(marked.parse(props.input));

  return (
    <div id="preview" className="section" dangerouslySetInnerHTML={{ __html: output }}></div>
  );
}

// Map state to props
function mapStateToProps(state) {
  return {
    // Map state property to component prop
    input: state
  };
}

// Map dispatch to props
function mapDispatchToProps(dispatch) {
  return {
    // Map action creator to component prop
    changeInput: (input) => dispatch({ type: mdUpdate, input: input })
  };
}

// Connect Editor component to Redux store
const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(Editor);

// Connect Preview component to Redux store
const ConnectedPreview = connect(mapStateToProps, mapDispatchToProps)(Preview);

// Render the components inside the Redux Provider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ConnectedEditor />
    <ConnectedPreview />
  </Provider>
);
