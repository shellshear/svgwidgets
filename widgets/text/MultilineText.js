// TODO: Remove in favour of TextLabel
// An area of text.
// textInstructions should be a list {}, with the following members:
//     - maxWidth: the maximum width of any line
//     - lineSpacing: a float greater than 0 indicating the proportion of the
//                    font-size that should separate lines.
// Currently only caters for horizontally and vertically centred. 
function MultilineText(x, y, textVal, textAttributes, textInstructions)
{
    MultilineText.baseConstructor.call(this, x, y);
    
    var wordTokens = textVal.split(" ");

    if (textInstructions == null || textInstructions.maxWidth == null)
        return null;
        
    var textLines = [];
    
    // Use greedy algorithm to get array of text strings
    var i = 0;
    while (i < wordTokens.length)
    {
        var currText = wordTokens[i];
        var tempText = currText;
        var nextLine = new SVGElement("text", textAttributes, tempText);
        textLines.push(nextLine);

        while (nextLine.getBBox().width <= textInstructions.maxWidth)
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
    }

    // Work out how to place lines vertically
    var fontSize = parseInt(textAttributes["font-size"]);
    var totalHeight = textLines.length * fontSize + (textLines.length - 1) * fontSize * textInstructions.lineSpacing;

    for (var i = 0; i < textLines.length; i++)
    {
        var width = textLines[i].getBBox().width;
        textLines[i].setAttribute("x", -width / 2);
        textLines[i].setAttribute("y", -totalHeight / 2 + i * (fontSize + fontSize * textInstructions.lineSpacing) + fontSize / 2);
        this.appendChild(textLines[i]);
    }
}

KevLinDev.extend(MultilineText, SVGComponent);

