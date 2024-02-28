import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

class MarkdownProcessor {
  constructor() {}

  // Function to extract semantic chunks from markdown
  extractSemanticChunks(markdownText) {
    const chunks = []; // Array to hold extracted chunks

    const processor = unified().use(remarkParse).use(() => (tree) => {
      // Handle headings
      visit(tree, 'heading', (node) => {
        const value = node.children.map((child) => child.value).join('');
        chunks.push({ type: 'heading', depth: node.depth, value });
      });

      // Handle paragraphs
      visit(tree, 'paragraph', (node) => {
        let value = '';
        node.children.forEach((child) => {
          if (child.type === 'text') {
            value += child.value;
          } else if (child.type === 'link') {
            value += child.children.map((grandchild) => grandchild.value).join('');
            // Optionally, handle the URL of the link
          }
          // Handle other types (e.g., emphasis) similarly
        });
        chunks.push({ type: 'paragraph', value });
      });

      // Handle images
      visit(tree, 'image', (node) => {
        chunks.push({ type: 'image', altText: node.alt, url: node.url });
      });

      // Handle lists
      visit(tree, 'listItem', (node, index, parent) => {
        let value = '';
        node.children.forEach((child) => {
          if (child.type === 'paragraph') {
            value += child.children.map((grandchild) => grandchild.value).join('');
          }
          // Handle other types or nested structures within list items
        });
        chunks.push({ type: 'listItem', value, ordered: parent.ordered });
      });
    });

    // Parse the markdown text to AST and run transformations
    const tree = processor.parse(markdownText);
    processor.runSync(tree);

    return chunks;
  }

  // Function to convert markdown to HTML
  markdownToHtml(markdownText) {
    const processor = unified()
      .use(remarkParse) // Parse the Markdown into a syntax tree
      .use(remarkRehype) // Turn the Markdown syntax tree into an HTML syntax tree
      .use(rehypeStringify); // Stringify the HTML syntax tree into HTML text

    const file = processor.processSync(markdownText);
    return String(file);
  }
}

export default MarkdownProcessor;
