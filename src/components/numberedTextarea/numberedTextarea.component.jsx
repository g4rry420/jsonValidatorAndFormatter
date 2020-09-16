import React, { useState, useRef } from 'react'

export default function NumberedTextarea() {

    const [jsonTextarea, setJsonTextarea ] = useState("");
    const [linesTextarea, setLinesTextarea] = useState("");

    const linesTextAreaRef = useRef();
    const textAreaRef = useRef();
    const inputRef = useRef();

    const handleJsonTextarea = (e) => {
        setJsonTextarea(e.target.value);
    }

    const input_changed = (e) => {
        let linesTextArea = linesTextAreaRef.current;
        let countLines = count_lines(e.target.value);
        if(countLines == 0) countLines = 1;

        let previousLinesArray = linesTextArea.value.split("\n");
        let previousLines = parseInt(previousLinesArray[previousLinesArray.length - 1], 10);
        // if there was a change in line count
        if(countLines != previousLines){
            linesTextArea.cols = countLines.toString().length; // new width of first textarea
            populate_lines(countLines);
            scroll_sync(textAreaRef.current, linesTextArea);
        }

        selectionChanged(e.target, linesTextArea);

      }

      const scroll_sync = (textArea1, textArea2) => {
          // scroll text in object id1 the same as object id2
          textArea2.scrollTop = textArea1.scrollTop;
      }


      const populate_lines = (countLines) => {

          let tempLines = "";

          for (let index = 1; index <= countLines; index++) {
              tempLines += index.toString() + "\n"; 
          }
          setLinesTextarea(tempLines);
      }

      const selectionChanged = (textarea) => {

          let substring = textarea.value.substring(0, textarea.selectionStart).split("\n");
          let row = substring.length;
          let col = substring[substring.length - 1].length;
          let tempStr = `(${row.toString()},${col.toString()})`;
          // if selection spans over

          if(textarea.selectionStart !== textarea.selectionEnd) {
              substring = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).split("\n");
              row += substring.length - 1;
              col = substring[substring.length - 1].length;
              tempStr += `(${row.toString()},${col.toString()})`;
          }
          inputRef.current.value = tempStr;
      } 

    const keyup = (obj, e) => {


		if(e.keyCode >= 33 && e.keyCode <= 40) // arrows ; home ; end ; page up/down
            selectionChanged(obj, e.keyCode);
      }
    
    const count_lines = (txt) => {
        if(txt === "") {
            return 1;
        }

        return txt.split("\n").length + 1;

      }  

    return (
        <div>
            <textarea
                ref={linesTextAreaRef}
                className="rownr" 
                cols="3" 
                rows="20" 
                value={linesTextarea} 
                readOnly></textarea>
            <span>
            <textarea 
                ref={textAreaRef} onChange={handleJsonTextarea} 
                autoCapitalize="off" autoCorrect="off" 
                spellCheck={false} value={jsonTextarea} 
                row="20" cols="150"
                className="txt"
                onInput={input_changed}
                onScroll={(e) => scroll_sync(e.target, linesTextAreaRef.current)}
                onClick={(e) => selectionChanged(e.target)}
                onKeyUp={(e) => keyup(e.target, e)}
                nowrap="nowrap" wrap="off"
                placeholder="{  }"></textarea>
            </span>
            <label htmlFor="sel_in">Current Position</label>
            <input ref={inputRef} id="sel_in" readOnly type="text"/>
        </div>
    )
}
