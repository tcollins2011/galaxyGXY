import  MarkdownProcessor  from '../../../src/services/markdownProcessingService.js';

describe('MarkdownProcessor', () => {
    let processor;
  
    beforeEach(() => {
        processor = new MarkdownProcessor();
    });
  
    test('should convert markdown heading to HTML', () => {
        const markdown = '# Heading 1';
        const expectedHtml = '<h1>Heading 1</h1>';
        const html = processor.markdownToHtml(markdown);
        expect(html).toBe(expectedHtml);
    });
  
    test('should extract semantic chunks from markdown', () => {
        const markdown = '# Heading\nSome paragraph text.';
        const expectedChunks = [
        { type: 'heading', depth: 1, value: 'Heading' },
        { type: 'paragraph', value: 'Some paragraph text.' }
        ];
        const chunks = processor.extractSemanticChunks(markdown);
        expect(chunks).toEqual(expectedChunks);
    });

    test('should extract image alt text and URL from markdown', () => {
        const markdown = '![Alt text](http://example.com/image.png)';
        const expectedChunks = { type: 'image', altText: 'Alt text', url: 'http://example.com/image.png' };
        const chunks = processor.extractSemanticChunks(markdown);
        expect(chunks[1]).toEqual(expectedChunks);
    });

    test('should extract items from an unordered list in markdown', () => {
        const markdown = '- Item 1\n- Item 2\n- Item 3';
        const expectedChunks = [
            { type: 'paragraph', value: 'Item 1' },
            { type: 'paragraph', value: 'Item 2' },
            { type: 'paragraph', value: 'Item 3' },
            { type: 'listItem', value: 'Item 1', ordered: false },
            { type: 'listItem', value: 'Item 2', ordered: false },
            { type: 'listItem', value: 'Item 3', ordered: false }
        ];
        const chunks = processor.extractSemanticChunks(markdown);
        expect(chunks).toEqual(expectedChunks);
    });

    test('should extract items from an ordered list in markdown', () => {
        const markdown = '1. Item 1\n2. Item 2\n3. Item 3';
        const expectedChunks = [
          { type: 'paragraph', value: 'Item 1' },
          { type: 'paragraph', value: 'Item 2' },
          { type: 'paragraph', value: 'Item 3' },
          { type: 'listItem', value: 'Item 1', ordered: true },
          { type: 'listItem', value: 'Item 2', ordered: true },
          { type: 'listItem', value: 'Item 3', ordered: true }
        ];
        const chunks = processor.extractSemanticChunks(markdown);
        expect(chunks).toEqual(expectedChunks);
    });

    test('should handle nested structures in markdown', () => {
        const markdown = `# Heading
        Some paragraph with a [link](http://example.com).
        
        - List item 1 with **bold text**
        - List item 2 with *italic text*
        
        ![Alt text for an image](http://example.com/image.png)
        `;        
        const expectedChunks = [
          { type: 'heading', depth: 1, value: 'Heading' },
          { type: 'paragraph', value: 'Some paragraph with a link.' },
          { type: 'listItem', value: 'List item 1 with bold text', ordered: false },
          { type: 'listItem', value: 'List item 2 with italic text', ordered: false },
          { type: 'image', altText: 'Alt text for an image', url: 'http://example.com/image.png' }
        ];
        const chunks = processor.extractSemanticChunks(markdown);
        expect(chunks).toEqual(expect.arrayContaining(expectedChunks));
    });

});