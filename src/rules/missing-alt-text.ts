import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Image } from 'mdast';
import type { Rule, Diagnostic } from '../engine/rules.js';

export class MissingAltTextRule implements Rule {
    id = 'missing-alt-text';
    description = 'Ensures all images have descriptive alt text.';

    check(ast: Node, content: string): Diagnostic[] {
        const diagnostics: Diagnostic[] = [];

        visit(ast, 'image', (node: Image) => {
            if (!node.alt || node.alt.trim() === '') {
                diagnostics.push({
                    ruleId: this.id,
                    message: `Missing alt text for image: ${node.url}`,
                    line: node.position?.start.line,
                    column: node.position?.start.column,
                    severity: 'warning',
                });
            }
        });

        return diagnostics;
    }
}
