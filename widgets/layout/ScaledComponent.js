// Scales the component to fit into the specified width and height.
function ScaledComponent(x, y, contents, width, height)
{
    ScaledComponent.baseConstructor.call(this, x, y);
    this.width = width;
    this.height = height;
    
    this.contentElement = new SVGComponent(0, 0);
    this.appendChild(this.contentElement);
    this.setContents(contents);
}

KevLinDev.extend(ScaledComponent, SVGComponent);

ScaledComponent.prototype.setContents = function(contents)
{
	this.contents = contents;
 	this.contentElement.removeChildren();

	if (this.contents != null)
	{
		this.contentElement.appendChild(contents);
	}
	
	this.refreshLayout();
}

ScaledComponent.prototype.notifyResize = function(src)
{
    ScaledComponent.superClass.notifyResize.call(this, src);
	this.refreshLayout();
}

ScaledComponent.prototype.refreshLayout = function()
{
	if (this.contents == null)
		return;
		
    var bbox = this.contents.getBBox();
    this.contentElement.setPosition(-bbox.x, -bbox.y);
    
    // Fit the contents into the rectangle
    if (this.width == null && this.height == null)
    {
        // Nothing to do.
    }
    else if (this.width == null)
    {
        // User specified the height only        
        var scale = 1;
        if (bbox.height > 0)
            scale = this.height / bbox.height;
        
        this.contentElement.setScale(scale);
    }
    else if (this.height == null)
    {
        // User specified the width only
        var scale = 1;
        if (bbox.width > 0)
            scale = this.width / bbox.width;
        
        this.contentElement.setScale(scale);
    }
    else
    {
        // User specified both height and width
        var scale = 1;
        if (bbox.width > 0 && bbox.height > 0)
            scale = Math.min(this.width / bbox.width, this.height / bbox.height);
        
        this.contentElement.setScale(scale);
    }

	this.tellResizeListeners(this);
}

