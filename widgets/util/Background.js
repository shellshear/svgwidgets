function Background()
{
    Background.baseConstructor.call(this);
    this.src = "Background";
    this.focus = null;
}

KevLinDev.extend(Background, ActionObject);

Background.prototype.setFocus = function(item)
{
    this.focus = item;
}

Background.prototype.addActionListener = function(actionListener)
{
    if (this.actionListeners.length == 0)
    {
       // Only do this listening if it's absolutely required - it's
       // on the root node, so it catches everything.
       document.documentElement.addEventListener("keypress", this, false);
       document.documentElement.addEventListener("click", this, false);
    }

    Background.superClass.addActionListener.call(this, actionListener);   
};

Background.prototype.removeActionListener = function(actionListener)
{
    Background.superClass.removeActionListener.call(this, actionListener);   

    if (this.actionListeners.length == 0)
    {
       document.documentElement.removeEventListener("keypress", this, false);
       document.documentElement.removeEventListener("click", this, false);
    }
};

Background.prototype.clearActionListeners = function()
{
    Background.superClass.clearActionListeners.call(this);   

    document.documentElement.removeEventListener("keypress", this, false);
    document.documentElement.removeEventListener("click", this, false);
};

Background.prototype.doAction = function(src, evt)
{
    evt.focus = this.focus;
    this.tellActionListeners(src, evt);
};

