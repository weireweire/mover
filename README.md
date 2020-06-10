# Mover

Mover is an easy-to-learn editor for non heavy user of vim or emacs. It learned from vim/emacs and provides easyer keybindings. Spend five minutes reading this, and your coding efficiency will increase significantly.

## Features

* **Non-aggresive**: Retain the original functions and keybindings as much as possible. (So the ctrl+c and ctrl+v are safe.)

* **Easy**: The intuitive keybindings and consistency make it easy to master.

* **Efficient**: Avoid moving your hands far to the mouse, cursor keys, Ctrl, Esc, etc. Support both key combinations for quick edit and mode change for heavy edit.

## Usage

### **Level 1: Basic Cursor Move**

Most function is performed by alt combination keys. The basic cursor move keys are **alt+** follows:

```
       i(↑)

  j(←)  k(↓)  l(→)
```
This keeps the ralative positions of origin arrow keys. Except `alt+j` and `alt+l` means moving a word instead of a character.

In Mover, it's encouraged to move cursor by a long-distance key rather than several short-distance keys.

### **Level 2: Extended Cursor Move**

The extended cursor move keys are **alt+** follows:
```
 u(←character)  i(↑)        o(→character)

  j(←word)        k(↓)        l(→word)

   m(←home)        ,(↓newline) .(→end)
```

`alt+,` means inserting a newline bellow which is similar to the `o` key in vim. It's useful.

Congratulations! When come to here, you can start using Mover. Go and practice!

### **Level 3: Mode Change**

Mover has two modes: **Edit** and **Alt**. Mode changing is performed by press `alt+enter` key.
```
  enter(change mode)
```

Mover starts with Edit mode, in which you can type as usual and use Mover function with alt combination keys.

In Alt mode, you can't type and you can use Mover function without alt key. Besides `alt+enter`, you can also change to Edit mode by press alt combination keys when using Mover function.

Mover keeps the consistency, and all the `alt+(key)` function in Edit Mode equals to the single `(key)` function in Alt mode.

*In the following sections, `alt+` key in Edit Mode will not be noted.*

### **Level 4: Prepend With A Number**

Similar to vim, you can prepend with a number to repeat the command.

For example, `10i` means moving the cursor 10 lines up.

What's more,  `` ` `` key is used to represent "infinite". So `` `i `` means moving to the top.
`-` key is used for page scroll.(`-i` scroll up and `-k` scroll down.)

### **Level 5: Long-distance Motion**

```
w(←tab)    e(→editor)  r(→tab)

 s(←editor) d(→editor)  f(→editor)
```
Where `e d s f` can navigate between sub-window, such as splited editor. `w` and `r` change the tab page.

```
             p(go to defination) [(go back)        ](go foward)

 g(go to line)
```
Where `p` equals to `f12` in vscode. `[` and `]` equal to `alt+←` and `alt+→` in vscode.

### **Level 6: Select And Edit**
```
shift(select)
```
Similar to the origin usage, hold `shift` and move cursor means select. All Mover cursor move keys are supported here.

```
x(cut)   c(copy)   v(paste)   b(delete)
```
Mover retains the origin cut/copy/paste keybindings. However, because `ctrl` is a second class key in Mover, you can also use them by `alt`. `b` is newly added for delete.

single pressing `x/c/b` will take effect on selection, while double pressing will take effect on the current line.
`b` can chord with cursor keys. For example, `b j` means delete all left.

```
      y(redo)

z(undo)
```

```
esc(escape)
```
Remember esc can help you close various windows such as find widget. Try avoid using mouse.
## Extension Settings
todo

## Questions
### Where is the command mode?
There have been nice command mode in vscode. Try `ctrl+shift+p`.

### Some keys take no effect.
Check if there is a keybinding conflict.

### What about the origin alt function?
Most origin alt funtion take effect by press in sequence rather than combination.

