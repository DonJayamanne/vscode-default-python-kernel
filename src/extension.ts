// This method is called when your extension is activated

import { ExtensionContext, Uri, commands, extensions, window, workspace } from 'vscode';
import * as fs from 'fs-extra';
import { computeHash } from './crypto';
import { EnvironmentPath, PythonExtension } from '@vscode/python-extension';

type JupyterApi = {
    openNotebook(uri: Uri, env: EnvironmentPath): Promise<void>;
};

// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
    const outputChannel = window.createOutputChannel('Default Python Kernel', { log: true });
    if (!(await fs.pathExists(context.globalStorageUri.fsPath))) {
        await fs.ensureDir(context.globalStorageUri.fsPath);
    }
    const pythonApi = PythonExtension.api();
    workspace.onDidOpenNotebookDocument(
        async (e) => {
            if (e.notebookType !== 'jupyter-notebook') {
                return;
            }
            const activeEnvPromise = pythonApi.then((api) => api.environments.getActiveEnvironmentPath(e.uri));
            const hash = await computeHash(e.uri.fsPath, 'SHA-512');
            const cachePath = Uri.joinPath(context.globalStorageUri, `${hash}.txt`);
            if (await fs.pathExists(cachePath.fsPath)) {
                // We've changed the kernel before, so we need to change it back
                outputChannel.info(`Not changing kernel for ${e.uri.fsPath} because we have changed it before`);
                return;
            }
            const activeEnv = await activeEnvPromise;
            if (!activeEnv) {
                outputChannel.info(`Not changing kernel for ${e.uri.fsPath} as there is not active Python Environment`);
                return;
            }
            outputChannel.info(`Changing kernel for ${e.uri.fsPath} to ${activeEnv.id}`);
            extensions
                .getExtension<JupyterApi>('ms-toolsai.jupyter')
                ?.exports?.openNotebook(e.uri, activeEnv)
                .then(() => {
                    fs.appendFile(cachePath.fsPath, '').catch((ex) => {
                        outputChannel.error(`Failed to write to cache ${cachePath.fsPath}`, ex);
                    });
                })
                .catch((ex) =>
                    outputChannel.error(`Failed to change kernel for ${e.uri.fsPath} to ${activeEnv.id}`, ex)
                );
        },
        undefined,
        context.subscriptions
    );
}
