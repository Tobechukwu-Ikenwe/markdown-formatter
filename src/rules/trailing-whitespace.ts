import type { Node } from 'unist';
import type { Rule, Diagnostic } from '../engine/rules.js';

export class TrailingWhitespaceRule implements Rule {
    id = 'trailing-whitespace';
    description = 'Detects and removes trailing whitespace at the end of lines.';

    check(ast: Node, content: string): Diagnostic[] {
        const diagnostics: Diagnostic[] = [];
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(/\s+$/);

            if (match) {
                // Find the absolute start position in the original content
                // This is a bit tricky with split content, but we can do it by counting
                let startPos = 0;
                for (let j = 0; j < i; j++) {
                    startPos += lines[j].length + 1; // +1 for newline
                }
                startPos += match.index!;

                diagnostics.push({
                    ruleId: this.id,
                    message: 'Trailing whitespace detected.',
                    line: i + 1,
                    column: match.index! + 1,
                    severity: 'warning',
                    fix: {
                        range: [startPos, startPos + match[0].length],
                        text: '',
                    },
                });
            }
        }

        return diagnostics;
    }
}
