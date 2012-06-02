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

	if (this.params.rectBorder != null)
	{
		// Put a border on the scrollbar region
		this.rectBorder = new SVGElement("rect", this.params.rectBorder);
		this.appendChild(this.rectBorder);
	}

    this.mask = new SVGRoot(0, 0, params.width, params.height);
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

ScrollbarRegion.prototype.refreshLayout = function()
{
	if (this.rectBorder != null)
	{
		this.rectBorder.setAttribute("width", this.params.width);
		this.rectBorder.setAttribute("height", this.params.height);
	}

    var bbox = this.contents.getVisualBBox();
    this.xExtent = bbox.x + bbox.width;
    this.yExtent = bbox.y + bbox.height;
   
    var showH = (this.xExtent > this.params.width);
    
    var scrollSpace = this.params.scrollbarWidth + this.params.scrollbarGap;
    
    // showV may be required if we just had to showH
    var showV = (this.yExtent > (showH ? this.params.height - scrollSpace : this.params.height));
    // showH needs to be recalculated - it may be required if we just had to showV
    showH = (this.xExtent > (showV ? this.params.width - scrollSpace : this.params.width));
    
    this.effectiveWidth = showV ? this.params.width - scrollSpace : this.params.width;
    this.effectiveHeight = showH ? this.params.height - scrollSpace : this.params.height;

    var scrollbarWidth = this.effectiveWidth - 2 * this.params.scrollbarWidth;
    var hProportion = this.effectiveWidth / this.xExtent;
    this.hBar.update(scrollbarWidth, hProportion);
    this.hBar.setPosition(0, this.effectiveHeight + this.params.scrollbarGap);

    var scrollbarHeight = this.effectiveHeight - 2 * this.params.scrollbarWidth;
    var vProportion = this.effectiveHeight / this.yExtent;
    this.vBar.update(scrollbarHeight, vProportion);
    this.vBar.setPosition(this.effectiveWidth + this.params.scrollbarGap, 0);

    if (showH)
    {
       this.mask.setAttribute("height", this.params.height - scrollSpace);
       this.hBar.show();
    }
    else
    {
        this.contents.setPosition(this.contents.x, 0);
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
        this.contents.setPosition(this.contents.x, 0);
        this.mask.setAttribute("width", this.params.width);
        this.vBar.hide();
    }
}

ScrollbarRegion.prototype.doAction = function(src, evt)
{
    if (evt.type == "dragScrollbar")
    {
       if (src.params.orientation == "h")
       {
           this.contents.setPosition(-(this.xExtent - this.effectiveWidth) * evt.position, this.contents.y);
       }
       else
       {
           this.contents.setPosition(this.contents.x, -(this.yExtent - this.effectiveHeight) * evt.position);
       }
    }
}

ScrollbarRegion.prototype.notifyResize = function(src)
{
    ScrollbarRegion.superClass.notifyResize.call(this, src);
	this.refreshLayout();
}

// We need to override the getVisualBBox, because as far as other elements are concerned, we're
// always the same size.
ScrollbarRegion.prototype.getVisualBBox = function()
{
	return {x:this.x, y:this.y, width:this.params.width, height:this.params.height};
}


