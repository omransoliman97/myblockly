import { 
  Code2, 
  Code, 
  ListChecks, 
  FunctionSquare,
  Variable,
  ListOrdered,
  TextCursorInput,
} from 'lucide-react';

export type Block = {
  nameKey: string;
  descriptionKey: string;
  codeKey: string;
  exampleKey?: string;
  blockType?: string;
  blockXml?: string;
};

export type BlockCategory = {
  id: string;
  nameKey: string;
  icon: React.ReactNode;
  blocks: Block[];
};

export const blockCategories: BlockCategory[] = [
  {
    id: 'logic',
    nameKey: 'docs.blockCategories.logic',
    icon: <Code2 className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.logic.if.name', descriptionKey: 'docs.blocks.logic.if.description', codeKey: 'docs.blocks.logic.if.code', exampleKey: 'docs.blocks.logic.if.example', blockType: 'controls_if', blockXml: '<block type="controls_if"></block>' },
      { nameKey: 'docs.blocks.logic.ifElse.name', descriptionKey: 'docs.blocks.logic.ifElse.description', codeKey: 'docs.blocks.logic.ifElse.code', blockType: 'controls_if', blockXml: '<block type="controls_if"><mutation else="1"></mutation></block>' },
      { nameKey: 'docs.blocks.logic.comparison.name', descriptionKey: 'docs.blocks.logic.comparison.description', codeKey: 'docs.blocks.logic.comparison.code', blockType: 'logic_compare', blockXml: '<block type="logic_compare"><field name="OP">EQ</field></block>' },
      { nameKey: 'docs.blocks.logic.logicalOperators.name', descriptionKey: 'docs.blocks.logic.logicalOperators.description', codeKey: 'docs.blocks.logic.logicalOperators.code', blockType: 'logic_operation', blockXml: '<block type="logic_operation"><field name="OP">AND</field></block>' },
      { nameKey: 'docs.blocks.logic.boolean.name', descriptionKey: 'docs.blocks.logic.boolean.description', codeKey: 'docs.blocks.logic.boolean.code', blockType: 'logic_boolean', blockXml: '<block type="logic_boolean"><field name="BOOL">TRUE</field></block>' },
      { nameKey: 'docs.blocks.logic.null.name', descriptionKey: 'docs.blocks.logic.null.description', codeKey: 'docs.blocks.logic.null.code', blockType: 'logic_null', blockXml: '<block type="logic_null"></block>' },
      { nameKey: 'docs.blocks.logic.ternary.name', descriptionKey: 'docs.blocks.logic.ternary.description', codeKey: 'docs.blocks.logic.ternary.code', blockType: 'logic_ternary', blockXml: '<block type="logic_ternary"></block>' }
    ]
  },
  {
    id: 'loops',
    nameKey: 'docs.blockCategories.loops',
    icon: <ListChecks className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.loops.repeat.name', descriptionKey: 'docs.blocks.loops.repeat.description', codeKey: 'docs.blocks.loops.repeat.code', blockType: 'controls_repeat_ext', blockXml: '<block type="controls_repeat_ext"></block>' },
      { nameKey: 'docs.blocks.loops.while.name', descriptionKey: 'docs.blocks.loops.while.description', codeKey: 'docs.blocks.loops.while.code', blockType: 'controls_whileUntil', blockXml: '<block type="controls_whileUntil"><field name="MODE">WHILE</field></block>' },
      { nameKey: 'docs.blocks.loops.repeatUntil.name', descriptionKey: 'docs.blocks.loops.repeatUntil.description', codeKey: 'docs.blocks.loops.repeatUntil.code', blockType: 'controls_whileUntil', blockXml: '<block type="controls_whileUntil"><field name="MODE">UNTIL</field></block>' },
      { nameKey: 'docs.blocks.loops.countWith.name', descriptionKey: 'docs.blocks.loops.countWith.description', codeKey: 'docs.blocks.loops.countWith.code', blockType: 'controls_for', blockXml: '<block type="controls_for"></block>' },
      { nameKey: 'docs.blocks.loops.forEach.name', descriptionKey: 'docs.blocks.loops.forEach.description', codeKey: 'docs.blocks.loops.forEach.code', blockType: 'controls_forEach', blockXml: '<block type="controls_forEach"></block>' },
      { nameKey: 'docs.blocks.loops.breakOutOfLoop.name', descriptionKey: 'docs.blocks.loops.breakOutOfLoop.description', codeKey: 'docs.blocks.loops.breakOutOfLoop.code', blockType: 'controls_flow_statements', blockXml: '<block type="controls_flow_statements"><field name="FLOW">BREAK</field></block>' },
      { nameKey: 'docs.blocks.loops.continueLoop.name', descriptionKey: 'docs.blocks.loops.continueLoop.description', codeKey: 'docs.blocks.loops.continueLoop.code', blockType: 'controls_flow_statements', blockXml: '<block type="controls_flow_statements"><field name="FLOW">CONTINUE</field></block>' }
    ]
  },
  {
    id: 'math',
    nameKey: 'docs.blockCategories.math',
    icon: <FunctionSquare className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.math.number.name', descriptionKey: 'docs.blocks.math.number.description', codeKey: 'docs.blocks.math.number.code', blockType: 'math_number', blockXml: '<block type="math_number"><field name="NUM">42</field></block>' },
      { nameKey: 'docs.blocks.math.arithmetic.name', descriptionKey: 'docs.blocks.math.arithmetic.description', codeKey: 'docs.blocks.math.arithmetic.code', blockType: 'math_arithmetic', blockXml: '<block type="math_arithmetic"><field name="OP">ADD</field></block>' },
      { nameKey: 'docs.blocks.math.mathFunctions.name', descriptionKey: 'docs.blocks.math.mathFunctions.description', codeKey: 'docs.blocks.math.mathFunctions.code', blockType: 'math_single', blockXml: '<block type="math_single"><field name="OP">ROOT</field></block>' },
      { nameKey: 'docs.blocks.math.trigFunctions.name', descriptionKey: 'docs.blocks.math.trigFunctions.description', codeKey: 'docs.blocks.math.trigFunctions.code', blockType: 'math_trig', blockXml: '<block type="math_trig"><field name="OP">SIN</field></block>' },
      { nameKey: 'docs.blocks.math.constants.name', descriptionKey: 'docs.blocks.math.constants.description', codeKey: 'docs.blocks.math.constants.code', blockType: 'math_constant', blockXml: '<block type="math_constant"><field name="CONSTANT">PI</field></block>' },
      { nameKey: 'docs.blocks.math.numberProperty.name', descriptionKey: 'docs.blocks.math.numberProperty.description', codeKey: 'docs.blocks.math.numberProperty.code', blockType: 'math_number_property', blockXml: '<block type="math_number_property"><mutation divisor_input="false"></mutation><field name="PROPERTY">EVEN</field></block>' },
      { nameKey: 'docs.blocks.math.round.name', descriptionKey: 'docs.blocks.math.round.description', codeKey: 'docs.blocks.math.round.code', blockType: 'math_round', blockXml: '<block type="math_round"><field name="OP">ROUND</field></block>' },
      { nameKey: 'docs.blocks.math.constrain.name', descriptionKey: 'docs.blocks.math.constrain.description', codeKey: 'docs.blocks.math.constrain.code', blockType: 'math_constrain', blockXml: '<block type="math_constrain"></block>' },
      { nameKey: 'docs.blocks.math.randomInteger.name', descriptionKey: 'docs.blocks.math.randomInteger.description', codeKey: 'docs.blocks.math.randomInteger.code', blockType: 'math_random_int', blockXml: '<block type="math_random_int"></block>' },
      { nameKey: 'docs.blocks.math.randomFraction.name', descriptionKey: 'docs.blocks.math.randomFraction.description', codeKey: 'docs.blocks.math.randomFraction.code', blockType: 'math_random_float', blockXml: '<block type="math_random_float"></block>' }
    ]
  },
  {
    id: 'variables',
    nameKey: 'docs.blockCategories.variables',
    icon: <Variable className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.variables.createVariable.name', descriptionKey: 'docs.blocks.variables.createVariable.description', codeKey: 'docs.blocks.variables.createVariable.code', blockType: 'variables_set', blockXml: '<block type="variables_set"></block>' },
      { nameKey: 'docs.blocks.variables.setVariable.name', descriptionKey: 'docs.blocks.variables.setVariable.description', codeKey: 'docs.blocks.variables.setVariable.code', blockType: 'variables_set', blockXml: '<block type="variables_set"></block>' },
      { nameKey: 'docs.blocks.variables.getVariable.name', descriptionKey: 'docs.blocks.variables.getVariable.description', codeKey: 'docs.blocks.variables.getVariable.code', blockType: 'variables_get', blockXml: '<block type="variables_get"></block>' }
    ]
  },
  {
    id: 'functions',
    nameKey: 'docs.blockCategories.functions',
    icon: <Code className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.functions.defineFunction.name', descriptionKey: 'docs.blocks.functions.defineFunction.description', codeKey: 'docs.blocks.functions.defineFunction.code', blockType: 'procedures_defnoreturn', blockXml: '<block type="procedures_defnoreturn"></block>' },
      { nameKey: 'docs.blocks.functions.callFunction.name', descriptionKey: 'docs.blocks.functions.callFunction.description', codeKey: 'docs.blocks.functions.callFunction.code', blockType: 'procedures_callnoreturn', blockXml: '<block type="procedures_callnoreturn"><mutation name="myFunction"></mutation></block>' },
      { nameKey: 'docs.blocks.functions.returnValue.name', descriptionKey: 'docs.blocks.functions.returnValue.description', codeKey: 'docs.blocks.functions.returnValue.code', blockType: 'procedures_defreturn', blockXml: '<block type="procedures_defreturn"></block>' }
    ]
  },
  {
    id: 'lists',
    nameKey: 'docs.blockCategories.lists',
    icon: <ListOrdered className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.lists.createEmptyList.name', descriptionKey: 'docs.blocks.lists.createEmptyList.description', codeKey: 'docs.blocks.lists.createEmptyList.code', blockType: 'lists_create_empty', blockXml: '<block type="lists_create_with"><mutation items="0"></mutation></block>' },
      { nameKey: 'docs.blocks.lists.createList.name', descriptionKey: 'docs.blocks.lists.createList.description', codeKey: 'docs.blocks.lists.createList.code', blockType: 'lists_create_with', blockXml: '<block type="lists_create_with"><mutation items="3"></mutation></block>' },
      { nameKey: 'docs.blocks.lists.createListWith.name', descriptionKey: 'docs.blocks.lists.createListWith.description', codeKey: 'docs.blocks.lists.createListWith.code', blockType: 'lists_repeat', blockXml: '<block type="lists_repeat"></block>' },
      { nameKey: 'docs.blocks.lists.listLength.name', descriptionKey: 'docs.blocks.lists.listLength.description', codeKey: 'docs.blocks.lists.listLength.code', blockType: 'lists_length', blockXml: '<block type="lists_length"></block>' },
      { nameKey: 'docs.blocks.lists.listIsEmpty.name', descriptionKey: 'docs.blocks.lists.listIsEmpty.description', codeKey: 'docs.blocks.lists.listIsEmpty.code', blockType: 'lists_isEmpty', blockXml: '<block type="lists_isEmpty"></block>' },
      { nameKey: 'docs.blocks.lists.findItemInList.name', descriptionKey: 'docs.blocks.lists.findItemInList.description', codeKey: 'docs.blocks.lists.findItemInList.code', blockType: 'lists_indexOf', blockXml: '<block type="lists_indexOf"><field name="END">FIRST</field></block>' },
      { nameKey: 'docs.blocks.lists.getItem.name', descriptionKey: 'docs.blocks.lists.getItem.description', codeKey: 'docs.blocks.lists.getItem.code', blockType: 'lists_getIndex', blockXml: '<block type="lists_getIndex"><mutation statement="false" at="true"></mutation><field name="MODE">GET</field><field name="WHERE">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.lists.setItem.name', descriptionKey: 'docs.blocks.lists.setItem.description', codeKey: 'docs.blocks.lists.setItem.code', blockType: 'lists_setIndex', blockXml: '<block type="lists_setIndex"><mutation at="true"></mutation><field name="MODE">SET</field><field name="WHERE">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.lists.getAndRemoveItem.name', descriptionKey: 'docs.blocks.lists.getAndRemoveItem.description', codeKey: 'docs.blocks.lists.getAndRemoveItem.code', blockType: 'lists_getIndex', blockXml: '<block type="lists_getIndex"><mutation statement="false" at="true"></mutation><field name="MODE">GET_REMOVE</field><field name="WHERE">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.lists.removeItem.name', descriptionKey: 'docs.blocks.lists.removeItem.description', codeKey: 'docs.blocks.lists.removeItem.code', blockType: 'lists_getIndex', blockXml: '<block type="lists_getIndex"><mutation statement="true" at="true"></mutation><field name="MODE">REMOVE</field><field name="WHERE">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.lists.getSublist.name', descriptionKey: 'docs.blocks.lists.getSublist.description', codeKey: 'docs.blocks.lists.getSublist.code', blockType: 'lists_getSublist', blockXml: '<block type="lists_getSublist"><mutation at1="true" at2="true"></mutation><field name="WHERE1">FROM_START</field><field name="WHERE2">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.lists.splitTextIntoList.name', descriptionKey: 'docs.blocks.lists.splitTextIntoList.description', codeKey: 'docs.blocks.lists.splitTextIntoList.code', blockType: 'lists_split', blockXml: '<block type="lists_split"><mutation mode="SPLIT"></mutation><field name="MODE">SPLIT</field></block>' },
      { nameKey: 'docs.blocks.lists.joinListIntoText.name', descriptionKey: 'docs.blocks.lists.joinListIntoText.description', codeKey: 'docs.blocks.lists.joinListIntoText.code', blockType: 'lists_split', blockXml: '<block type="lists_split"><mutation mode="JOIN"></mutation><field name="MODE">JOIN</field></block>' },
      { nameKey: 'docs.blocks.lists.sortList.name', descriptionKey: 'docs.blocks.lists.sortList.description', codeKey: 'docs.blocks.lists.sortList.code', blockType: 'lists_sort', blockXml: '<block type="lists_sort"><field name="TYPE">NUMERIC</field><field name="DIRECTION">1</field></block>' },
      { nameKey: 'docs.blocks.lists.reverseList.name', descriptionKey: 'docs.blocks.lists.reverseList.description', codeKey: 'docs.blocks.lists.reverseList.code', blockType: 'lists_reverse', blockXml: '<block type="lists_reverse"></block>' }
    ]
  },
  {
    id: 'text',
    nameKey: 'docs.blockCategories.text',
    icon: <TextCursorInput className="h-4 w-4" />,
    blocks: [
      { nameKey: 'docs.blocks.text.createText.name', descriptionKey: 'docs.blocks.text.createText.description', codeKey: 'docs.blocks.text.createText.code', blockType: 'text', blockXml: '<block type="text"><field name="TEXT">Hello, world!</field></block>' },
      { nameKey: 'docs.blocks.text.joinText.name', descriptionKey: 'docs.blocks.text.joinText.description', codeKey: 'docs.blocks.text.joinText.code', blockType: 'text_join', blockXml: '<block type="text_join"><mutation items="2"></mutation></block>' },
      { nameKey: 'docs.blocks.text.appendText.name', descriptionKey: 'docs.blocks.text.appendText.description', codeKey: 'docs.blocks.text.appendText.code', blockType: 'text_append', blockXml: '<block type="text_append"></block>' },
      { nameKey: 'docs.blocks.text.textLength.name', descriptionKey: 'docs.blocks.text.textLength.description', codeKey: 'docs.blocks.text.textLength.code', blockType: 'text_length', blockXml: '<block type="text_length"></block>' },
      { nameKey: 'docs.blocks.text.textIsEmpty.name', descriptionKey: 'docs.blocks.text.textIsEmpty.description', codeKey: 'docs.blocks.text.textIsEmpty.code', blockType: 'text_isEmpty', blockXml: '<block type="text_isEmpty"></block>' },
      { nameKey: 'docs.blocks.text.findText.name', descriptionKey: 'docs.blocks.text.findText.description', codeKey: 'docs.blocks.text.findText.code', blockType: 'text_indexOf', blockXml: '<block type="text_indexOf"><field name="END">FIRST</field></block>' },
      { nameKey: 'docs.blocks.text.getCharacter.name', descriptionKey: 'docs.blocks.text.getCharacter.description', codeKey: 'docs.blocks.text.getCharacter.code', blockType: 'text_charAt', blockXml: '<block type="text_charAt"><mutation at="true"></mutation><field name="WHERE">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.text.substring.name', descriptionKey: 'docs.blocks.text.substring.description', codeKey: 'docs.blocks.text.substring.code', blockType: 'text_getSubstring', blockXml: '<block type="text_getSubstring"><mutation at1="true" at2="true"></mutation><field name="WHERE1">FROM_START</field><field name="WHERE2">FROM_START</field></block>' },
      { nameKey: 'docs.blocks.text.changeCase.name', descriptionKey: 'docs.blocks.text.changeCase.description', codeKey: 'docs.blocks.text.changeCase.code', blockType: 'text_changeCase', blockXml: '<block type="text_changeCase"><field name="CASE">UPPERCASE</field></block>' },
      { nameKey: 'docs.blocks.text.trimText.name', descriptionKey: 'docs.blocks.text.trimText.description', codeKey: 'docs.blocks.text.trimText.code', blockType: 'text_trim', blockXml: '<block type="text_trim"><field name="MODE">BOTH</field></block>' },
      { nameKey: 'docs.blocks.text.print.name', descriptionKey: 'docs.blocks.text.print.description', codeKey: 'docs.blocks.text.print.code', blockType: 'text_print', blockXml: '<block type="text_print"></block>' },
      { nameKey: 'docs.blocks.text.prompt.name', descriptionKey: 'docs.blocks.text.prompt.description', codeKey: 'docs.blocks.text.prompt.code', blockType: 'text_prompt_ext', blockXml: '<block type="text_prompt_ext"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field></block>' }
    ]
  }
];