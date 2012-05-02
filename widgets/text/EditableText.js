// An editable area of text.
// params:
// - background - a Background object, required so the text area knows when it should be taking text events
// - initialText - the initial text to go in the area. As with TextLabel, "\n" is a hard line break. Default: ""
// - textParams - svg text parameters. Default: {"font-size":20, fill:"black", y:20}
// - width - the width of the editable area. Text will wrap when it reaches that width.
//           If not set, there is no limit to the width. Default: null
// - maxLines - the maximum number of lines of text. 
//              Text will scroll within that area when it exceeds that number of lines. Default: null
// - lineSpacing - the space between lines of text. Default: 0
// - border - a rectangular border around the text, defined as follows:
//     - normal - params applied to the rectangle in its normal state
//     - focus - params applied to the rectangle in its focus state
function EditableText(params)
{
	//	src, background, rectParams, textParams, x, y, states
	this.params = params;
	if (this.params == null)
		this.params = {};
	
	if (this.params.initialText == null)
		this.params.initialText = "";
		
	if (this.params.textParams == null)
		this.params.textParams = {"font-size":20, fill:"black", y:20};
	
	if (this.params.lineSpacing == null)
		this.params.lineSpacing = 0;

    EditableText.baseConstructor.call(this, this.params.initialText, );

    // Button ID passed to the doAction when event happens
    this.src = src;
    
    this.setBackground(background);
    this.textVal = "";
    this.secretVal = "";
    
    var params = {x:0, y:0};    
    if (rectParams.width != null)
    {
        params.width = rectParams.width;
        this.textBoxWidth = params.width;
    }
    if (rectParams.height != null)
    {
        params.height = rectParams.height;
    }
    
    // The textBox clips the text
    this.textBox = new SVGElement("svg", params);
    this.appendChild(this.textBox);
    this.textNodeHolder = new SVGElement("g");
    this.textBox.appendChild(this.textNodeHolder);
    this.textNode = new SVGElement("text", textParams, " ");
    this.textNode.setAttributeNS(xmlns, "space", "preserve");
    this.textNodeHolder.appendChild(this.textNode);
    
    // Also draw a cursor
    this.cursor = new SVGElement("rect", {x:5, y:3, width:2, height:20, stroke:"none", fill:"red"});
    
    var cursorAnimator = new SVGElement("set", {id:"textCursorBlink2", attributeName:"visibility", attributeType:"CSS", to:"hidden", begin:"0.5s;textCursorBlink2.end + 0.5s", dur:"0.5s"});
    this.cursor.appendChild(cursorAnimator);
    this.cursor.hide();
    this.textNodeHolder.appendChild(this.cursor);
}

KevLinDev.extend(EditableText, SimpleButton);

EditableText.prototype.doAction = function(src, evt) 
{
    EditableText.superClass.doAction.call(this, src, evt);

    if (evt.type == "keypress")
    {
        var charCode = evt.keyCode;
        if (evt.charCode)
        {
            charCode = evt.charCode;
        }
        
        if (charCode > 31 && charCode != 127 && charCode < 65535) 
        {
            if (this.isSecret)
            {
                this.textVal += "*";
                this.secretVal += String.fromCharCode(charCode);
            }
            else
            {
                this.textVal += String.fromCharCode(charCode);
            }
        }
        else if (charCode == 8)
        {
            // backspace
            if (this.isSecret)
            {
                this.textVal = this.textVal.substring(0, this.textVal.length - 1);
                this.secretVal = this.secretVal.substring(0, this.secretVal.length - 1);
            }
            else
            {
                this.textVal = this.textVal.substring(0, this.textVal.length - 1);
            }
        }
        else if (charCode == 10 || charCode == 13)
        {
            // Enter key
            this.nextFocus();
        }

        this.textNode.tnode.nodeValue = this.textVal;
        this.updateWidth();
    }
    else if (evt.type == "click")
    {
        if (src.src == "Background")
        {
            this.loseFocus();
        }
        else if (src.src = this.src)
        {
            this.setFocus();
            evt.stopPropagation();
        }
    }
};

EditableText.prototype.setSecret = function()
{
    this.isSecret = true;
};

EditableText.prototype.setValue = function(value)
{
    if (this.isSecret)
    {
        this.secretVal = value.toString();
        this.textVal = "";
        for (var i = 0; i < this.secretVal.length; i++)
            this.textVal += "*";
    }
    else
    {
        this.textVal = value.toString();
    }
    this.textNode.tnode.nodeValue = this.textVal;
    this.updateWidth();
};

EditableText.prototype.updateWidth = function()
{
    var bbox = this.textNode.getBBox();
    this.cursor.setAttribute("x", bbox.width + 5);

    if (bbox.width > this.textBoxWidth - 10)
    {
        this.textNodeHolder.setAttribute("transform", "translate(" + (this.textBoxWidth - bbox.width - 10) + ",0)");
    }
    else
    {
        this.textNodeHolder.setAttribute("transform", "translate(0,0)");
    }
};

EditableText.prototype.setFocus = function()
{
    this.cursor.show();
    EditableText.superClass.setFocus.call(this);    
};

EditableText.prototype.loseFocus = function()
{
    this.cursor.hide();
    EditableText.superClass.loseFocus.call(this);    
};

