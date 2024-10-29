import { Section } from '@/app/store/discoAITypes';

export function convertToDoc(sections: Section[]): string {
  if (!sections || sections.length === 0) {
    throw new Error('No sections provided to convert to document');
  }

  let doc = `# About ${sections[0].title}\n\n`;

  sections.forEach((section) => {
    if (!section.content) {
      console.warn(`Section "${section.title}" has no content`);
      return;
    }

    doc += `## ${section.title}\n\n`;

    const lines = section.content.split('\n');

    lines.forEach((line) => {
      if (line.startsWith('#')) {
        // Count the number of '#' at the start of the line
        const headingLevel = line.match(/^#+/)?.[0]?.length || 0;
        // Ensure the heading level doesn't exceed 6
        const adjustedLevel = Math.min(headingLevel, 6);
        line = '#'.repeat(adjustedLevel) + line.slice(headingLevel);
      }

      // Limit list nesting to 6 levels
      if (line.match(/^\s*[-*+]\s/)) {
        const indent = line.match(/^\s*/)?.[0]?.length || 0 ;
        const maxIndent = 12; // 6 levels * 2 spaces per level
        if (indent > maxIndent) {
          line = ' '.repeat(maxIndent) + line.trim();
        }
      }

      doc += line + '\n';
    });

    doc += '\n';

    // Add sources if available
    if (section.sources && section.sources.length > 0) {
      doc += '### Sources\n\n';
      section.sources.forEach((source) => {
        doc += `- [${source.title}](${source.url})\n`;
        if (source.explanation) {
          doc += `  ${source.explanation}\n`;
        }
      });
      doc += '\n';
    }
  });

  return doc;
}