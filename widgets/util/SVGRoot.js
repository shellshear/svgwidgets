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

