"use strict";

let vscode = require('vscode');

const scopedFixtureTemplate = "@pytest.fixture(scope=\"${fixtureScope}\")\n" +
"def ${functionName}():\n" + 
"\tpass\n";

let insertText = (value) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor){
        vscode.window.showErrorMessage("Can't insert text becuase you are not on a document..");
        return;
    }

    let selection = editor.selection;
    let range = new vscode.Range(selection.start, selection.end);

    editor.edit((editBuilder) => {
        editBuilder.replace(range, value)
    });
};

let isTextInCurrentDocument = (textToSearch) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor){
        vscode.window.showErrorMessage("Can't insert text becuase you are not on a document..");
        return;
    }
    let documentText = editor._documentData.getText();

    return documentText.search(textToSearch) >= 0 ? true : false;
};

let getMatchesOfTextInString = (texToSearh, string) => {
    let stringToCheck = string;
    let result = [];
    while(true){
        let indexOfText = stringToCheck.indexOf(texToSearh);
        if (indexOfText >= 0){
            if(result.length > 0){
                result.push(indexOfText + result[result.length - 1] + 1);
            }else{
                result.push(indexOfText);
            }
            stringToCheck = stringToCheck.substring(indexOfText + 1);
        }else{
            return result;
        }
    }
};

let getLastMatchOfTextInString = (texToSearh, string) => {
    return getMatchesOfTextInString(texToSearh, string).pop();
};

let findClosestCarriageReturnOfIndex = (index, string) => {
    return string.substring(index + 1).search("\n");
};

let createScopedFixtureFromTemplate = (fixtureScope, functionName) =>{
    let response = scopedFixtureTemplate.replace("${fixtureScope}", fixtureScope);
    return response.replace("${functionName}", functionName);
};

function activate(context) {

    let createScopedFixtureDisposable = vscode.commands.registerCommand('extension.createScopedFixture', () => {
        const fixtureScopes = vscode.workspace.getConfiguration("pytestHelper")["availableFixtureScopes"];

        let selectedScope;
        vscode.window.showQuickPick(fixtureScopes, {placeHolder: "Select scope for the new fixture."}).then(value => {
            selectedScope = value;
            return vscode.window.showInputBox({prompt: "Please provide the name of the function."}).then(value => {
                insertText(createScopedFixtureFromTemplate(selectedScope, value));
            });
        });
    });

    context.subscriptions.push(createScopedFixtureDisposable);

    let addMarkToCurrentFile = vscode.commands.registerCommand('extension.addMarkToCurrentFile', () => {
        if(isTextInCurrentDocument("mark")){
            vscode.window.showErrorMessage("The current file is marked.");
            return;
        }

        if(isTextInCurrentDocument("import pytest")){
            
        }
        // vscode.window.showInputBox({prompt: "Please provide the name of the mark."}).then(value => {
        //     if(isTextInCurrentDocument(value)){
        //         vscode.window.showErrorMessage("")
        //     }
        // });
    });

    context.subscriptions.push(addMarkToCurrentFile);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;