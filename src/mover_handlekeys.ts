import * as vscode from 'vscode';
import {MoverState, MoverMode} from "./mover_state";

// add new keybindings here
let cmd_func: CmdFuncDict = {
	"b i":
	() =>{
		const editor = vscode.window.activeTextEditor;
		let current_num = MoverState.getCurrentNum();
		if(editor){
			let del_start = Math.max(editor.selection.active.line - current_num.num, 0);
			if(current_num.is_inf){
				del_start = 0;
			}
			editor.edit((editBuilder) => {
				editBuilder.delete(new vscode.Range(
					new vscode.Position(del_start, 0),
					new vscode.Position(editor.selection.active.line, 0)
				));
				});
		}
	},
	"b k":
	() =>{
		const editor = vscode.window.activeTextEditor;
		let current_num = MoverState.getCurrentNum();

		if(editor){
			let del_start_row = editor.selection.active.line;
			let del_start_col = editor.document.lineAt(del_start_row).range.end.character;

			let del_end_row = editor.selection.active.line + current_num.num;
			if(current_num.is_inf){
				del_end_row = editor.document.lineCount - 1;
			}
			let del_end_col = editor.document.lineAt(del_end_row).range.end.character;

			vscode.window.activeTextEditor!.edit((editBuilder) => {
				editBuilder.delete(new vscode.Range(
					new vscode.Position(del_start_row, del_start_col),
					new vscode.Position(del_end_row, del_end_col)
				));
				});
		}
	},
	"c c": 
	() =>{
		const editor = vscode.window.activeTextEditor;

		if(editor){
			let txt = editor.document.lineAt(editor.selection.active.line).text;
			vscode.env.clipboard.writeText(txt+"\n");
		}
	},
	"x x":
	() => {
		const editor = vscode.window.activeTextEditor;

		if(editor){
			let txt = editor.document.lineAt(editor.selection.active.line).text;
			vscode.env.clipboard.writeText(txt+"\n");
			vscode.commands.executeCommand("editor.action.deleteLines");
		}
	},
};

interface CmdDict {
	[propName: string] : string;
}

var cursor_cmd : CmdDict = {
	"i": "cursorUp",
	"k": "cursorDown",
	",": "editor.action.insertLineAfter",

	"u": "cursorLeft",
	"j": "cursorWordStartLeft",
	"m": "cursorHome",

	"o": "cursorRight",
	"l": "cursorWordStartRight",
	".": "cursorEnd",


};
var easy_cmd: CmdDict = {
	",": "insertLineAfter",
	"f": "workbench.action.navigateRight",
	"r": "workbench.action.nextEditor",
	"s": "workbench.action.navigateLeft",
	"w": "workbench.action.previousEditor",
	"e": "workbench.action.navigateUp",
	"d": "workbench.action.navigateDown",

	"c":"editor.action.clipboardCopyAction",
	"v":"editor.action.clipboardPasteAction",
	"b":"deleteRight",
	"b b": "editor.action.deleteLines",
	"b j": "deleteWordLeft",
	"b l": "deleteWordRight",
	"b m": "deleteAllLeft",
	"b o": "deleteRight",
	"b u": "deleteLeft",
	"b .": "deleteAllRight",
	"]": "workbench.action.navigateForward",
	"[": "workbench.action.navigateBack",
	"p": "editor.action.revealDefinition",
	"z": "undo",
	"y": "redo",
	"g": "workbench.action.gotoLine",
	"x": "editor.action.clipboardCutAction"
};


interface CmdFuncDict{
	[propName: string] : () =>void
} 

let cmd2inf: CmdDict = {
	"cursorUp": "cursorTop",
	"cursorDown": "cursorBottom",
	"cursorLeft": "cursorHome",
	"cursorWordStartLeft": "cursorHome",
	"cursorRight" : "cursorEnd",
	"cursorWordStartRight": "cursorEnd",
	"cursorPageUp": "cursorTop",
	"cursorPageDown": "cursorBottom",
	"workbench.action.navigateRight": "workbench.action.lastEditorInGroup",
	"workbench.action.navigateLeft": "workbench.action.openEditorAtIndex1"
};

let cmd2fixed: CmdDict = {
	"cursorUp": "cursorPageUp",
	"cursorDown": "cursorPageDown",
};

let repeatable = new Set<string> (["c", "d", "e", "f", "h", "i", "j", "k", "l", "p",
									"r", "s", "v", "w", "y", "z", ",", "]", "[",
									"b b", "b j", "b l", "b m", "b o", "b u", "b ."]);


class ParsedKey{
	modifiers:Array<string> = [];
	key: string = "";

	public has(modifier:string):boolean {
		return (-1 !== this.modifiers.indexOf(modifier));
	};
}

class ParsedKeys{

	elems:Array<ParsedKey> = [];

	public joined_key():string {
		let joined_key = "";
		for(let elem of this.elems){
			joined_key += elem.key + " ";
		}
		return joined_key.substr(0, joined_key.length - 1);
	}

	public all_has(modifier:string):boolean {
		let all_has = true;
		for(let elem of this.elems){
			all_has = all_has && elem.has(modifier);
		}
		return all_has;
	}

	public has(modifier:string):boolean {
		let all_has = false;
		for(let elem of this.elems){
			all_has = all_has || elem.has(modifier);
		}
		return all_has;
	}
}

function parse_key(key_str:string):ParsedKeys {

	let parsed_keys = new ParsedKeys();
	let modifiers = [];

	for(let elem of key_str.split(" ")){  // chord
		let parsed_key = new ParsedKey();
		let key;
		modifiers = elem.split("+");
		if(key = modifiers.pop()){
			parsed_key.key = key;
		}

		parsed_key.modifiers = modifiers;
		parsed_keys.elems.push(parsed_key);
	}

	return parsed_keys;
}


export function handle_key(args:string):void{

	let parsed_keys = parse_key(args);
	let key_str = parsed_keys.joined_key().toLowerCase();	
	let func;

	if(key_str >= "0" && key_str <= "9" || key_str === "`" || key_str === "-"){
		MoverState.current_num_str += key_str;
		return;
	}
	let current_num = MoverState.getCurrentNum();
	let num = current_num.num;

	function change_for_num(ori_cmd: string){
		if(current_num.is_inf && cmd2inf[ori_cmd]){
			return cmd2inf[ori_cmd];
		}else if(current_num.is_fixed && cmd2fixed[ori_cmd]){
			return cmd2fixed[ori_cmd];
		}
		return ori_cmd;
	}

	if(cursor_cmd[key_str] || easy_cmd[key_str]){


		let cmd:string;
		if(cmd = cursor_cmd[key_str]){
			cmd = change_for_num(cmd);

			if(parsed_keys.all_has("shift")){
				cmd += "Select";
			}
		}
		else if(cmd = easy_cmd[key_str]){
			cmd = change_for_num(cmd);
		}	

		func = () => {vscode.commands.executeCommand(cmd);};
		
	}
	else if(cmd_func[key_str]){
		func = cmd_func[key_str];
	}
	else{
		return;
	}

	if(repeatable.has(key_str))
	{
		for(let i = 0; i < num; i++){
			func();
		}
	}
	else{
		func();
	}

	MoverState.cleanCurrentNum();
	if(parsed_keys.has("alt")){
		MoverState.setCurrentMode(MoverMode.Edit);
	}

}
