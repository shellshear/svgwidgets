// Manages a set of windows underneath us.
//
// Has the following functionality:
// - Moves selected window to top of z-order 
// - Disables all other windows if a window claims exclusive focus (TODO)
// - Keeps a focus ring of the windows (TODO)
//
function SVGWindowManager()
{
    SVGWindowManager.baseConstructor.call(this, 0, 0);
}

KevLinDev.extend(SVGWindowManager, SVGComponent);

// Add a window to the list of windows we're managing
SVGWindowManager.prototype.addWindow = function(newWindow)
{
	this.appendChild(newWindow);
	newWindow.addActionListener(this);
}

SVGWindowManager.prototype.setPositionConstraints = function(x, y, width, height)
{
	this.childConstraints = {x:x, y:y, width:width, height:height};
}

SVGWindowManager.prototype.doAction = function(src, evt)
{
    SVGWindowManager.superClass.doAction.call(this, src, evt);

    if (evt.type == "windowSelected")
    {
		this.appendChild(src);
	}
}