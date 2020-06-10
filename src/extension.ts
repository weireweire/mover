import * as vscode from 'vscode';
import {handle_key} from "./mover_handlekeys";
import {MoverState, MoverMode} from "./mover_state";

interface VSCodeKeybinding {
	key: string;
	mac?: string;
	linux?: string;
	command: string;
	when: string;
  }

const packagejson: {
	contributes: {
	  keybindings: VSCodeKeybinding[];
	};
  } = require('../package.json');




export function activate(context: vscode.ExtensionContext) {

	MoverState.setCurrentMode(MoverMode.Edit);

	vscode.commands.registerCommand('type', async (args) => {
		if (MoverState.currentMode === MoverMode.Alt){
			handle_key(args.text);
		}else{
			vscode.commands.executeCommand("default:type", args);
		}
	});

    for (let keybinding of packagejson.contributes.keybindings) {
		if(keybinding.command.startsWith("mover.combination")){
			vscode.commands.registerCommand(keybinding.command, () => {handle_key(keybinding.key);});
		}
	  }

	vscode.commands.registerCommand('state.change2Edit', () => {
		MoverState.setCurrentMode(MoverMode.Edit);
	});

	vscode.commands.registerCommand('state.change2Alt', () => {
		MoverState.setCurrentMode(MoverMode.Alt);
	});

	vscode.commands.registerCommand('state.changeMode', () => {
		if(MoverState.currentMode === MoverMode.Edit){
			MoverState.setCurrentMode(MoverMode.Alt);
		}else if(MoverState.currentMode === MoverMode.Alt){
			MoverState.setCurrentMode(MoverMode.Edit);
		}
	});

}

export function deactivate() {}
