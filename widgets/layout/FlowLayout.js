// FlowLayout automatically lays out contained children in a horizontal
// or vertical line.
// It does not respect the x and y position of the contained children, 
// modifying them as required to fit into the area.
// 
// Parameters are:
//     direction: "up", "down", "left" or "right". Default is "right".
//     minSpacing: Minimum spacing between layout elements. Default is 0.
//     minWidth: Minimum width of layout. Default is 0.
//     flowAlignment: "left", "right", "centre", "justify". Applied only if
//                  minWidth > 0. Default is "left".
//     orthogonalAlignment: "top", "bottom", "centre". Default is "top".
function FlowLayout(x, y, params)
{
    this.layoutParams = params;
    if (this.layoutParams == null)
        this.layoutParams = {};
    
    if (this.layoutParams.direction == null)
        this.layoutParams.direction = "right";
    
    if (this.layoutParams.minSpacing == null)
        this.layoutParams.minSpacing = 0;
    
    this.layoutParams.spacing = this.layoutParams.minSpacing;

    if (this.layoutParams.minWidth == null)
        this.layoutParams.minWidth = 0;

    if (this.layoutParams.flowAlignment == null)
        this.layoutParams.flowAlignment = "left";

    if (this.layoutParams.orthogonalAlignment == null)
        this.layoutParams.orthogonalAlignment = "top";

    FlowLayout.baseConstructor.call(this, x, y);
    this.currentX = 0;
    this.currentY = 0;
    this.childLengthSum = 0;
    this.maxOrthogonal = 0;
}

KevLinDev.extend(FlowLayout, SVGComponent);

// override appendChild method
// We're actually encapsulating mychild in an SVGComponent which we
// can then safely manipulate into position.
// It is the responsibility of the child for its x and y positions 
// to be the same as all the other child elements (ie. usually 0, 0)
// otherwise the item will not be in place.
FlowLayout.prototype.appendChild = function(mychild)
{
    // Place the child
   
    var el = new SVGComponent(this.currentX, this.currentY);    
    el.appendChild(mychild);
    this.placeAppendedChild(el);
    
    FlowLayout.superClass.appendChild.call(this, el);

	if (this.layoutParams.minWidth <= 0 && this.layoutParams.orthogonalAlignment == "top")
	{
	    // We don't need to resize ourselves, as we've placed the
	    // appended child at the end anyway. So we just tell any
	    // resize listeners directly.
	    this.tellResizeListeners(this);
    }
    else
    {
        // We might need to reposition ourselves
        this.refreshLayout();
    }

	mychild.addResizeListener(this);	
}

FlowLayout.prototype.prependChild = function(mychild)
{
    var el = new SVGComponent(0, 0);
    el.appendChild(mychild);
    FlowLayout.superClass.prependChild.call(this, el);
    this.refreshLayout();

	mychild.addResizeListener(this);
}

FlowLayout.prototype.removeChild = function(mychild)
{
	// Look through the encapsulating components for mychild
	for (var i in this.childNodes)
	{
		if (this.childNodes[i].firstChild == mychild)
		{
			FlowLayout.superClass.removeChild.call(this, this.childNodes[i]);
			mychild.removeResizeListener(this);
			this.refreshLayout();
		    break;
		}
	}
}

FlowLayout.prototype.removeChildren = function()
{
	FlowLayout.superClass.removeChildren.call(this);
	this.refreshLayout();	
}

FlowLayout.prototype.placeAppendedChild = function(child)
{
    var bbox = child.getBBox();
    var orthogonalLength = 0;
    switch (this.layoutParams.direction)
    {
    case "left":
    case "right":
        orthogonalLength = bbox.height;
        break;
    case "up":
    case "down":
        orthogonalLength = bbox.width;
        break;
    }
    
    var orthogonalPos = 0;
	switch (this.layoutParams.orthogonalAlignment)
    {
    case "bottom":
        orthogonalPos = this.maxOrthogonal - orthogonalLength;
        break;
        
    case "centre":
        orthogonalPos = (this.maxOrthogonal - orthogonalLength) / 2;
        break;
        
    case "top":
    default:
        orthgonalPos = 0;
        break;
    }
    
    switch (this.layoutParams.direction)
    {
    case "left":
        this.currentX -= (bbox.width + this.layoutParams.spacing);
        // Fall through
    case "right":
        this.currentY = orthogonalPos;
        break;

    case "up":
        this.currentY -= (bbox.height + this.layoutParams.spacing);
        // Fall through
    case "down":
        this.currentX = orthogonalPos;
        break;
    }

    child.setPosition(this.currentX, this.currentY);

    switch (this.layoutParams.direction)
    {
    case "right":
        this.currentX += (bbox.width + this.layoutParams.spacing);
        break;
    default:
    case "down":
        this.currentY += (bbox.height + this.layoutParams.spacing);
        break;
    }
}

FlowLayout.prototype.refreshLayout = function()
{
    this.currentX = 0;
    this.currentY = 0;

	if (this.layoutParams.orthogonalAlignment != "top")
	{
        // Need to calculate maxOrthogonal
        this.maxOrthogonal = 0;
        for (var i in this.childNodes)
        {
			var bbox = this.childNodes[i].getBBox();
			
            switch (this.layoutParams.direction)
            {
            case "left":
            case "right":
                this.maxOrthogonal = Math.max(this.maxOrthogonal, bbox.height);
                break;
            case "up":
            case "down":
                this.maxOrthogonal = Math.max(this.maxOrthogonal, bbox.width);
                break;
            }
        }
    }
	
	if (this.layoutParams.minWidth > 0)
	{
        var sumLength = 0;
        var elCount = 0;
        for (var i in this.childNodes)
        {
			var bbox = this.childNodes[i].getBBox();
			
            switch (this.layoutParams.direction)
            {
            case "left":
            case "right":
                sumLength += bbox.width;
                break;
            case "up":
            case "down":
                sumLength += bbox.height;
                break;
            }
            elCount++;
        }

        var startPos = 0;
        switch (this.layoutParams.flowAlignment)
        {
        case "justify":
            // Calculate spacing
            this.layoutParams.spacing = (this.layoutParams.minWidth - sumLength) / (elCount - 1);
            if (this.layoutParams.spacing < this.layoutParams.minSpacing)
                this.layoutParams.spacing = this.layoutParams.minSpacing;
            break;
        
        case "right":
            // Calculate starting position
            startPos = this.layoutParams.minWidth - sumLength - (elCount - 1) * this.layoutParams.minSpacing;
            if (startPos < 0)
                startPos = 0;
            break;
        
        case "centre":
            // Calculate starting position
            startPos = (this.layoutParams.minWidth - sumLength - (elCount - 1) * this.layoutParams.minSpacing) / 2;
            if (startPos < 0)
                startPos = 0;
            break;
            
        case "left":
        default:
            // This is the default.
            startPos = 0;
            break;
        }

        // Apply the startPos
        switch (this.layoutParams.direction)
        {
        case "left":
        case "right":
            this.currentX = startPos;
            break;
        case "up":
        case "down":
            this.currentY = startPos;
            break;
        }
    }
    
    for (var i in this.childNodes)
    {
        this.placeAppendedChild(this.childNodes[i]);
    }

	this.tellResizeListeners(this);
}

FlowLayout.prototype.notifyResize = function(src)
{
    FlowLayout.superClass.notifyResize.call(this, src);
	this.refreshLayout();
}

