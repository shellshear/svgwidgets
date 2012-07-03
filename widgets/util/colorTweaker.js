// Convert between named colors and rgb values
var gNamedColorList = {
	aliceblue: [240, 248, 255],
	antiquewhite: [250, 235, 215],
	aqua: [0, 255, 255],
	aquamarine: [127, 255, 212],
	azure: [240, 255, 255],
	beige: [245, 245, 220],
	bisque: [255, 228, 196],
	black: [0, 0, 0],
	blanchedalmond: [255, 235, 205],
	blue: [0, 0, 255],
	blueviolet: [138, 43, 226],
	brown: [165, 42, 42],
	burlywood: [222, 184, 135],
	cadetblue: [95, 158, 160],
	chartreuse: [127, 255, 0],
	chocolate: [210, 105, 30],
	coral: [255, 127, 80],
	cornflowerblue: [100, 149, 237],
	cornsilk: [255, 248, 220],
	crimson: [220, 20, 60],
	cyan: [0, 255, 255],
	darkblue: [0, 0, 139],
	darkcyan: [0, 139, 139],
	darkgoldenrod: [184, 134, 11],
	darkgray: [169, 169, 169],
	darkgreen: [0, 100, 0],
	darkgrey: [169, 169, 169],
	darkkhaki: [189, 183, 107],
	darkmagenta: [139, 0, 139],
	darkolivegreen: [85, 107, 47],
	darkorange: [255, 140, 0],
	darkorchid: [153, 50, 204],
	darkred: [139, 0, 0],
	darksalmon: [233, 150, 122],
	darkseagreen: [143, 188, 143],
	darkslateblue: [72, 61, 139],
	darkslategray: [47, 79, 79],
	darkslategrey: [47, 79, 79],
	darkturquoise: [0, 206, 209],
	darkviolet: [148, 0, 211],
	deeppink: [255, 20, 147],
	deepskyblue: [0, 191, 255],
	dimgray: [105, 105, 105],
	dimgrey: [105, 105, 105],
	dodgerblue: [30, 144, 255],
	firebrick: [178, 34, 34],
	floralwhite: [255, 250, 240],
	forestgreen: [34, 139, 34],
	fuchsia: [255, 0, 255],
	gainsboro: [220, 220, 220],
	ghostwhite: [248, 248, 255],
	gold: [255, 215, 0],
	goldenrod: [218, 165, 32],
	gray: [128, 128, 128],
	grey: [128, 128, 128],
	green: [0, 128, 0],
	greenyellow: [173, 255, 47],
	honeydew: [240, 255, 240],
	hotpink: [255, 105, 180],
	indianred: [205, 92, 92],
	indigo: [75, 0, 130],
	ivory: [255, 255, 240],
	khaki: [240, 230, 140],
	lavender: [230, 230, 250],
	lavenderblush: [255, 240, 245],
	lawngreen: [124, 252, 0],
	lemonchiffon: [255, 250, 205],
	lightblue: [173, 216, 230],
	lightcoral: [240, 128, 128],
	lightcyan: [224, 255, 255],
	lightgoldenrodyellow: [250, 250, 210],
	lightgray: [211, 211, 211],
	lightgreen: [144, 238, 144],
	lightgrey: [211, 211, 211],
	lightpink: [255, 182, 193],
	lightsalmon: [255, 160, 122],
	lightseagreen: [32, 178, 170],
	lightskyblue: [135, 206, 250],
	lightslategray: [119, 136, 153],
	lightslategrey: [119, 136, 153],
	lightsteelblue: [176, 196, 222],
	lightyellow: [255, 255, 224],
	lime: [0, 255, 0],
	limegreen: [50, 205, 50],
	linen: [250, 240, 230],
	magenta: [255, 0, 255],
	maroon: [128, 0, 0],
	mediumaquamarine: [102, 205, 170],
	mediumblue: [0, 0, 205],
	mediumorchid: [186, 85, 211],
	mediumpurple: [147, 112, 219],
	mediumseagreen: [60, 179, 113],
	mediumslateblue: [123, 104, 238],
	mediumspringgreen: [0, 250, 154],
	mediumturquoise: [72, 209, 204],
	mediumvioletred: [199, 21, 133],
	midnightblue: [25, 25, 112],
	mintcream: [245, 255, 250],
	mistyrose: [255, 228, 225],
	moccasin: [255, 228, 181],
	navajowhite: [255, 222, 173],
	navy: [0, 0, 128],
	oldlace: [253, 245, 230],
	olive: [128, 128, 0],
	olivedrab: [107, 142, 35],
	orange: [255, 165, 0],
	orangered: [255, 69, 0],
	orchid: [218, 112, 214],
	palegoldenrod: [238, 232, 170],
	palegreen: [152, 251, 152],
	paleturquoise: [175, 238, 238],
	palevioletred: [219, 112, 147],
	papayawhip: [255, 239, 213],
	peachpuff: [255, 218, 185],
	peru: [205, 133, 63],
	pink: [255, 192, 203],
	plum: [221, 160, 221],
	powderblue: [176, 224, 230],
	purple: [128, 0, 128],
	red: [255, 0, 0],
	rosybrown: [188, 143, 143],
	royalblue: [65, 105, 225],
	saddlebrown: [139, 69, 19],
	salmon: [250, 128, 114],
	sandybrown: [244, 164, 96],
	seagreen: [46, 139, 87],
	seashell: [255, 245, 238],
	sienna: [160, 82, 45],
	silver: [192, 192, 192],
	skyblue: [135, 206, 235],
	slateblue: [106, 90, 205],
	slategray: [112, 128, 144],
	slategrey: [112, 128, 144],
	snow: [255, 250, 250],
	springgreen: [0, 255, 127],
	steelblue: [70, 130, 180],
	tan: [210, 180, 140],
	teal: [0, 128, 128],
	thistle: [216, 191, 216],
	tomato: [255, 99, 71],
	turquoise: [64, 224, 208],
	violet: [238, 130, 238],
	wheat: [245, 222, 179],
	white: [255, 255, 255],
	whitesmoke: [245, 245, 245],
	yellow: [255, 255, 0],
	yellowgreen: [154, 205, 50]
	};

// Search through the specified node and its children, and multiply fill and/or stroke by level.
// svgNode - the root node from which to change the levels
// level   - light level to set, consisting of {r:red_level, g:green_level, b:blue_level}
//           Each level should be a number between 0 and 2, where 0 is all black, 2 is all white, and 1 is normal.
// groupId - Set this when you're setting multiple different light levels in the same doc. 
//           Each separate lit group should be given a different groupId. This is so that
//           gradients and patterns get cloned properly.
function setLightLevel(svgNode, level, groupId)
{
	adjustAttribute("fill", svgNode, level, groupId);
	adjustAttribute("stroke", svgNode, level, groupId);
	adjustAttribute("stop-color", svgNode, level, groupId);
	
	if (svgNode.nodeName == "linearGradient" || svgNode.nodeName == "radialGradient")
	{
		// linearGradient and radialGradient can have links to the stops they use.
		var refId = svgNode.getAttributeNS(xlinkns, "href");
		if (refId != null && refId != "")
		{
			var nextInChain = null;
			
			var origRefId = svgNode.getAttribute(groupId + "orig_href");
			if (origRefId == null)
			{
				// Okay, there's no saved ref. 
				// We need to clone it, give it a new id, update this ref, and modify the clone.
				svgNode.setAttributeNS(xlinkns, groupId + "orig_href", refId);

				var currId = refId.substring(1); // knock off the "#"
				var refEl = document.getElementById(currId);

				if (refEl != null)
				{
					// No copy of the referenced element - create one.
					cloneEl = refEl.cloneNode(true);
					
					var newId = groupId + "copy_" + currId;

					// Update the id of the clone and the reference to it.
					cloneEl.setAttribute("id", newId);
					svgNode.setAttributeNS(xlinkns, "href", "#" + newId);

					nextInChain = cloneEl;

					// Put into DOM just before the referencing element.
					refEl.parentElement.insertBefore(cloneEl, refEl);
				}
			}
			else
			{
				nextInChain = document.getElementById(refId.substring(1));
			}
			
			// Repeat this process until we get to actual stop-colors
			setLightLevel(nextInChain, level, groupId);
		}
	}
	
	var currStyle = svgNode.getAttribute("style");
	if (currStyle != null)
	{
		var origStyle = svgNode.getAttribute(groupId + "orig_style");
		if (origStyle != null)
		{
			currStyle = origStyle;
		}

		var styleArr = currStyle.split(";");
		
		// find any stroke or fill
		var isModified = false;
		for (var i = 0; i < styleArr.length; ++i)
		{
			var currStyleEl = styleArr[i].split(":");
			var currStyleElName = currStyleEl[0].replace(/\s+/g, "").toLowerCase();
			if (currStyleElName == "fill" || currStyleElName == "stroke" || currStyleElName == "stop-color")
			{
				currStyleElValue = adjustLightLevel(currStyleEl[1], level, groupId);
				styleArr[i] = currStyleElName + ":" + currStyleElValue;
				isModified = true;
			}
		}

		if (isModified)
		{
			svgNode.setAttribute(groupId + "orig_style", currStyle);

			var newStyle = "";
			for (var i = 0; i < styleArr.length; ++i)
			{
				newStyle += styleArr[i] + ";"
			}
			svgNode.setAttribute("style", newStyle);
		}
		
	}

	for (var i = 0; i < svgNode.children.length; ++i)
	{
		setLightLevel(svgNode.children[i], level, groupId);
	}
}

function adjustAttribute(attr, svgNode, level, groupId)
{
	var currAttr = svgNode.getAttribute(attr);
	if (currAttr != null && currAttr != "none")
	{
		var origAttr = svgNode.getAttribute(groupId + "orig_" + attr);
		if (origAttr == null)
		{
			svgNode.setAttribute(groupId + "orig_" + attr, currAttr);
		}
		else
		{
			currAttr = origAttr;
		}
		currAttr = adjustLightLevel(currAttr, level, groupId);
		svgNode.setAttribute(attr, currAttr);
	}
}

function adjustLightLevel(currColor, level, groupId)
{
	// remove whitespace
	currColor = currColor.replace(/\s+/g, "");
	
	if (currColor == "none")
		return currColor;
	
	// There are three valid forms: named colour, #hex, and rgb(r,g,b)
	var red = 0;
	var green = 0;
	var blue = 0;

	if (currColor[0] == '#')
	{
		if (currColor.length == 4)
		{
			// #rgb - each hex digit h needs to be converted into hh
			red = parseInt(currColor[1], 16) * 17;
			green = parseInt(currColor[2], 16) * 17;
			blue = parseInt(currColor[3], 16) * 17;
		}
		else if (currColor.length == 7)
		{
			red = parseInt(currColor.substr(1, 2), 16);
			green = parseInt(currColor.substr(3, 2), 16);
			blue = parseInt(currColor.substr(5, 2), 16);
		}
	}
	else if (currColor.toLowerCase().indexOf("rgb(") == 0)
	{
		var split = currColor.split(",");
		red = parseInt(split[0].substr(4));
		green = parseInt(split[1]);
		blue = parseInt(split[2]);
	}
	else if (currColor.toLowerCase().indexOf("url(#") == 0)
	{
		// Ah. A gradient or pattern. 
		// We need to clone it, give it a new id, update this ref, and modify the clone.
		var currId = currColor.substring(5, currColor.length - 1);
		var refEl = document.getElementById(currId);
		
		// See if there's already a copy of this referenced element
		var newId = groupId + "copy_" + currId;
		var cloneEl = document.getElementById(newId);
		if (cloneEl == null)
		{
			// No copy of the referenced element - create one.
			cloneEl = refEl.cloneNode(true);
			
			// Update the id of the clone
			cloneEl.setAttribute("id", newId);
			
			// Put into DOM just before the referencing element.
			refEl.parentElement.insertBefore(cloneEl, refEl);
		}
		
		setLightLevel(cloneEl, level, groupId);
		
		return "url(#" + newId + ")";
	}
	else
	{
		// See if it's a named color
		result = gNamedColorList[currColor.toLowerCase()];
		if (result != null)
		{
			red = result[0];
			green = result[1];
			blue = result[2];
		}
	}
	
	if (level.r != null && level.r >= 0.0 && level.r <= 2.0)
	{
		if (level.r <= 1.0)
			red = Math.floor(red * level.r);
		else 
			red = Math.floor(red + (255 - red) * (level.r - 1.0));
	}
	
	if (level.g != null && level.g >= 0.0 && level.g <= 2.0)
	{
		if (level.g <= 1.0)
			green = Math.floor(green * level.g);
		else 
			green = Math.floor(green + (255 - green) * (level.g - 1.0));
	}
	
	if (level.b != null && level.b >= 0.0 && level.b <= 2.0)
	{
		if (level.b <= 1.0)
			blue = Math.floor(blue * level.b);
		else 
			blue = Math.floor(blue + (255 - blue) * (level.b - 1.0));
	}
	
	return "rgb(" + red + "," + green + "," + blue + ")";
}

