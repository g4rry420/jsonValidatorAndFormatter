import React from 'react'

import "./input-textareas.styles.css"

export default function InputTextareas({ linesTextAreaRef, linesTextarea,
                                         textAreaRef, handleJsonTextarea,
                                         handleProcess, loadJsonFile,
                                         jsonTextarea,setLinesTextarea,
                                         inputRef, setJsonTextarea }) {

    const input_changed = (e) => {
        let linesTextArea = linesTextAreaRef.current;
        let countLines = count_lines(e.target.value);
        if(countLines === 0) countLines = 1;

        let previousLinesArray = linesTextArea.value.split("\n");
        let previousLines = parseInt(previousLinesArray[previousLinesArray.length - 1], 10);
        // if there was a change in line count
        if(countLines !== previousLines){
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
        <div className="textarea-sub-container">
            <textarea
                ref={linesTextAreaRef}
                className="rownr" 
                cols="3" 
                rows="20" 
                value={linesTextarea} 
                readOnly></textarea>
            <span className="user-textarea-container">
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

                    <svg onClick={() => setJsonTextarea("")} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    <span className="clear-span">Clear</span>

                    <input type="file" name="jsonFile" id="jsonFile" onChange={loadJsonFile}/>
                    <label htmlFor="jsonFile">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-file-earmark-code" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                            <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/>
                            <path fillRule="evenodd" d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <span className="load-file">Load File</span>
                    </label>
            </span>
            <label htmlFor="sel_in">Current Position</label>
            <input ref={inputRef} id="sel_in" readOnly type="text"/>

            <button onClick={handleProcess} className="btn my-3 btn-process">Process</button>    
        </div>
    )
}
