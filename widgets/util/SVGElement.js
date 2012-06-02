// SVGElement functionality is a modified version of
// Node_Builder.js
//
// @author Kevin Lindsey
// @version 1.3
// @copyright 2000-2002, Kevin Lindsey
// @license http://www.kevlindev.com/license.txt

function SVGElement(type, attributes, text)
{
    SVGElement.baseConstructor.call(this);
    
    this.src = type;
    
    if (type != null)
        this.svg = document.createElementNS(svgns, type);
    
    this.showing = true;
    this.childNodes = [];
    this.firstChild = null;
    this.lastChild = null;
    this.parentNode = null;
    this.tnode = null;

    this.addAttributes(attributes);

    if (text)
    {
        this.tnode = document.createTextNode(text);
        this.svg.appendChild(this.tnode);
    }
}

KevLinDev.extend(SVGElement, ActionObject);

// Wrap an existing SVG element. Note that we do not
// attempt to adapt existing children of the element.
SVGElement.prototype.wrapElement = function(existingElement)
{
    if (existingElement == null)
        return;
        
    this.src = existingElement.nodeName;
    this.svg = existingElement;
    
    this.showing = true;
    if (existingElement.hasAttribute("display") && existingElement.getAttribute("display") == "none")
        this.showing = false;
    
    // Also wrap all the children
    for (var i = 0; i < existingElement.children.length; i++)
    {
        var child = new SVGElement();
        child.wrapElement(existingElement.children[i]);

        // We wish to append the child, but the svg structure already
        // exists, so we don't mess with that.
        // Instead, we just add the child to the SVGElement list of childNodes
        this.childNodes.push(child);
        if (this.childNodes.length == 1)
        {
            this.firstChild = child;
        }
        this.lastChild = child;
    }
}

function wrapElementById(elementId)
{
    result = null;
    var el = document.getElementById(elementId);
    if (el != null)
    {
        result = new SVGElement();
        result.wrapElement(el);
    }
    return result;
}

function cloneElementById(doc, elementId)
{
    result = null;
    var el = doc.getElementById(elementId);
    if (el != null)
    {
        result = new SVGElement();
        result.cloneElement(el);
    }
    return result;
}

// Clone an existing svg node into our class heirarchy
SVGElement.prototype.cloneElement = function(existingElement)
{
    this.wrapElement(existingElement.cloneNode(true));
}

SVGElement.prototype.addAttributes = function(attributes)
{
    if (!attributes)
        return;
     
    for (var a in attributes)
    {
        var currNs = null;
     
        // WARNING: this test for the xlink namespace is a hack.
        if ( a.match(/^xlink:/) )
            currNs = "http://www.w3.org/1999/xlink";

        this.svg.setAttributeNS(currNs, a, attributes[a]);
    }
};

SVGElement.prototype.show = function()
{
    this.svg.setAttribute("display", "inline");
    this.showing = true;
};

SVGElement.prototype.hide = function()
{
    this.svg.setAttribute("display", "none");
    this.showing = false;
};

SVGElement.prototype.isShowing = function()
{
    return this.showing;
};

SVGElement.prototype.hasParent = function()
{
    return (this.parentNode != null);
}

SVGElement.prototype.detach = function()
{
    if (this.parentNode != null)
    {
        this.parentNode.removeChild(this);
    }
};

SVGElement.prototype.doAction = function(src, evt)
{
};

SVGElement.prototype.notifyResize = function(src)
{
};

// Shims for Node methods
SVGElement.prototype.hasAttribute = function(attr)
{
    return this.svg.hasAttribute(attr);
}

SVGElement.prototype.getAttribute = function(attr)
{
    return this.svg.getAttribute(attr);
}

SVGElement.prototype.setAttribute = function(attr, val)
{
    this.svg.setAttribute(attr, val);
};

SVGElement.prototype.setAttributeNS = function(ns, attr, val)
{
    this.svg.setAttributeNS(ns, attr, val);
};

SVGElement.prototype.removeAttribute = function(attr)
{
    this.svg.removeAttribute(attr);
};

SVGElement.prototype.setValue = function(val)
{
    if (this.tnode == null)
    {
     this.tnode = document.createTextNode(val);
     this.svg.appendChild(this.tnode);
    }
    else
    {
     this.tnode.nodeValue = val;
    }
};

// Prepend the child to the list of children
SVGElement.prototype.prependChild = function(mychild)
{
    if (this.svg.firstChild != null)
       this.svg.insertBefore(mychild.svg, this.svg.firstChild);
    else
       this.svg.appendChild(mychild.svg);
    
    this.childNodes.unshift(mychild);
    this.firstChild = this.childNodes[0];
    
    if (mychild)
        mychild.parentNode = this;
};

SVGElement.prototype.appendChild = function(mychild)
{
    this.svg.appendChild(mychild.svg);

    this.childNodes.push(mychild);
    if (this.childNodes.length == 1)
    {
     this.firstChild = mychild;
    }
    this.lastChild = mychild;
    
    if (mychild)
        mychild.parentNode = this;
};

SVGElement.prototype.insertBefore = function(newnode, existingnode)
{
    this.svg.insertBefore(newnode.svg, existingnode.svg);
    
    // Need to find the element in our childNodes list too
    var index = 0;
    for (var i = 0; i < this.childNodes.length; ++i)
    {
        if (this.childNodes[i] == existingnode)
        {
            this.childNodes.splice(i, 0, newnode);
            break;
        }
    }
    this.firstChild = this.childNodes[0];
    
    if (newnode)
        newnode.parentNode = this;
};

SVGElement.prototype.insertAfter = function(newnode, existingnode)
{
    if (existingnode != null && existingnode.svg.nextSibling != null)
       this.svg.insertBefore(newnode.svg, existingnode.svg.nextSibling);
    else
       this.svg.appendChild(newnode.svg);

    this.lastChild = this.childNodes[this.childNodes.length - 1];
};

SVGElement.prototype.removeChild = function(child)
{
    if (child == null)
        return;
        
    this.svg.removeChild(child.svg);

    for (var i = 0; i < this.childNodes.length; ++i)
    {
     	if (this.childNodes[i] == child)
     	{
         	this.childNodes.splice(i, 1);

         	this.firstChild = this.childNodes[0];
         	this.lastChild = this.childNodes[this.childNodes.length - 1];
            child.parentNode = null;

         	break;
     	}
    }
};

SVGElement.prototype.removeChildByIndex = function(childIndex)
{
    if (childIndex < 0 || childIndex >= this.childNodes.length)
        return;
        
    this.childNodes[childIndex].parentNode = null;
    
    this.svg.removeChild(this.childNodes[childIndex].svg);
    this.childNodes.splice(childIndex, 1);
    
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
};

SVGElement.prototype.removeChildren = function()
{
    while (this.svg.firstChild)
    {
     	this.svg.removeChild(this.svg.firstChild);
    }
    this.childNodes = [];
    this.firstChild = null;
    this.lastChild = null;
};

SVGElement.prototype.addEventListener = function(eventListener, target, useCapture)
{
    this.svg.addEventListener(eventListener, target, useCapture);
};

function replaceClipPaths(el)
{
	if (el.nodeType != 1)
		return;
	
	// Handle children first
	for (var i = 0; i < el.children.length; i++)
	{
		var testEl = el.children[i];
		var newChild = replaceClipPaths(testEl);
		if (newChild != testEl)
		{
			// Replace child
			el.insertBefore(newChild, testEl);
			el.removeChild(testEl);
		}
	}
	
	// Replace any clipping node and its children with a single rectangle
	if (el.nodeName == "svg" && el.width != null && el.height != null)
	{
		var replacementEl = document.createElementNS(svgns, "rect");
		replacementEl.setAttribute("x", el.getAttribute("x"));
		replacementEl.setAttribute("y", el.getAttribute("y"));
		replacementEl.setAttribute("width", el.getAttribute("width"));
		replacementEl.setAttribute("height", el.getAttribute("height"));
		replacementEl.setAttribute("stroke", "none");
		return replacementEl;		
	}
	
	return el;
}

// Get the bounding box, taking into account svg bounding windows 
SVGElement.prototype.getVisualBBox = function()
{
	var cloneEl = this.svg.cloneNode(true);
	cloneEl = replaceClipPaths(cloneEl);
	
	cloneEl.setAttribute("visibility", "hidden");
    document.documentElement.appendChild(cloneEl);
	var bbox = cloneEl.getBBox();
    document.documentElement.removeChild(cloneEl);
	return bbox;
}

// getBBox, fixing some firefox weirdness
SVGElement.prototype.getBBox = function()
{
    // Firefox won't calculate bounding box unless the node is
    // a part of the rendering tree.  Herein lies a hack to fix that.

    // Is the node connected to the document?
    var rootNode = this.svg;
    while (rootNode.parentNode != null)
       rootNode = rootNode.parentNode;
   
    if (rootNode == document.documentElement)
    {
       // We have a document root, so getBBox will work.
       try
       {
           bbox = this.svg.getBBox();
       }
       catch (err)
       {
           // The bbox couldn't be obtained (possibly because
           // the element had display="none")
           bbox = null;
       }
    }
    else
    {
       // Save its current position
       var nextSibling = this.svg.nextSibling;
       var parent = this.svg.parentNode;
   
       // attach directly to the document.
       document.documentElement.appendChild(this.svg);

       try
       {
           bbox = this.svg.getBBox();
       }
       catch (err)
       {
           // The bbox couldn't be obtained (possibly because
           // the element had display="none")
           bbox = null;
       }
   
       // Return to its proper place
       if (parent)
       {   
           if (nextSibling)
               parent.insertBefore(this.svg, nextSibling);
           else
               parent.appendChild(this.svg);
       }
       else
       {
           document.documentElement.removeChild(this.svg);
       }
    }
   
    return bbox;
};

