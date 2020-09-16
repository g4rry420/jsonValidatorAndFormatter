import React,{ useState, useRef, useEffect } from 'react'

import "./main-section.styles.css"

export default function MainSection() {
    const [jsonTextarea, setJsonTextarea] = useState("");
    const [errorPosition, setErrorPosition] = useState(1);
    const [linesTextarea, setLinesTextarea] = useState("1");
    const [validOrError, setValidOrError] = useState("");

    const errorMessage = useRef();
    const textAreaRef = useRef();
    const resultMainContainer = useRef();
    const resultRefContainer = useRef();
    const linesTextAreaRef = useRef();
    const inputRef = useRef();
    const messageRef = useRef();


    useEffect(() => {
        let lines = textAreaRef.current.value.split("\n");
        let countForErrorLine = errorPosition;
        resultRefContainer.current.textContent = "";

        for (let index = 1; index < lines.length; index++) {
            if(index === countForErrorLine){
                let mark = document.createElement("mark");
                mark.classList.add("error-text");
                mark.textContent = lines[index];

                resultRefContainer.current.append(mark);
                resultRefContainer.current.append("\n");
                countForErrorLine++;

            }else if(index !== countForErrorLine){

                resultRefContainer.current.append(lines[index]);
                resultRefContainer.current.append("\n");
            }
        }
    }, [ errorPosition])

    const handleJsonTextarea = (e) => {
        setJsonTextarea(e.target.value);
    }

    const handleProcess = () => {
        
        let str = jsonTextarea;

        if(!str) return;

        resultRefContainer.current.textContent = "";

        try {
        JSON.parse(str);

        let correctJsonData = JSON.stringify(JSON.parse(str), null, 4); // spacing level = 4
        correctOutputJson(syntaxHighlighter(correctJsonData));

        setValidOrError("Valid JSON");

        errorMessage.current.textContent = '';

        messageRef.current.classList.remove("color-error")
        messageRef.current.classList.add("color-valid");

        } catch (error) {
            setValidOrError("Invalid JSON")
            errorMessage.current.append(error.message);
            messageRef.current.classList.remove("color-valid")
            messageRef.current.classList.add("color-error")

            const number =  error.message.slice(error.message.indexOf("line") + 4, error.message.indexOf("line") + 8);
            selectTextareaLine(textAreaRef.current, parseInt(number))
        }

        resultMainContainer.current.classList.add("active-resultMainContainer")

    }

    const correctOutputJson = (string) => {
        resultRefContainer.current.innerHTML =  string;
    } 

    const syntaxHighlighter = (json) => {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
             function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                
                return '<span class="' + cls + '">' + match + '</span>';
            });
    }

    const selectTextareaLine = (tarea,lineNum) => {
        lineNum--; // array starts at 0
        let lines = tarea.value.split("\n");
    
    
        // calculate start/end
        let startPos = 0, endPos = tarea.value.length;
        let mainPos = 0;
        for(let x = 0; x < lines.length; x++) {
            if(x === lineNum) {
                mainPos += x;
                break;
            }
            startPos += (lines[x].length + 1);
    
        }

        setErrorPosition(mainPos);
    
        endPos = lines[lineNum].length + startPos;
    
        // do selection
        // Chrome / Firefox
        
        //to focus selection on current textarea

        // if(typeof(tarea.selectionStart) !== "undefined") {
        //     tarea.focus();
        //     tarea.selectionStart = startPos;
        //     tarea.selectionEnd = tarea.textLength;
    
        //     let selected = tarea.value.slice(tarea.selectionStart, tarea.selectionEnd)
        //     let notSelected = tarea.value.slice(0, tarea.selectionStart - 1)
        // }
    
    
        // IE
        // if (document.selection && document.selection.createRange) {
        //     tarea.focus();
        //     tarea.select();
        //     let range = document.selection.createRange();
        //     range.collapse(true);
        //     range.moveEnd("character", endPos);
        //     range.moveStart("character", startPos);
        //     range.select();
        //     return true;
        // }
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

      const loadJsonFile = (e) => {

          let fr = new FileReader();
          fr.onload = () => {
              setJsonTextarea(fr.result);
          }
          fr.readAsText(e.target.files[0]);
      }

    return (
        <main className="container-fluid">
            <div className="my-5 container">
                <div className="textarea-container">
                    <div className="text-left">
                        <h4>Json Data/Url</h4>
                    </div>
                    <div className="">
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

                    <div ref={resultMainContainer} className="resultMainContainer">
                        <div ref={messageRef} className="main-message my-4">
                            <h3 className="display-4 text-center message-heading">{validOrError}</h3>
                            <div ref={errorMessage} className="error-message">
                            {
                                validOrError === "Invalid JSON" ? (
                                    <div className="mx-3">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                        </svg>
                                    </div>
                                ) : null
                            }
                            </div>
                        </div>
                        <pre ref={resultRefContainer} className="resultContainer">
                        </pre>
                    </div>


                </div>
            </div>
        </main>
    )
}