import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('int-maxer.convert', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;

        if (document.languageId !== 'cpp') {
            vscode.window.showErrorMessage('This extension only works with C++ files.');
            return;
        }

        const text = document.getText();

        const typeMap: { [key: string]: string } = {
            'int8_t': 'int64_t',
            'uint8_t': 'uint64_t',
            'int16_t': 'int64_t',
            'uint16_t': 'uint64_t',
            'int32_t': 'int64_t',
            'uint32_t': 'uint64_t'
        };

        let transformedText = text;

        for (const [key, value] of Object.entries(typeMap)) {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            transformedText = transformedText.replace(regex, value);
        }

        await editor.edit(editBuilder => {
            const entireRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editBuilder.replace(entireRange, transformedText);
        });

        vscode.window.showInformationMessage('All variable types have been maximized!');
    });

    context.subscriptions.push(disposable);

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '$(symbol-variable) Maximize Types';
    statusBar.command = 'int-maxer.convert';
    statusBar.show();

    context.subscriptions.push(statusBar);
}

export function deactivate() {}
