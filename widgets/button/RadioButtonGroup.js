// Radio button group ensures only one button can be in "selected" state.
function RadioButtonGroup(params)
{
    this.buttons = [];
    this.currentSelection = null;
	this.params = params;
	if (this.params == null)
		this.params = {};
	if (this.params.allowNoSelection == null)
		this.params.allowNoSelection = true;
}

RadioButtonGroup.prototype.addButton = function(button)
{
    this.buttons.push(button);
    button.addActionListener(this);
}

RadioButtonGroup.prototype.doAction = function(src, evt)
{
    if (evt.type == "mousedown")
    {
        this.setSelected(src);
    }
}

RadioButtonGroup.prototype.setSelected = function(src)
{
    this.currentSelection = src;

	if (!this.params.allowNoSelection)
	{
    	src.setSelected(true);
    }

    // Unselect all the other buttons
    for (var i in this.buttons)
    {
        if (this.buttons[i] != src)
        {
            this.buttons[i].setSelected(false);
        }
    }
}

