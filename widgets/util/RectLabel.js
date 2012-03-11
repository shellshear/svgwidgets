// A container that automatically fits a rectangle with the required border width
// and attributes around the contents.
function RectLabel(x, y, contents, rectAttributes, borderWidth)
{
    RectLabel.baseConstructor.call(this, x, y);
	this.rectAttributes = rectAttributes;
	this.borderWidth = borderWidth;
	if (this.borderWidth == null)
		this.borderWidth = 0;

	this.contentElement = new SVGComponent(0, 0);
    this.contentHolder = new SVGComponent(borderWidth, borderWidth);
    this.contentHolder.appendChild(this.contentElement);
    
   	this.isWidthSpecified = (this.rectAttributes.width != null);
   	this.isHeightSpecified = (this.rectAttributes.height != null);

    // Create the background rectangle
    this.bgRect = new SVGElement("rect", this.rectAttributes);
    
    this.appendChild(this.bgRect);
    this.appendChild(this.contentHolder);

	this.setContents(contents);
}

KevLinDev.extend(RectLabel, SVGComponent);

RectLabel.prototype.setContents = function(contents)
{
	this.contents = contents;
 	this.contentElement.removeChildren();

	if (this.contents != null)
	{
		this.contentElement.appendChild(contents);
	}
	
	this.refreshLayout();
}

RectLabel.prototype.notifyResize = function(src)
{
    RectLabel.superClass.notifyResize.call(this, src);
	this.refreshLayout();
}

RectLabel.prototype.refreshLayout = function()
{
    var bbox = null;
    
    if (this.bgRect == null)
        return;
   
    if (this.contents == null)
    {
       // Just refresh according to the specified width and height
       this.bgRect.setAttribute("width", this.rectAttributes.width);
       this.bgRect.setAttribute("height", this.rectAttributes.height);
       return;
    }

    bbox = this.contents.getBBox();
    this.contentElement.setPosition(-bbox.x, -bbox.y);
    
    // Fit the contents into the rectangle
    if (!this.isWidthSpecified && !this.isHeightSpecified)
    {
        this.rectAttributes.width = bbox.width + this.borderWidth * 2;
        this.rectAttributes.height = bbox.height + this.borderWidth * 2;

		this.bgRect.setAttribute("width", this.rectAttributes.width);
		this.bgRect.setAttribute("height", this.rectAttributes.height);
    }
    else if (!this.isWidthSpecified)
    {
        // User specified the height only
        
        var contentsHeight = this.rectAttributes.height - this.borderWidth * 2;
        if (contentsHeight <= this.borderWidth)
            contentsHeight = this.borderWidth;
        
        var scale = 1;
        if (bbox.height > 0)
            scale = contentsHeight / bbox.height;
        
        this.contentElement.setScale(scale);
        this.rectAttributes.width = bbox.width * scale + this.borderWidth * 2;
		this.bgRect.setAttribute("width", this.rectAttributes.width);

        // Set height anyway, in case it's been manually changed
		this.bgRect.setAttribute("height", this.rectAttributes.height);
    }
    else if (!this.isHeightSpecified)
    {
        // User specified the width only

        var contentsWidth = this.rectAttributes.width - this.borderWidth * 2;
        if (contentsWidth <= this.borderWidth)
            contentsWidth = this.borderWidth;
        
        var scale = 1;
        if (bbox.width > 0)
            scale = contentsWidth / bbox.width;
        
        this.contentElement.setScale(scale);
        this.rectAttributes.height = bbox.height * scale + this.borderWidth * 2;
		this.bgRect.setAttribute("height", this.rectAttributes.height);
		
		// Set width anyway, in case it's been manually changed
		this.bgRect.setAttribute("width", this.rectAttributes.width);
    }
    else
    {
        // User specified both height and width

        var contentsHeight = this.rectAttributes.height - this.borderWidth * 2;
        if (contentsHeight <= this.borderWidth)
            contentsHeight = this.borderWidth;
        
        var contentsWidth = this.rectAttributes.width - this.borderWidth * 2;
        if (contentsWidth <= this.borderWidth)
            contentsWidth = this.borderWidth;

        var scale = 1;
        if (bbox.height > 0 && bbox.width > 0)
            scale = Math.min(contentsHeight / bbox.height, contentsWidth / bbox.width);

        var xAdjust = (contentsWidth - scale * bbox.width) / 2;
        var yAdjust = (contentsHeight - scale * bbox.height) / 2;

        this.contentElement.setScale(scale);
        this.contentHolder.setPosition(this.borderWidth + xAdjust, this.borderWidth + yAdjust);

		// Set height and width anyway, in case they've been manually changed
		this.bgRect.setAttribute("width", this.rectAttributes.width);
		this.bgRect.setAttribute("height", this.rectAttributes.height);
    }

	this.tellResizeListeners(this);
}

