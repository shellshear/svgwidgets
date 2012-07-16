// An SVG container (actually a group element). Has focus handling.
function SVGComponent(x, y)
{
    SVGComponent.baseConstructor.call(this, "g");

    this.src = "SVGComponent";
    this.hasFocus = false;
    this.background = null; // background is used for receiving text events

    this.focusListeners = [];
    this.focusManager = null;

    // Component can have several extra sub-components, which are synchronised.
    // The sub-components are *not* attached to the svg group.
    // This allows (for example) a button where the cover is on a 
    // completely different svg group from the rest of the button.
    // This is useful when you need covers not to be covered by other
    // elements, for example.
    this.auxiliaryComponents = []; 
    
    this.scale = 1;
    this.setPosition(x, y);
}

KevLinDev.extend(SVGComponent, SVGElement);

SVGComponent.prototype.addAuxiliaryComponent = function(component)
{
    this.auxiliaryComponents.push(component);
}

SVGComponent.prototype.setPosition = function(x, y)
{
    if (x == null)
        x = 0;

    if (y == null)
        y = 0;

    if (this.parentNode != null && this.parentNode.childConstraints)
    {
        // We are constrained in where we can place this item
        // Find the current width and height, so we can be sure 
        var bbox = this.getBBox();
        if (bbox)
        {
            if (x < this.parentNode.childConstraints.x)
                x = this.parentNode.childConstraints.x;
            else if (x > this.parentNode.childConstraints.x + this.parentNode.childConstraints.width - bbox.width)
                x = this.parentNode.childConstraints.x + this.parentNode.childConstraints.width - bbox.width;
        
            if (y < this.parentNode.childConstraints.y)
                y = this.parentNode.childConstraints.y;
            else if (y > this.parentNode.childConstraints.y + this.parentNode.childConstraints.height - bbox.height)
                y = this.parentNode.childConstraints.y + this.parentNode.childConstraints.height - bbox.height;
        }
    }
    
    this.x = x;
    this.y = y;

    var scaleString = "";
    if (this.scale != 1)
        scaleString = "scale(" + this.scale + ") ";

    this.svg.setAttribute("transform", scaleString + "translate(" + this.x + "," + this.y + ") ");
    
    for (var i = 0; i < this.auxiliaryComponents.length; ++i)
    {
        this.auxiliaryComponents[i].setPosition(x, y);
    }
};

SVGComponent.prototype.setScale = function(scale)
{
    if (scale == null)
        this.scale = 1;
    else
        this.scale = scale;
        
    var scaleString = "";
    if (this.scale != 1)
        scaleString = "scale(" + this.scale + ") ";

    this.svg.setAttribute("transform", scaleString + "translate(" + this.x + "," + this.y + ") ");
    
    for (var i = 0; i < this.auxiliaryComponents.length; ++i)
    {
        this.auxiliaryComponents[i].setScale(scale);
    }
}

// Set the background element that allows us to receive text events
SVGComponent.prototype.setBackground = function(background)
{
    this.background = background;
};

// Let the component know that the focus of its children are
// being managed by a focus manager
SVGComponent.prototype.setFocusManager = function(focusManager)
{
    this.focusManager = focusManager;
};

SVGComponent.prototype.doAction = function(src, evt)
{
    SVGComponent.superClass.doAction.call(this, src, evt);

    if (evt.type == "keypress")
    {
     var charCode = evt.keyCode;
     if (evt.charCode)
     {
         charCode = evt.charCode;
     }
     
     if (charCode == 9 && evt.shiftKey)
     {
         // Go to previous focus in ring
         this.previousFocus();
         evt.preventDefault(); // Don't want browser to do default tab
     }
     else if (charCode == 9)
     {
         // Go to next focus in ring
         this.nextFocus();
         evt.preventDefault(); // Don't want browser to do default tab
     }
    }   
};

// Focus listeners respond to focus change events.  These have
// to be manually triggered by calling tellFocusListeners.

SVGComponent.prototype.setFocus = function()
{
    if (!this.hasFocus)
    {
        if (this.focusManager)
        {
            this.focusManager.setFocus();
        }
     
        if (this.background)
        {
            // We have focus, so listen for text events
            // from the background
            this.background.addActionListener(this);
            this.background.setFocus(this);
        }
     
        this.hasFocus = true;
        this.tellFocusListeners(this);
    }
};

SVGComponent.prototype.loseFocus = function()
{
    if (this.hasFocus)
    {
        if (this.focusManager)
        {
            this.focusManager.loseFocus();
        }
     
        if (this.background)
        {
            // We lost focus, so stop listening for text events
            // from the background
            this.background.removeActionListener(this);
            if (this.background.focus == this)
                this.background.setFocus(null);
        }
     
        this.hasFocus = false;
    }
};

SVGComponent.prototype.setNextFocus = function(nextFocus)
{
    this.nextFocusComponent = nextFocus;
}

SVGComponent.prototype.setPreviousFocus = function(previousFocus)
{
    this.previousFocusComponent = previousFocus;
}

SVGComponent.prototype.nextFocus = function()
{
    this.loseFocus();
    if (this.nextFocusComponent)
    {
     this.nextFocusComponent.setFocus();
    }
}

SVGComponent.prototype.previousFocus = function()
{
    this.loseFocus();
    if (this.previousFocusComponent)
    {
     this.previousFocusComponent.setFocus();
    }
}

SVGComponent.prototype.addFocusListener = function(focusListener)
{
    this.focusListeners.push(focusListener);
};

SVGComponent.prototype.removeFocusListener = function(focusListener)
{
    for (var i = 0; i < this.focusListeners.length; ++i)
    {
     if (this.focusListeners[i] == focusListener)
     {
         this.focusListeners.splice(i, 1);
         break;
     }
    }
};

SVGComponent.prototype.clearFocusListeners = function()
{
    this.focusListeners = new Array();
};

SVGComponent.prototype.tellFocusListeners = function(src)
{
    // Tell the focus listeners
    for (var i = 0; i < this.focusListeners.length; ++i)
    {
     this.focusListeners[i].focusChangeRequest(src);
    }
};

SVGComponent.prototype.focusChangeRequest = function(src)
{
    // There has been a focus request from another component
    if (src != this)
    {
     this.loseFocus();
    }
};

SVGComponent.prototype.toXML = function()
{
    var str = "<base src='" + this.src + "'>";
    for (var i = 0; i < this.actionListeners.length; ++i)
    {
     str += "<listener src='" + this.actionListeners[i].src + "'/>";
    }
    str += "</base>";

    return str;
};

