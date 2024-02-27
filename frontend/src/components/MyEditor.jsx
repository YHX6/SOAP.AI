import React, {useState, useCallback, useImperativeHandle, forwardRef, useEffect} from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState, Modifier, SelectionState  } from 'draft-js';
import { GithubPicker, SketchPicker } from 'react-color';

import iconAlignCenter from "../assets/icons/align_center.svg";
import iconAlignLeft from "../assets/icons/align_left.svg";
import iconAlignRight from "../assets/icons/align_right.svg";
import iconBold from "../assets/icons/bold.svg";
import iconItalics from "../assets/icons/italics.svg";
import iconUnderScore from "../assets/icons/underscore.svg";
import iconOderedList from "../assets/icons/ordered_list.svg";
import iconUnoderedList from "../assets/icons/unordered_list.svg";
import iconFontColor from "../assets/icons/font-colors.svg";
import iconAI from "../assets/icons/ai.svg";

// you might need to adjust the path to css file
import "../assets/css/draft-editor.css";

// tailwind css
import { Select, Option } from "@material-tailwind/react";


const MyEditor = forwardRef((props, ref)  =>{
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [cursorStyle, setCursorStyle] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('black');
  const [lastColor, setLastColor] = useState("N/A");
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("")
  const [customizedOption, setCustomizedOption] = useState("");
  const [AIprompt, setAIprompt] = useState("");
  // render init data
  useEffect(() => {
    if(props.rawContent && Object.keys(props.rawContent).length !== 0){
      setContentFromRaw(props.rawContent);
    }else if(props.textContent){
        setContentFromText(props.textContent);
    }
    
  }, [])



  /////////////////////////////////////////////////////////
  // get style of current content
  const getStylesAtCursor = (editorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    let style = {};

    if (!selection.isCollapsed()) {
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const blockWithStart = currentContent.getBlockForKey(startKey);
      style = blockWithStart.getInlineStyleAt(startOffset);  // if bold, italic
      style = style.toArray(); 
      // font family and size
      const metadata = blockWithStart.getData();  
      style.push(metadata.get("fontSize"));  
      style.push(metadata.get("fontFamily"));
      // if is ordered/unordered list
      const blockType = blockWithStart.getType();
      if (blockType ) {
        style.push(blockType);
      } 

    } else {
      const focusKey = selection.getFocusKey();
      const focusOffset = selection.getFocusOffset();
      const blockWithFocus = currentContent.getBlockForKey(focusKey);
      style = blockWithFocus.getInlineStyleAt(Math.max(focusOffset - 1, 0));  // if bold, italic
      style = style.toArray(); 
       // font family and size
      const metadata = blockWithFocus.getData();
      style.push(metadata.get("fontSize"));
      style.push(metadata.get("fontFamily"));
      // if is ordered/unordered list
      const blockType = blockWithFocus.getType();
      if (blockType ) {
        style.push(blockType);
      } 
    }


    //  text align type
    let alignType = getSelectedContentAlignedType(editorState);
    if(alignType){
      style.push(alignType);
    };

    return  style;
  };

  // get the style of where the cursor is to as to render the buttons:on 
  const onChange = (newEditorState) => {
    const stylesAtCursor = getStylesAtCursor(newEditorState);
    // console.log(stylesAtCursor)
    setCursorStyle(stylesAtCursor);
    setEditorState(newEditorState);
  };

  // list tyle
  const toggleInlineStyle = useCallback((inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }, [editorState, onChange]);


  //  color
    const styleMap = {
    "color_b80000": {
      color:"#b80000"
    },
    "color_db3e00": {
      color:"#db3e00"
    },
    "color_fccb00": {
      color:"#fccb00"
    },
    "color_008b02": {
      color:"#008b02"
    },
    "color_006b76": {
      color:"#006b76"
    },
    "color_1273de": {
      color:"#1273de"
    },
    "color_004dcf": {
      color:"#004dcf"
    },
    "color_5300eb": {
      color:"#5300eb"
    },
    "color_eb9694": {
      color:"#eb9694"
    },
    "color_fad0c3": {
      color:"#fad0c3"
    },
    "color_fef3bd": {
      color:"#fef3bd"
    },
    "color_c1e1c5": {
      color:"#c1e1c5"
    },
    "color_bedadc": {
      color:"#bedadc"
    },
    "color_c4def6": {
      color:"#c4def6"
    },
    "color_bed3f3": {
      color:"#bed3f3"
    },
    "color_d4c4fb": {
      color:"#d4c4fb"
    },
    
  };
  const handleColorChange = (color) => {
    const colorStyle = `color_${color.hex.replace('#', '')}`;
    const newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      colorStyle
    );
    setEditorState(newEditorState);
    }


  // bold/underscore
  const toggleBlockType = useCallback((blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  }, [editorState, onChange]);


    //  for text alignment
  function toggleTextAlignment(editorState, alignment) {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
  
    const newContentState = Modifier.mergeBlockData(
      contentState,
      selection,
      { textAlign: alignment }
    );
  
    return EditorState.push(editorState, newContentState, 'change-block-data');
  }

    const applyAlignment = (alignment) => {
      const newState = toggleTextAlignment(editorState, alignment);
      setEditorState(newState);
    };

    //////////////////////  block style ///////////////////////
    function blockStyleFn(block) {
      let className = '';

      const textAlign = block.getData().get('textAlign');
      if (textAlign) {
        className += ` textAlign${textAlign.charAt(0).toUpperCase() + textAlign.slice(1)}`;
      }
      const blockData = block.getData();
      if (blockData.get('fontSize')) {
        className += " " + blockData.get('fontSize');
      }
      if (blockData.get('fontFamily')) {
        className +=  " " + blockData.get('fontFamily');
      }

      return className;
    }

    function getSelectedContentAlignedType(editorState) {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startBlock = contentState.getBlockForKey(startKey);
      const blockData = startBlock.getData();
      const textAlign = blockData.get('textAlign');
    
      return textAlign;
    }


  // font size and family
  const applyClassFromSelection = useCallback((className, type) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlockMap();

    // Apply class to each block within selection
    const newBlocks = blocks.map((block) => {
      if (selection.hasEdgeWithin(block.getKey(), 0, block.getLength())) {
        // Use metadata to store the class information
        let newBlock = block.set('data', block.getData().merge({[type]: className}));
        return newBlock;
      }
      return block;
    });

    const newContentState = contentState.set('blockMap', newBlocks);
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');

    setEditorState(EditorState.forceSelection(newEditorState, selection));
  }, [editorState]);



/////////////////////////////////////  content functions ///////////////////////////////////////////////////

  // Set content
  const setContentFromRaw = (rawContent) => {
    // const contentState = convertFromRaw(rawContent);
    setEditorState(EditorState.createWithContent(convertFromRaw(rawContent)));
  }
  const setContentFromText = (text) => {
    const contentState = ContentState.createFromText(text);
    setEditorState(EditorState.createWithContent(contentState));
  }


  // get Content
  const getRawContent = () => {
    return convertToRaw(editorState.getCurrentContent());
  }
  const getTextContent = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    let content = "";
    for(let i =0; i<rawContent.blocks.length; i++){
      content += rawContent.blocks[i].text + "\n";
    }
    return content;
  }

/////////////////////////////////////  append content with style to end ///////////////////////////////////// 
  const appendStyledText = (text, inlineStyles) => {
    const currentContent = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    // Create a selection of the entire last block to append after it
    const lastBlock = currentContent.getBlockMap().last();
    const lastBlockKey = lastBlock.getKey();
    const blockLength = lastBlock.getLength();
    const appendSelection = selectionState.merge({
      anchorKey: lastBlockKey,
      anchorOffset: blockLength,
      focusKey: lastBlockKey,
      focusOffset: blockLength,
    });

    // Inserting the new text
    let newContentState = Modifier.insertText(
      currentContent,
      appendSelection,
      text
    );

    // Styling the text: applying BOLD and ITALIC
    const styleSelection = appendSelection.merge({
      focusOffset: blockLength + text.length,
    });
    
    if(inlineStyles.includes("BOLD")){
      newContentState = Modifier.applyInlineStyle(newContentState, styleSelection, 'BOLD');  
    }
    if(inlineStyles.includes("ITALIC")){
      newContentState = Modifier.applyInlineStyle(newContentState, styleSelection, 'ITALIC');
    }
    

    // Updating the EditorState
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
    setEditorState(newEditorState);
  };

/////////////////////////////////////    // append plain text ///////////////////////////////////// 
  const appendTextToEditor = (textToAppend) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    
    // If you want to append text at the end, you might need to create a selection that represents the end of your content
    const blockMap = currentContent.getBlockMap();
    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();
    const selectionAtEnd = currentSelection.merge({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length,
    });

    // Append the text
    const contentWithNewText = Modifier.insertText(
      currentContent,
      selectionAtEnd,
      textToAppend
    );

    const newEditorState = EditorState.push(editorState, contentWithNewText, 'insert-characters');
    setEditorState(newEditorState);
  };
  
  
  /////////////////////////////////////// to insert text that is list or text aligned /////////////////////////////////////
  // const appendBlockStyledText = (text, blockType) => {
  //   let contentState = editorState.getCurrentContent();
  //   let selectionState = editorState.getSelection();

  //   // Creating a new block with the text at the end
  //   const newContentState = Modifier.splitBlock(contentState, selectionState);
  //   const targetSelection = newContentState.getSelectionAfter();
  //   let newContentStateWithText = Modifier.insertText(newContentState, targetSelection, text);

  //   // Applying the block type
  //   const key = targetSelection.getStartKey();
  //   const blockMap = newContentStateWithText.getBlockMap();
  //   const block = blockMap.get(key);
  //   const newBlock = block.set('type', blockType);
  //   const newBlockMap = blockMap.set(key, newBlock);
  //   newContentStateWithText = newContentStateWithText.set('blockMap', newBlockMap);

  //   // Update EditorState
  //   let newEditorState = EditorState.push(editorState, newContentStateWithText, 'change-block-type');
  //   newEditorState = EditorState.forceSelection(newEditorState, newContentStateWithText.getSelectionAfter());
  //   setEditorState(newEditorState);
  // };
  // const insertUnOrderedList = (content) => {
  //   appendBlockStyledText(content, "unordered-list-item");
  // };
  // const insertOrderedList = (content) => {
  //   appendBlockStyledText(content, "ordered-list-item");
  // };
  
////////////////////////////////////// insert text align //////////////////////////////////////////
// const insertTextWithAlignment = (editorState, text, alignment) => {
//   const currentContent = editorState.getCurrentContent();
//   const currentSelection = editorState.getSelection();

//   // Insert text (simplified for example purposes)
//   let newContentState = Modifier.replaceText(
//     currentContent,
//     currentSelection,
//     text
//   );

//   // Find the block key for the newly inserted text
//   const blockKey = currentSelection.getStartKey();

//   // Apply text alignment by updating block data
//   const blockMap = newContentState.getBlockMap();
//   const block = blockMap.get(blockKey);
//   const newBlock = block.set('data', block.getData().merge({
//     textAlign: alignment,
//   }));
//   const newBlockMap = blockMap.set(blockKey, newBlock);
//   newContentState = newContentState.set('blockMap', newBlockMap);

//   // Create a new editor state with the changes
//   const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');

//   // Force selection to the end of the inserted text
//   const newSelection = currentSelection.merge({
//     anchorOffset: currentSelection.getAnchorOffset() + text.length,
//     focusOffset: currentSelection.getAnchorOffset() + text.length,
//   });
//   const newState = EditorState.forceSelection(newEditorState, newSelection);
//   return newState;
// };

// const insertCenterAlignedText = (text, alignment) => {
//   insertTextWithAlignment(editorState, text, alignment);
// };


/////////////////////////////////////// instert multiple lines/////////////////////////////////////
// const insertMultiText = (editorState, text, blockType, inlineStyle) => {
//   const currentContent = editorState.getCurrentContent();
//     const currentSelection = editorState.getSelection();

//     // Split the block to create space for the new text block
//     let newContentState = Modifier.splitBlock(currentContent, currentSelection);
//     const targetSelection = newContentState.getSelectionAfter();

//     // Insert text
//     newContentState = Modifier.insertText(newContentState, targetSelection, text);

//     // Apply block type
//     const blockKey = targetSelection.getStartKey();
//     const newBlockMap = newContentState.getBlockMap().map(block => {
//       if (block.getKey() === blockKey) {
//         return block.set('type', blockType);
//       }
//       return block;
//     });
//     newContentState = newContentState.set('blockMap', newBlockMap);

//     // Apply inline style
//     const styledSelection = newContentState.getSelectionAfter();
//     const anchorKey = styledSelection.getAnchorKey();
//     const currentContentBlock = newContentState.getBlockForKey(anchorKey);
//     const blockLength = currentContentBlock.getLength();
//     // Adjust selection to cover the newly inserted text
//     const styledSelectionToApply = styledSelection.merge({
//       anchorOffset: blockLength - text.length,
//       focusOffset: blockLength,
//     });
//     newContentState = Modifier.applyInlineStyle(newContentState, styledSelectionToApply, inlineStyle);

//     // Push the changes and update the editor state
//     let newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');
//     newEditorState = EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());

//   return newEditorState; // Return the new EditorState
// };

const insertLineText = (editorState, text, blockType, inlineStyle) => {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();

  // Split the block to create space for the new text block
  let newContentState = Modifier.splitBlock(currentContent, currentSelection);
  let targetSelection = newContentState.getSelectionAfter();

  // Insert text
  newContentState = Modifier.insertText(newContentState, targetSelection, text);

  // Apply block type
  let blockKey = targetSelection.getStartKey();
  let newBlockMap = newContentState.getBlockMap().map(block => {
    if (block.getKey() === blockKey) {
      return block.set('type', blockType);
    }
    return block;
  });
  newContentState = newContentState.set('blockMap', newBlockMap);

  // Apply inline style
  let styledSelection = newContentState.getSelectionAfter();
  let anchorKey = styledSelection.getAnchorKey();
  let currentContentBlock = newContentState.getBlockForKey(anchorKey);
  let blockLength = currentContentBlock.getLength();
  // Adjust selection to cover the newly inserted text
  let styledSelectionToApply = styledSelection.merge({
    anchorOffset: blockLength - text.length,
    focusOffset: blockLength,
  });
  newContentState = Modifier.applyInlineStyle(newContentState, styledSelectionToApply, inlineStyle);

  // Update the selection for next insert
  styledSelection = newContentState.getSelectionAfter();
  const newSelection = styledSelection.merge({
    anchorOffset: styledSelection.getFocusOffset(),
    focusOffset: styledSelection.getFocusOffset(),
  });

  // Push the changes and update the editor state
  let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
  newEditorState = EditorState.forceSelection(newEditorState, newSelection);

  return newEditorState;
};

const insertMultipleTexts = (data, title) => {
  let newState = editorState;
  // newState = insertLineText(newState, "First text", "unstyled", "BOLD");
  // newState = insertLineText(newState, "Second text", "ordered-list-item", "BOLD");
  // newState = insertLineText(newState, "Third text", "unordered-list-item", "ITALIC");
  newState = insertLineText(newState, title, "unstyled", "BOLD");
  newState = insertLineText(newState, "", "unstyled", "")  // insert empty line

  console.log(data);
  console.log(title)
  console.log(data[title][0]);
  console.log(typeof data[title])
  if(data[title] instanceof Array){
    // if array of object
    for(let i=0; i<data[title].length; i++){
      for(let key in data[title][i]){
        console.log(key)
        newState = insertLineText(newState, key, "unstyled", "BOLD");
        newState = insertLineText(newState, data[title][i][key], "unstyled", "")
      }
      newState = insertLineText(newState, "", "unstyled", "")  // insert empty line
    }

  }else if(data[title] instanceof Object){

    // an object
    for(let key in data[title]){
      newState = insertLineText(newState, key, "unstyled", "BOLD");
      newState = insertLineText(newState, data[title][key], "unstyled", "")
    }
  }else{
    newState = insertLineText(newState, data[title], "unstyled", "")
  }

  // insertLineText(editorState, "First text", "unstyled", "BOLD");
  // newState = insertLineText(newState, "Second text", "ordered-list-item", "BOLD");
  // newState = insertLineText(newState, "Third text", "unordered-list-item", "ITALIC");
  setEditorState(newState); // Finally, update the state with the latest newState
};


  ///////////////////////////////////////////////////////////////////////////////////////////
  // pass function for parent compenet
  ///////////////////////////////////////////////////////////////////////////////////////////
  useImperativeHandle(ref, () => ({
    getRawContent(){
      return getRawContent();
    },
    getTextContent(){
      return getTextContent();
    },
    setRawContent(rawContent){
      setContentFromRaw(rawContent);
    },
    setTextContent(content){
      setContentFromText(content);
    },
    setContentFromText,
    appendStyledText(text, inlineStyles){
      appendStyledText(text, inlineStyles)
    },
    appendTextToEditor(content){
      return appendTextToEditor(content)
    },
    // insertCenterAlignedText(content,alignment){
    //   return insertCenterAlignedText(content, alignment)
    // },
    // insertOrderedList(content){
    //   return insertOrderedList(content);
    // },
    // insertUnOrderedList(content){
    //   return insertUnOrderedList(content);
    // },
    insertMultipleTexts(data, title){
      insertMultipleTexts(data, title);
    },
  }))


    return (
      <div className='editor-container' id="editor-container">
        {props.showTools ?
          <div className="toolbar">
                <select className='toolbar-btn-select' onChange={(e) => applyClassFromSelection(e.target.value, 'fontSize')}>
                  <option value=""></option>
                  <option value="fontSizeNormal">Normal</option>
                  <option value="fontSizeH1">Heading1</option>
                  <option value="fontSizeH2">Heading2</option>
                  <option value="fontSizeH3">Heading3</option>
                  <option value="fontSizeSmall">Small</option>
                </select>

                <select className='toolbar-btn-select' onChange={(e) => applyClassFromSelection(e.target.value, 'fontFamily')}>
                  <option value=""></option>
                  <option value="fontFamilySansSerif">Arial</option>
                  <option value="fontFamilySerif">Georgia</option>
                  <option value="fontFamilyTimes">Times New Roman</option>
                  <option value="fontFamilyCourier">Courier</option>
                  <option value="fontFamilyLucida-console">Lucida Console</option>
                  <option value="fontFamilyConsolas">Consolas</option>
                </select>

            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("BOLD")}`} onClick={() => toggleInlineStyle('BOLD')}><img src={iconBold} alt="icon bold"></img></button>
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("ITALIC")}`} onClick={() => toggleInlineStyle('ITALIC')}><img src={iconItalics} alt="icon italics"></img></button>
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("UNDERLINE")}`} onClick={() => toggleInlineStyle('UNDERLINE')}><img src={iconUnderScore} alt="icon underscore"></img></button>
            <button className="toolbar-btn-type1 color-picker-button" onClick={() => setShowColorPicker(!showColorPicker)}>
              <img src={iconFontColor} alt="icon underscore"></img>
              {showColorPicker ? <div className='color-picker-container'><GithubPicker color={currentColor} onChangeComplete={handleColorChange}></GithubPicker></div>: ""}
              {/* {showColorPicker ? <SketchPicker color={currentColor} onChangeComplete={() => toggleInlineStyle("RED")}></SketchPicker>: ""} */}
            </button>

            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("unordered-list-item")}`} onClick={() => toggleBlockType('unordered-list-item')}><img src={iconUnoderedList} alt="icon unordered list"></img></button>
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("ordered-list-item")}`} onClick={() => toggleBlockType('ordered-list-item')}><img src={iconOderedList} alt="icon ordered list"></img></button>
          
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("left")}`} onClick={() => applyAlignment('left')}><img src={iconAlignLeft} alt="icon align left"></img></button>
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("center")}`} onClick={() => applyAlignment('center')}><img src={iconAlignCenter} alt="icon align center"></img></button>
            <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("right")}`} onClick={() => applyAlignment('right')}><img src={iconAlignRight} alt="icon align right"></img></button>
            <div className='tool-btn-ai'>
              <button className={`toolbar-btn-type1 is-cursor-style-${cursorStyle.includes("AI")}`} onClick={() => setShowModal(!showModal)}>
                <img src={iconAI} alt="icon ai"></img>
              </button>
              {
                  showModal ? 
                  <div className='editor-modal'>
                    <div className='eidtor-modal-header'>
                      <div className='editor-modal-note'>Section Name:</div>
                      <select className='eiditor-modal-select' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                        <option value="">Select a section</option>
                        <option value="Basic Information">Basic Information</option>
                        <option value="S (Subject)">S (Subject)</option>
                        <option value="O (Object)">O (Object)</option>
                        <option value="A (Assessment)">A (Assessment)</option>
                        <option value="P (Plan)">P (Plan)</option>
                        <option value="Customize">Customize</option>
                      </select>
                    </div>
                    <div className='editor-modal-body-1'>
                      {selectedOption === "Customize" ? <input type='text' className="eiditor-modal-inpit" placeholder='Enter customized section name' value={customizedOption} onChange={(e) => setCustomizedOption(e.target.value)}></input> : <div className='height-holder'></div>}
                    </div>
                    <div className='editor-body-2'>
                        <div className='editor-modal-note'>Add AI prompt:</div>
                        <textarea className='eiditor-modal-inpit' value={AIprompt} onChange={(e) => setAIprompt(e.target.value)}>
                        </textarea>
                    </div>
                    <div className='editor-modal-bottom'>
                      <button className='editor-modal-btn' onClick={() =>{
                         props.addEditorSection(selectedOption, customizedOption, AIprompt);
                         setSelectedOption("")
                         setCustomizedOption("");
                         setAIprompt("")
                         setShowModal(!showModal)
                      }}>Generate</button>
                    </div>

                  </div>
                  :
                  ""
                }
            </div>

          </div>
          : ""
        }
        <div className='editor-block'>
          <Editor 
            editorState={editorState} 
            onChange={onChange} 
            blockStyleFn={blockStyleFn}
            customStyleMap={styleMap}
          />
        </div>
      </div>
    );
  
});

export default MyEditor;
