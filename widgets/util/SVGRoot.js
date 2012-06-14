// A root SVG element that has a clipping bounding box
function SVGRoot(clipBox)
{
	this.clipBox = clipBox;
	
	if (this.clipBox == null)
	{
		this.clipBox = {};
	}
	
	if (this.clipBox.x == null)
	{
		this.clipBox.x = 0;
	}
    
	if (this.clipBox.y == null)
	{
		this.clipBox.y = 0;
	}

	if (this.clipBox.width == null)
	{
		this.clipBox.width = 0;
	}

	if (this.clipBox.height == null)
	{
		this.clipBox.height = 0;
	}
	
	SVGComponent.baseConstructor.call(this, "svg", this.clipBox);
}

KevLinDev.extend(SVGRoot, SVGElement);

SVGRoot.prototype.setPosition = function(x, y)
{
    if (x != null)
	{
       	this.clipBox.x = x;
    	this.setAttribute("x", x);
	}
    
	if (y != null)
    {
   		this.clipBox.y = y;
	    this.setAttribute("y", y);
	}
}

SVGRoot.prototype.setClipRect = function(bbox)
{
	this.clipBox = bbox;
	this.setAttribute("x", this.clipBox.x);
	this.setAttribute("y", this.clipBox.y);
	this.setAttribute("width", this.clipBox.width);
	this.setAttribute("height", this.clipBox.height);
}
