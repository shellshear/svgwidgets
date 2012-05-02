// RectButton puts a rect with rectAttrs around the bgElement's
// bounding box, with borderWidth clearance on each side.
// If width and/or height are specified in rectAttributes, it will
// scale the contents to fit into the specified rectangle.
function RectButton(src, x, y, contents, rectAttributes, mouseoverAttributes, selectAttributes, borderWidth, doSeparateCoverLayer)
{
	this.mouseoverAttributes = mouseoverAttributes;
	this.selectAttributes = selectAttributes;
	
    this.bgElement = new RectLabel(0, 0, contents, rectAttributes, borderWidth);
 
    this.mouseoverElement = new SVGElement("rect");
    this.selectElement = new SVGElement("rect");
    this.coverElement = new SVGElement("rect");

	this.setContents(contents);

    RectButton.baseConstructor.call(this, src, x, y, this.bgElement, this.mouseoverElement, this.selectElement, this.coverElement, doSeparateCoverLayer);
}

KevLinDev.extend(RectButton, ParamButton);

RectButton.prototype.setContents = function(contents)
{
    this.bgElement.setContents(contents);
    this.refreshLayout();
}

RectButton.prototype.refreshLayout = function()
{
    this.bgElement.refreshLayout();

    this.mouseoverElement.setAttribute("width", this.bgElement.rectAttributes.width);
    this.mouseoverElement.setAttribute("height", this.bgElement.rectAttributes.height);
    this.mouseoverElement.setAttribute("opacity", 0.3);
    for (var i in this.mouseoverAttributes)
    {
        this.mouseoverElement.setAttribute(i, this.mouseoverAttributes[i]);
    }
    
    this.selectElement.setAttribute("width", this.bgElement.rectAttributes.width);
    this.selectElement.setAttribute("height", this.bgElement.rectAttributes.height);
    this.selectElement.setAttribute("opacity", 0.3);
    for (var i in this.selectAttributes)
    {
        this.selectElement.setAttribute(i, this.selectAttributes[i]);
    }
    
    this.coverElement.setAttribute("width", this.bgElement.rectAttributes.width);
    this.coverElement.setAttribute("height", this.bgElement.rectAttributes.height);
    this.coverElement.setAttribute("opacity", 0);
}

