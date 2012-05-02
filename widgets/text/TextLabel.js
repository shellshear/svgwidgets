// An area of text. "\n" in the source text cause hard line breaks.
// layoutParams should be a list {}, with the usual params for flow
// layout, with the following additions and changes:
//     - direction default is "down"
//     - maxWidth: the maximum width of any line (will also cause line breaks)
function TextLabel(textVal, textAttributes, layoutParams)
{
    this.layoutParams = layoutParams;
    if (layoutParams == null)
        layoutParams = {};
        
    // For text, the default flow for lines is each line below the previous.
    if (layoutParams.direction == null)
        layoutParams.direction = "down";
    
    var yOffset = 0;
    if (textAttributes != null && textAttributes["font-size"] != null)
        yOffset = textAttributes["font-size"];
        
    TextLabel.baseConstructor.call(this, 0, yOffset, layoutParams);
    
    this.textAttributes = textAttributes;
    
    this.setValue(textVal);
}

KevLinDev.extend(TextLabel, FlowLayout);

// Layout the text
TextLabel.prototype.setValue = function(textVal)
{
	this.textValue = textVal;
	
    this.removeChildren();
    
    if (textVal == null)
        return;
    
    var paraTokens = textVal.split("\n");
    
    for (var i in paraTokens)
    {
        this.setParagraph(paraTokens[i]);
    }
}

// Layout a single paragraph of text.
TextLabel.prototype.setParagraph = function(textVal)
{
    if (this.layoutParams.maxWidth == null)
    {
        // Don't attempt soft line breaks
        var nextLine = new SVGElement("text", this.textAttributes, textVal);
        this.appendChild(nextLine);
        return;
    }

    var wordTokens = textVal.split(" ");
    
    // Use greedy algorithm to get array of text strings
    var i = 0;
    while (i < wordTokens.length)
    {
        var currText = wordTokens[i];
        var tempText = currText;
        var nextLine = new SVGElement("text", this.textAttributes, tempText);

        while (nextLine.getBBox().width <= this.layoutParams.maxWidth)
        {
            currText = tempText; // The test line worked
            i++;
            if (i >= wordTokens.length)
                break;
            
            tempText = currText + " " + wordTokens[i];
            nextLine.setValue(tempText);
        }
        
        if (i < wordTokens.length)
        {
            // Broke out of the loop because the line was too long.
            // Reset to the last good value
            nextLine.setValue(currText);

            // If the single word was enough to overrun the length,
            // we need to skip ahead to the next word anyway.
            if (currText == tempText)
                i++;
        }
        this.appendChild(nextLine);
    }
}

