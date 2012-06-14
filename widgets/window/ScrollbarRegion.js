// A region with automatic scrollbars. If the contents are wider than the container,
// put scrollbars on the container.
// params contents:
// - width - width of the container (default: 100)
// - height - height of the container (default: 100)
// - scrollbarWidth - width of the scrollbar (default: 10)
// - scrollbarGap - gap between contents and scrollbar/s (default: 3)
// - rectBorder - params for a rect that serves as a border. (default: null)
//                The width and height of the rect will be synchronised to the ScrollbarRegion size.
function ScrollbarRegion(params, contents)
{    
    ScrollbarRegion.baseConstructor.call(this, 0, 0);
    this.params = params;

    if (this.params.scrollbarWidth == null)
        this.params.scrollbarWidth = 10;

    if (this.params.scrollbarGap == null)
        this.params.scrollbarGap = 3;

    if (this.params.width == null)
        this.params.width = 100;

	if (this.params.height == null)
	    this.params.height = 100;

	// Initial scroll position
	this.scroll_x = 0; 
	this.scroll_y = 0;

	if (this.params.rectBorder != null)
	{
		// Put a border on the scrollbar region
		this.rectBorder = new SVGElement("rect", this.params.rectBorder);
		this.appendChild(this.rectBorder);
	}

    this.mask = new SVGRoot({width:params.width, height:params.height});
    this.contents = new SVGComponent(0, 0);
    this.contents.appendChild(contents);
    this.mask.appendChild(this.contents);
    this.appendChild(this.mask);

    // horizontal scrollbar
    this.hBar = new Scrollbar({orientation:"h", width:this.params.scrollbarWidth});
    this.appendChild(this.hBar);
    this.hBar.addActionListener(this);

    // vertical scrollbar
    this.vBar = new Scrollbar({orientation:"v", width:this.params.scrollbarWidth});
    this.appendChild(this.vBar);
    this.vBar.addActionListener(this);

    this.refreshLayout();
}

KevLinDev.extend(ScrollbarRegion, SVGComponent);

// Refresh the layout of the scrollbar region.
// Resize the scrollbars if necessary.
ScrollbarRegion.prototype.refreshLayout = function()
{
	if (this.rectBorder != null)
	{
		this.rectBorder.setAttribute("width", this.params.width);
		this.rectBorder.setAttribute("height", this.params.height);
	}

    var bbox = this.contents.getVisualBBox();
    this.xExtent = bbox.width; // The extent of the contents 
    this.yExtent = bbox.height;
   
	// Show the horizontal scrollbar if the x extent is larger than the width of the scroll window
    var showH = (this.xExtent > this.params.width);
    
    var scrollSpace = this.params.scrollbarWidth + this.params.scrollbarGap;
    
    // Show the vertical scrollbar if necessary
    var showV = (this.yExtent > (showH ? this.params.height - scrollSpace : this.params.height));
    
	// showH needs to be recalculated - it may be required if we just had to showV
    showH = (this.xExtent > (showV ? this.params.width - scrollSpace : this.params.width));
    
    this.effectiveWidth = showV ? this.params.width - scrollSpace : this.params.width;
    this.effectiveHeight = showH ? this.params.height - scrollSpace : this.params.height;

    this.updateContentPosition();

	// Update the horizontal scrollbar.
    this.hBar.updateScrollbar(this.xExtent, this.effectiveWidth, this.scroll_x);
    this.hBar.setPosition(0, this.effectiveHeight + this.params.scrollbarGap);

    this.vBar.updateScrollbar(this.yExtent, this.effectiveHeight, this.scroll_y);
    this.vBar.setPosition(this.effectiveWidth + this.params.scrollbarGap, 0);

    if (showH)
    {
       this.mask.setAttribute("height", this.params.height - scrollSpace);
       this.hBar.show();
    }
    else
    {
        this.mask.setAttribute("height", this.params.height);
        this.hBar.hide();
    }
   
    if (showV)
    {
       this.mask.setAttribute("width", this.params.width - scrollSpace);
       this.vBar.show();
    }
    else
    {
        this.mask.setAttribute("width", this.params.width);
        this.vBar.hide();
    }

}

// Set the scrollbar position, as a percentage of the possible range
// orientation is "h" or "v"
// position is a number from 0 to 1
ScrollbarRegion.prototype.updateScrollbarPosition = function(orientation, position)
{
	this.scroll_x = -this.contents.x;
	this.scroll_y = -this.contents.y;
	
	if (orientation == "h")
	{
    	this.scroll_x = (this.xExtent - this.effectiveWidth) * position;
	}
	else
	{
    	this.scroll_y = (this.yExtent - this.effectiveHeight) * position;
	}
	
	this.updateContentPosition();
}

ScrollbarRegion.prototype.updateContentPosition = function()
{
	// Update the current position of the contents within the scroll window
	// if necessary. 
	// 
	// <--------------xExtent----------------->
	// <--scroll_x-><---effectiveWidth--->    
	//            <------params.width------>
	if (this.scroll_x + this.effectiveWidth > this.xExtent)
	{
		this.scroll_x = this.xExtent - this.effectiveWidth;
	}
	
	if (this.scroll_x < 0)
	{
		this.scroll_x = 0;
	}

	if (this.scroll_y + this.effectiveHeight > this.yExtent)
	{
		this.scroll_y = this.yExtent - this.effectiveHeight;
	}
	
	if (this.scroll_y < 0)
	{
		this.scroll_y = 0;
	}

	this.contents.setPosition(-this.scroll_x, -this.scroll_y);
}

ScrollbarRegion.prototype.doAction = function(src, evt)
{
    if (evt.type == "dragScrollbar")
    {
		this.updateScrollbarPosition(src.params.orientation, evt.position);
    }
}

ScrollbarRegion.prototype.notifyResize = function(src)
{
    ScrollbarRegion.superClass.notifyResize.call(this, src);
	this.refreshLayout();
}
