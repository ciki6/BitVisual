enum OptionType {
  // string input
  string = "String",
  // int number input
  int = "Int",
  // double number input
  double = "Double",
  // double number input list with placeholder
  doubleArray = "DoubleArray",
  //range input, need min/max in option
  range = "Range",
  //checkbox input
  boolean = "Boolean",
  //radio selector, need options in option, default value is the first one
  radio = "Radio",
  //single dropdown seletor, need options in option, default value is the first one
  select = "Select",
  //multiple drop down selector, need options in option, default value is the first one
  multiSelect = "MultiSelect",
  //color picker / gradient color picker
  color = "Color",
  // the list of color, add by editor
  colorList = "ColorList",
  //media uploader
  media = "Media",
  // has default value of position (x,y)
  position = "Position",
  //input of x, y, w , h and has lock of width and height
  size = "Size",
  // combination of font styles
  font = "Font",
}
export default OptionType;
