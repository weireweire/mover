import * as vscode from "vscode";


export enum MoverMode {
	Edit = "Edit",
	Alt = "Alt",
	Disabled = "Disabled",
  }


export class MoverState implements vscode.Disposable {
	
	private static _statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		Number.MIN_SAFE_INTEGER 
	  );

	private static _currentMode: MoverMode = MoverMode.Edit;

	public static get currentMode(): MoverMode {
	  return MoverState._currentMode;
	}

	public static async setCurrentMode(mode: MoverMode): Promise<void> {

		MoverState._currentMode = mode;
		vscode.commands.executeCommand('setContext', "mover.mode", MoverMode[mode]);

		const editor = vscode.window.activeTextEditor;

		if(editor){
			if (mode === MoverMode.Edit) {
				editor.options.cursorStyle = vscode.TextEditorCursorStyle.Line;
			} else if (mode === MoverMode.Alt) {
				editor.options.cursorStyle = vscode.TextEditorCursorStyle.Block;
			}
		}

		MoverState._statusBar.text = "|" + mode.toString() + " Mode|";
		MoverState._statusBar.show();
	}

	public static current_num_str="";

	public static getCurrentNum(){
		let num = 1;
		let is_inf = false;
		let is_fixed = false;
		if(MoverState.current_num_str){
			if(MoverState.current_num_str.indexOf("`") !== -1){
				is_inf = true;
			} else if(MoverState.current_num_str.indexOf("-") !== -1){
				is_fixed = true;
			}else{
				num = parseInt(MoverState.current_num_str);
			}
		}
		return {"num": num, "is_inf": is_inf, "is_fixed": is_fixed};
	}

	public static cleanCurrentNum(){
		MoverState.current_num_str="";
	}

	dispose(){
		
	}

}
