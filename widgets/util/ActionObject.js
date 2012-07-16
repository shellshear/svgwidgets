// Action Listeners respond to any SVG events via the handleEvent
// method.  They can also be passed on by tellActionListeners.
function ActionObject()
{
    this.src = "ActionObject";
    this.actionListeners = [];
	this.resizeListeners = [];
}

ActionObject.prototype.addActionListener = function(actionListener)
{
    this.actionListeners.push(actionListener);
};

ActionObject.prototype.removeActionListener = function(actionListener)
{
    for (var i = 0; i < this.actionListeners.length; ++i)
    {
     	if (this.actionListeners[i] == actionListener)
     	{
         	this.actionListeners.splice(i, 1);
         	break;
     	}
    }
};

ActionObject.prototype.clearActionListeners = function()
{
    this.actionListeners = [];
};

ActionObject.prototype.handleEvent = function(evt)
{
    this.tellActionListeners(this, evt);
};

ActionObject.prototype.tellActionListeners = function(src, evt)
{
    // Tell the action listeners
    for (var i = 0; i < this.actionListeners.length; ++i)
    {
     	this.actionListeners[i].doAction(src, evt);
    }
};

ActionObject.prototype.addResizeListener = function(resizeListener)
{
    this.resizeListeners.push(resizeListener);
};

ActionObject.prototype.removeResizeListener = function(resizeListener)
{
    for (var i = 0; i < this.resizeListeners.length; ++i)
    {
     	if (this.resizeListeners[i] == resizeListener)
     	{
         	this.resizeListeners.splice(i, 1);
         	break;
     	}
    }
};

ActionObject.prototype.clearResizeListeners = function()
{
    this.resizeListeners = [];
};

ActionObject.prototype.tellResizeListeners = function(src)
{
    // Tell the action listeners
    for (var i = 0; i < this.resizeListeners.length; ++i)
    {
     	this.resizeListeners[i].notifyResize(src);
    }
};

