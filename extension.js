"use strict";

let vscode = require('vscode');

function activate(context) {

    let createScopedFixtureDisposable = vscode.commands.registerCommand('extension.createScopedFixture', () => {
        const fixtureScopes = vscode.workspace.getConfiguration("pytestHelper")["availableFixtureScopes"];

        vscode.window.showQuickPick(fixtureScopes, {placeHolder: "Select scope for the new fixture"}).then(value => {
            vscode.window.showInformationMessage(value);
        });
    });

    context.subscriptions.push(createScopedFixtureDisposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;