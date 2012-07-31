var svgns = "http://www.w3.org/2000/svg";
var xmlns = "http://www.w3.org/XML/1998/namespace";
var xlinkns = "http://www.w3.org/1999/xlink";

// Inheritance handler
KevLinDev = {};

KevLinDev.extend = function(subclass, baseclass)
{
    function inheritance() {};
    inheritance.prototype = baseclass.prototype;

    subclass.prototype = new inheritance();
    subclass.prototype.constructor = subclass;
    subclass.baseConstructor = baseclass;
    subclass.superClass = baseclass.prototype;
};

function htmlspecialchars(string)
{
    var result = "";
    for (i = 0; i < string.length; i++)
    {
        switch (string[i])
        {
        case '<':
            result += "&lt;";
            break;

        case '>':
            result += "&gt;";
            break;
        
        case '\"':
            result += "&quot;";
            break;
            
        case "\'":
            result += "&#039;";
            break;
            
        case "&":
            result += "&amp;";
            break;
        
        default:
            result += string[i];
            break;
        }
    }
    
    return result;
}

function htmlspecialchars_decode(string)
{
    return string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');    
}

function createXMLDoc(elementName)
{
	var result = null;
	if (document.implementation && document.implementation.createDocument) 
	{
	    result = document.implementation.createDocument(null, elementName, null);
	}
	else
	{
	    result = new ActiveXObject("MSXML2.DOMDocument"); 
	    result.loadXML("<" + elementName + "/>");
	}
	return result;
}

function cloneObject(obj)
{
	if (obj == null || typeof(obj) != 'object')
		return obj;
	
	var tmp = obj.constructor();
	
	for (var i in obj)
		tmp[i] = cloneObject(obj[i]);
	
	return tmp;
}
