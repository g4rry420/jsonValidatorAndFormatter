import React,{ useState, useRef, useEffect } from 'react'

import "./main-section.styles.css"
import InputTextareas from '../input-textareas/input-textareas.component';

export default function MainSection() {
    const [jsonTextarea, setJsonTextarea] = useState("");
    const [errorPosition, setErrorPosition] = useState(1);
    const [linesTextarea, setLinesTextarea] = useState("1");
    const [validOrError, setValidOrError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

        setErrorMessage("");

        let correctJsonData = JSON.stringify(JSON.parse(str), null, 4); // spacing level = 4
        correctOutputJson(syntaxHighlighter(correctJsonData));

        setValidOrError("Valid JSON");

        messageRef.current.classList.remove("color-error");

        messageRef.current.classList.add("color-valid");

        } catch (error) {
            setValidOrError("Invalid JSON");
            setErrorMessage(error.message);
            messageRef.current.classList.remove("color-valid");
            messageRef.current.classList.add("color-error");

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
        let startPos = 0;
        let endPos = tarea.value.length;
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

                    <InputTextareas linesTextAreaRef={linesTextAreaRef} linesTextarea={linesTextarea}
                                    textAreaRef={textAreaRef} handleJsonTextarea={handleJsonTextarea}
                                    handleProcess={handleProcess} loadJsonFile={loadJsonFile}
                                    inputRef={inputRef} jsonTextarea={jsonTextarea}
                                    setJsonTextarea={setJsonTextarea} setLinesTextarea={setLinesTextarea} />

                    <div ref={resultMainContainer} className="resultMainContainer">
                        <div ref={messageRef} className="main-message my-4">
                            <h3 className="display-4 text-center message-heading">{validOrError}</h3>
                            <div className="error-message">
                            {
                                validOrError === "Invalid JSON" ? (
                                    <div className="mx-3">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                        </svg>
                                    </div>
                                ) : null
                            }
                            {errorMessage}
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