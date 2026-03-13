import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Heading } from 'mdast';
import type { Rule, Diagnostic } from '../engine/rules.js';

export class HeadingLevelsRule implements Rule {
    id = 'heading-levels';
    description = 'Ensures heading levels are consistent (no skipping levels).';

    check(ast: Node, content: string): Diagnostic[] {
        const diagnostics: Diagnostic[] = [];
        let lastLevel = 0;

        visit(ast, 'heading', (node: Heading) => {
            const currentLevel = node.depth;

            if (currentLevel > lastLevel + 1 && lastLevel !== 0) {
                diagnostics.push({
                    ruleId: this.id,
                    message: `Inconsistent heading level: H${currentLevel} follows H${lastLevel}.`,
                    line: node.position?.start.line,
                    column: node.position?.start.column,
                    severity: 'warning',
                    // Auto-fix could potentially lower the level, but that's risky without context.
                    // For now, let's just report it.
                });
            }
            lastLevel = currentLevel;
        });

        return diagnostics;
    }
}
