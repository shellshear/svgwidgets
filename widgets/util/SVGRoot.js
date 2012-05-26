// A root SVG element that has a clipping bounding box
function SVGRoot(x, y, width, height)
{
    SVGComponent.baseConstructor.call(this, "svg", {x:x, y:y, width:width, height:height});
}

KevLinDev.extend(SVGRoot, SVGElement);

SVGRoot.prototype.setPosition = function(x, y)
{
    if (x == null)
       x = 0;

    if (y == null)
       y = 0;

    this.svg.setAttribute("x", x);
    this.svg.setAttribute("y", y);
}

SVGRoot.prototype.getVisualBBox = function()
{
	var result = SVGRoot.superClass.getVisualBBox.call(this);
    var x = this.getAttribute("x");
    var y = this.getAttribute("y");
    var width = this.getAttribute("width");
    var height = this.getAttribute("height");

	// Restrict the bbox to the contents here.
	if (result.x < x)
		result.x = x;
	if (result.y < y)
		result.y = y;
	if (result.x + result.width > x + width)
		result.width = x + width - result.x;
	if (result.y + result.height > y + height)
		result.height = y + height - result.y;
	
	return result;
}
