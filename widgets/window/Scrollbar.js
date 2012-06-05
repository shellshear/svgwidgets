// Scrollbar
// Consists of an up/left button, scrollbar region, and down/right button. 
// The scrollbar region consists of a background area with a dragbar on top of it.
// params:
// orientation - "h" or "v"
// width - width of the scrollbar
function Scrollbar(params)
{   
    this.params = params;
    if (!this.params)
       this.params = [];
       
    var direction;
    var backIcon;
    var fwdIcon;
    var width = 0;
    var height = 0;
    if (params.orientation == "h")
    {
       direction = "right";
       backIcon = new SVGElement("path", {d:"M0,0L0,20L-14,10z", fill:"blue"});
       fwdIcon = new SVGElement("path", {d:"M0,0L0,20L14,10z", fill:"blue"});
       height = params.width;
    }
    else
    {
       direction = "down";
       backIcon = new SVGElement("path", {d:"M0,0L20,0L10,-14z", fill:"blue"});
       fwdIcon = new SVGElement("path", {d:"M0,0L20,0L10,14z", fill:"blue"});
       width = params.width;
    }
    Scrollbar.baseConstructor.call(this, 0, 0, {direction:direction});

    this.backButton = new RectButton("backButton", 0, 0, backIcon, {fill:"white", stroke:"black", rx:2, width:params.width, height:params.width}, {fill:"blue"}, {fill:"blue"}, 4, false);
    this.backButton.addActionListener(this);
    this.appendChild(this.backButton);
   
    this.scrollbar = new SVGComponent(0, 0);
    this.scrollBg = new SVGElement("rect", {x:0, y:0, width:width, height:height, fill:"gray", stroke:"black"});
    this.scrollTop = new RectButton("scrollDragger", 0, 0, null, {fill:"white", stroke:"black", width:width, height:height}, {fill:"blue"}, {fill:"blue"}, 4, false);
    this.scrollTop.addActionListener(this);
   
    this.scrollbar.appendChild(this.scrollBg);
    this.scrollbar.appendChild(this.scrollTop);
    this.appendChild(this.scrollbar);
   
    this.fwdButton = new RectButton("fwdButton", 0, 0, fwdIcon, {fill:"white", stroke:"black", rx:2, width:params.width, height:params.width}, {fill:"blue"}, {fill:"blue"}, 4, false);
    this.fwdButton.addActionListener(this);
    this.appendChild(this.fwdButton);
    
    this.position = 0; // The position of the top of the dragbar
    this.scrollbarLength = 0; // The length of the scrollbar background
    this.dragbarLength = 0; // The length of the dragbar
}

KevLinDev.extend(Scrollbar, FlowLayout);

// Update the length and position of the dragbar. 
// internalLength - the length of the contents that the scrollbar is applied to
// externalLength - the length of the container
// position - the position in the contents to be placed at the top of the container
Scrollbar.prototype.updateScrollbar = function(internalLength, externalLength, position)
{
    this.scrollbarLength = externalLength - 2 * this.params.width; // Take into account the buttons
    this.dragbarLength = externalLength / internalLength * this.scrollbarLength;
	if (this.dragbarLength > this.scrollbarLength)
		this.dragbarLength = this.scrollbarLength;
   
    if (this.params.orientation == "h")
    {
        this.scrollBg.setAttribute("width", this.scrollbarLength);
        this.scrollTop.bgElement.rectAttributes.width = this.dragbarLength;
    }
    else
    {
        this.scrollBg.setAttribute("height", this.scrollbarLength);
        this.scrollTop.bgElement.rectAttributes.height = this.dragbarLength;
    }

	// Work out the position on the scrollbar of the dragbar
	var scrollbarPos = 0;
	if (internalLength - externalLength > 0)
		scrollbarPos = position * (this.scrollbarLength - this.dragbarLength) / (internalLength - externalLength);
    var retVal = this.setScrollbarPosition(scrollbarPos);

    this.scrollTop.refreshLayout();
    this.refreshLayout();

	return retVal; // This is an update to the position
}

Scrollbar.prototype.setDragPosition = function(x, y)
{
    this.setScrollbarPosition(this.params.orientation == "h" ? x : y);
    this.tellActionListeners(this, {type:"dragScrollbar", position:this.position / (this.scrollbarLength - this.dragbarLength)});
}

Scrollbar.prototype.setDragEnd = function()
{
}

// Set the scrollbar position
Scrollbar.prototype.setScrollbarPosition = function(position)
{
    this.position = position < 0 ? 0 : ((position > this.scrollbarLength - this.dragbarLength) ? this.scrollbarLength - this.dragbarLength : position);
    
    if (this.params.orientation == "h")
    {
        this.scrollTop.setPosition(this.position, 0);
    }
    else
    {
        this.scrollTop.setPosition(0, this.position);
    }

	return this.position;
}

Scrollbar.prototype.doAction = function(src, evt)
{
    if (src.src == "scrollDragger" && evt.type == "mousedown")
    {
       dragndrop_Start(this, evt, this.scrollTop.x, this.scrollTop.y);
    }
    else if (evt.type == "click")
    {
        if (src.src == "backButton")
        {
            this.setScrollbarPosition(this.position - this.dragbarLength / 2);
		    this.tellActionListeners(this, {type:"dragScrollbar", position:this.position / (this.scrollbarLength - this.dragbarLength)});
        }
        else if (src.src == "fwdButton")
        {            
            this.setScrollbarPosition(this.position + this.dragbarLength / 2);
		    this.tellActionListeners(this, {type:"dragScrollbar", position:this.position / (this.scrollbarLength - this.dragbarLength)});
        }
		evt.stopPropagation();
    }
}


