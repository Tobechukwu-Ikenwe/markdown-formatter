import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MarkdownProcessor } from './engine/processor.js';
import { TrailingWhitespaceRule } from './rules/trailing-whitespace.js';
import { HeadingLevelsRule } from './rules/heading-levels.js';
import { MissingAltTextRule } from './rules/missing-alt-text.js';
import { BrokenLinksRule } from './rules/broken-links.js';

export async function runCli() {
    const program = new Command();

    program
        .name('md-lint')
        .description('A futuristic Markdown linter and formatter')
        .version('1.0.0')
        .argument('<pattern>', 'Glob pattern for files to lint')
        .option('--fix', 'Automatically fix safe issues', false)
        .action(async (pattern, options) => {
            const files = await glob(pattern, { ignore: 'node_modules/**' });

            if (files.length === 0) {
                console.log(chalk.yellow('No files found matching the pattern.'));
                return;
            }

            console.log(chalk.cyan(`Linting ${files.length} files...\n`));

            const processor = new MarkdownProcessor();
            processor.addRule(new TrailingWhitespaceRule());
            processor.addRule(new HeadingLevelsRule());
            processor.addRule(new MissingAltTextRule());

            let totalDiagnostics = 0;
            let filesWithIssues = 0;

            for (const file of files) {
                const absolutePath = path.resolve(file);
                const baseDir = path.dirname(absolutePath);

                // Add broken links rule with the current file's base dir
                const localProcessor = new MarkdownProcessor();
                localProcessor.addRule(new TrailingWhitespaceRule());
                localProcessor.addRule(new HeadingLevelsRule());
                localProcessor.addRule(new MissingAltTextRule());
                localProcessor.addRule(new BrokenLinksRule(baseDir));

                const content = await fs.readFile(absolutePath, 'utf8');
                const result = await localProcessor.process(file, content);

                if (result.diagnostics.length > 0) {
                    filesWithIssues++;
                    totalDiagnostics += result.diagnostics.length;

                    console.log(chalk.whiteBright.underline(file));

                    for (const d of result.diagnostics) {
                        const color = d.severity === 'error' ? chalk.red : chalk.yellow;
                        console.log(
                            `  ${chalk.gray(`${d.line}:${d.column}`)}  ${color(d.severity)}  ${d.message}  ${chalk.gray(d.ruleId)}`
                        );
                    }

                    if (options.fix) {
                        const fixedContent = await localProcessor.applyFixes(content, result.diagnostics);
                        if (fixedContent !== content) {
                            await fs.writeFile(absolutePath, fixedContent, 'utf8');
                            console.log(chalk.green(`  ✔ Fixed issues in ${file}`));
                        }
                    }
                    console.log('');
                }
            }

            if (totalDiagnostics === 0) {
                console.log(chalk.green.bold('✨ No issues found! Your documentation is pristine.'));
            } else {
                console.log(
                    chalk.bold(
                        `\nSummary: Found ${totalDiagnostics} issues in ${filesWithIssues} files.`
                    )
                );
                if (!options.fix) {
                    console.log(chalk.gray('Run with --fix to automatically correct safe issues.'));
                }
            }
        });

    await program.parseAsync(process.argv);
}
