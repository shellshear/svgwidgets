// A window is a rectLabel containing a vertical FlowLayout with the first element being a title bar
// windowParams can have the following params:
// width            - width of the window (default: 200)
// height           - height of the window (default: 200)
// titleBarHeight   - the height of the title bar (default: 16)
// titleBarGap      - the gap between the title bar and the body (default: 2)
// scrollbarWidth   - the width of each scrollbar (default: 20)
// contentsSpacing  - spacing between elements added to the window's vertical flow layout (default: 0)
// allowUserResize  - allow the user to resize the window (default: false)
// 
// storePrefix      - a prefix that gets used by localStore (if that exists) to store
//                    the window position
//
// The contents of the window should be appended to window.contents, which is a flowLayout
// going down.
function SVGWindow(windowName, borderWidth, rectAttributes, windowParams)
{    
    this.windowName = windowName;
    this.windowParams = windowParams;
    this.borderWidth = borderWidth;

    if (this.windowParams == null)
       this.windowParams = [];
       
    if (this.windowParams.width == null)
        this.windowParams.width = 200;

    if (this.windowParams.height == null)
        this.windowParams.height = 200;
    
	if (this.windowParams.titleBarHeight == null)
        this.windowParams.titleBarHeight = 16;

    if (this.windowParams.statusBarHeight == null)
        this.windowParams.statusBarHeight = 10;

    if (this.windowParams.titleBarGap == null)
        this.windowParams.titleBarGap = 2;

    if (this.windowParams.scrollbarWidth == null)
        this.windowParams.scrollbarWidth = 20;

    if (this.windowParams.contentsSpacing == null)
        this.windowParams.contentsSpacing = 0;

	if (this.windowParams.allowUserResize == null)
	    this.windowParams.allowUserResize = false;

    // If we use local storage, determine the position of the window.
    var x = 0;
    var y = 0;
    if (this.windowParams.storePrefix && window.localStorage)
    {
        x = localStorage.getItem(this.windowParams.storePrefix + "_x");
        if (x == null || x < 0)
            x = 0;

        y = localStorage.getItem(this.windowParams.storePrefix + "_y");
        if (y == null || y < 0)
            y = 0;
    }
    SVGWindow.baseConstructor.call(this, x, y);

	this.resizeHandler = new Object();
	this.resizeHandler.owner = this;
	this.resizeHandler.startX= this.x;
	this.resizeHandler.startY = this.y;
	this.resizeHandler.startWidth = 0;
	this.resizeHandler.startHeight = 0;
	this.resizeHandler.setDragPosition = function(x, y)
		{
			this.owner.isDragging = true;
			
			// Set the new window height and width
			this.owner.windowParams.width = this.startWidth + (x - this.startX);
			this.owner.windowParams.height = this.startHeight + (y - this.startY);

			var minHt = this.owner.windowParams.scrollbarWidth * 3 + this.owner.windowParams.titleBarHeight + this.owner.windowParams.statusBarHeight;
			if (this.owner.windowParams.height < minHt)
				this.owner.windowParams.height = minHt;

			var minWidth = this.owner.windowParams.scrollbarWidth * 3;
			if (this.owner.windowParams.width < minWidth)
				this.owner.windowParams.width = minWidth;
				
			this.owner.refreshLayout();
		}

	this.resizeHandler.setDragEnd = function(x, y)
		{
			this.owner.isDragging = false;
			this.owner.windowStatusText.setValue(""); // Don't show the size of the window in the status any more
		}
		
    this.bgRect = new SVGElement("rect", rectAttributes);    
    this.appendChild(this.bgRect);
	this.bgRect.addEventListener("mousedown", this.bgRect, false);
	this.bgRect.addActionListener(this);

    this.titleBar = new FlowLayout(0, 0, {flowAlignment:"justify"});

    var textHt = this.windowParams.titleBarHeight - 2 * this.windowParams.titleBarGap;
    this.windowTitle = new RectButton("dragWindow", 0, 0, new SVGElement("text", {y:textHt, "font-size":textHt}, this.windowName), {fill:"white", stroke:"none", rx:2, width:20, height:this.windowParams.titleBarHeight}, {fill:"orange"}, {fill:"red"}, this.windowParams.titleBarGap, false);
    this.titleBar.appendChild(this.windowTitle);
    this.windowTitle.svg_cover.addEventListener("mousemove", this.windowTitle, false);
    this.windowTitle.addActionListener(this);

    // Close Button
    var xPath = "M0,0 L" + textHt + "," + textHt + " M0," + textHt + " L" + textHt + ",0";
    this.closeButton =  new RectButton("closeWindow", 0, 0, new SVGElement("path", {d:xPath, stroke:"black", x:0, y:10}), {fill:"white", stroke:"red", rx:2}, {fill:"orange"}, {fill:"red"}, this.windowParams.titleBarGap, false);    
    this.titleBar.appendChild(this.closeButton);
    this.closeButton.addActionListener(this);

	// Status bar
    this.statusBar = new FlowLayout(0, 0, {});

	// Status text
	this.windowStatusText = new SVGElement("text", {y:textHt, fill:"black", "font-size":textHt}, "");
	this.windowStatus = new RectLabel(0, 0, this.windowStatusText, {fill:"white", stroke:"none", opacity:"0", width:"100", height:this.windowParams.statusBarHeight}, 0);
	this.statusBar.appendChild(this.windowStatus);

	// Resize Button
	var resizeEl = new SVGElement("path", {d:"M9,3.5 L3.5,9 M9,6 L6,9 M9,8 L8,9", fill:"gray", stroke:"black", "stroke-width":"0.6"});
	var resizeElCover = new SVGElement("path", {d:"M10,0 L10,10 0,10 0,0z", fill:"white", opacity:"0"});
	this.resizeButton = new ParamButton2("resizeWindow", {x:0, y:0, width:10, height:10, normalElements: {normal:resizeEl, cover:resizeElCover} });
    this.resizeButton.addActionListener(this);
	this.statusBar.appendChild(this.resizeButton);

    // Contents of the window are inside a scrollbar region.
    this.contents = new FlowLayout(0, 0, {direction:"down", minSpacing:this.windowParams.contentsSpacing});
	this.scrollbarRegion = new ScrollbarRegion({width:100, height:100, scrollbarWidth:this.windowParams.scrollbarWidth}, this.contents);

    // WindowContents is the layout of the whole window - the title bar, then the scrollbar region, then the resize button
    this.windowContents = new FlowLayout(0, 0, {direction:"down", flowAlignment:"justify", minSpacing:3});
    this.windowContents.appendChild(this.titleBar);
    this.windowContents.appendChild(this.scrollbarRegion);
    this.appendChild(this.windowContents);
    this.appendChild(this.statusBar);

    this.fgRect = new SVGElement("rect", rectAttributes);
	this.fgRect.setAttribute("opacity", "0.3");
	this.fgRect.setAttribute("fill", "black");
	this.fgRect.hide();
	this.appendChild(this.fgRect);
    
    this.refreshLayout();
}

KevLinDev.extend(SVGWindow, SVGComponent);

// When the window title bar is moved, move the window
SVGWindow.prototype.setDragPosition = function(x, y)
{
    this.setPosition(x, y);
}

// Called when the window has finished dragging.
SVGWindow.prototype.setDragEnd = function()
{
}

SVGWindow.prototype.doAction = function(src, evt)
{
    SVGWindow.superClass.doAction.call(this, src, evt);

    if (src.src == "closeWindow" && evt.type == "click")
    {
        this.tellActionListeners(this, {type:"closeWindow"});
    }
    else if (src.src == "dragWindow" && evt.type == "mousedown")
    {
		// Tell listeners that this window has been selected
		this.tellActionListeners(this, {type:"windowSelected"});
		
		// Allow user to drag window
        dragndrop_Start(this, evt, this.x, this.y);
    }
    else if (src.src == "resizeWindow")
    {
		if (evt.type == "mousedown")
		{
			// Allow user to resize window
			this.resizeHandler.startX= this.x;
			this.resizeHandler.startY = this.y;
			this.resizeHandler.startWidth = this.windowParams.width;
			this.resizeHandler.startHeight = this.windowParams.height;
	        dragndrop_Start(this.resizeHandler, evt, this.x, this.y);
		}
	}
	else if (src == this.bgRect && evt.type == "mousedown")
	{
		// Tell listeners that this window has been selected
		this.tellActionListeners(this, {type:"windowSelected"});		
	}
}

SVGWindow.prototype.setPosition = function(x, y)
{
    SVGWindow.superClass.setPosition.call(this, x, y);
   
    if (this.windowParams.storePrefix && window.localStorage)
    {
        localStorage.setItem(this.windowParams.storePrefix + "_x", this.x);
        localStorage.setItem(this.windowParams.storePrefix + "_y", this.y);
    }
}

// The window can be disabled. This is done by putting a semi-opaque black
// cover over it.
SVGWindow.prototype.setAble = function(isAble)
{
    // Set whether this window is active or not
    if (isAble)
		this.fgRect.hide();
	else
		this.fgRect.show();
};

// Recalculate the size using window params
SVGWindow.prototype.refreshLayout = function()
{
    // Set the title bar button width
    this.windowTitle.bgElement.rectAttributes.width = this.windowParams.width - this.windowParams.titleBarHeight;
    this.windowTitle.refreshLayout();
	this.titleBar.refreshLayout();
    
    this.scrollbarRegion.params.width = this.windowParams.width;
    this.scrollbarRegion.params.height = this.windowParams.height - this.windowParams.titleBarHeight - 3 - this.windowParams.statusBarHeight;    
    this.scrollbarRegion.refreshLayout();
    this.bgRect.setAttribute("x", -this.borderWidth);
    this.bgRect.setAttribute("y", -this.borderWidth);    
    this.bgRect.setAttribute("width", this.windowParams.width + this.borderWidth * 2);
    this.bgRect.setAttribute("height", this.windowParams.height + this.borderWidth * 2);

    this.fgRect.setAttribute("x", -this.borderWidth);
    this.fgRect.setAttribute("y", -this.borderWidth);    
    this.fgRect.setAttribute("width", this.windowParams.width + this.borderWidth * 2);
    this.fgRect.setAttribute("height", this.windowParams.height + this.borderWidth * 2);
	
	if (this.isDragging)
		this.windowStatusText.setValue(this.windowParams.width + "x" + this.windowParams.height);
	
    this.windowStatus.rectAttributes.width = this.windowParams.width - 10;
    this.windowStatus.refreshLayout();
    this.statusBar.setPosition(0, this.windowParams.height - this.windowParams.statusBarHeight);    
	this.statusBar.refreshLayout();
	this.windowContents.refreshLayout();
}
