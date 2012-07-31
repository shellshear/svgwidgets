// ParamButton2.js
// Defines a parameterisable button
// params can have the following members:
// 	x - x-position (default: 0)
// 	y - y-position (default: 0)
//  width - width of this button. 
//  height - height of this button.
//          If width or height are not defined, the width and height are adjusted to the contents size. 
//          If either is defined, the contents are scaled to fit instead.
//  normalElements - button appearance in non-selected state, as a set of buttonElements
//  selectedElements - button appearance in selected state, as a set of buttonElements
//  doSeparateCoverLayer - true/false (puts the cover into a separate layer)
//
// where:
// buttonElements: {normal, mouseover, disabled, cover} - they all share the cover
function ParamButton2(src, params)
{
    this.params = params;
    var x = 0;
    var y = 0;
    if (params.x)
        x = params.x;
    if (params.y)
        y = params.y;
    ParamButton.baseConstructor.call(this, x, y);
    
	// Default normal apperance
	if (this.params.normalElements == null)
	{
		this.params.normalElements = {};
		this.params.normalElements.normal = new SVGElement("rect", {width:10, height:10, rx:2, stroke:"black", fill:"none"});
	}

	if (this.params.selectedElements == null)
	{
		this.params.selectedElements = {};
	}
	
    if (params.width != null || params.height != null)
    {
        // Need to scale all the components
        for (var i in this.params.normalElements)
        {
            if (this.params.normalElements[i] != null)
                this.params.normalElements[i] = new ScaledComponent(0, 0, this.params.normalElements[i], this.params.width, this.params.height);
        }

        for (var i in this.params.selectedElements)
        {
            if (this.params.selectedElements[i] != null)
                this.params.selectedElements[i] = new ScaledComponent(0, 0, this.params.selectedElements[i], this.params.width, this.params.height);
        }
    }

    // Button ID passed to the doAction when event happens
    this.src = src;
    
    // things that affect appearance of the button
    this.isSelected = false;
    this.isDisabled = false;
    this.doToggle = false;

    // At any given time, button has two parts - appearance and cover.
    this.appearance = null;
    this.updateAppearance();

    this.cover = null;
    this.updateCover();
            
    this.addActionListener(this);
    
    if (this.params.normalElements && this.params.normalElements.cover)
    {
        this.params.normalElements.cover.svg.addEventListener("click", this, false);
        this.params.normalElements.cover.svg.addEventListener("mouseover", this, false);
        this.params.normalElements.cover.svg.addEventListener("mouseout", this, false);
        this.params.normalElements.cover.svg.addEventListener("mouseup", this, false);
        this.params.normalElements.cover.svg.addEventListener("mousedown", this, false);
    }

    if (this.params.selectedElements && this.params.selectedElements.cover)
    {
        this.params.selectedElements.cover.svg.addEventListener("click", this, false);
        this.params.selectedElements.cover.svg.addEventListener("mouseover", this, false);
        this.params.selectedElements.cover.svg.addEventListener("mouseout", this, false);
        this.params.selectedElements.cover.svg.addEventListener("mouseup", this, false);
        this.params.selectedElements.cover.svg.addEventListener("mousedown", this, false);
    }    
}

KevLinDev.extend(ParamButton2, SVGComponent);

ParamButton2.prototype.updateCover = function()
{
    var newCover = this.isSelected ? this.params.selectedElements.cover : this.params.normalElements.cover;
    
    if (newCover == this.cover)
        return;
    
    // Remove the old cover
    if (this.cover)
        this.cover.detach();

    if (!newCover)
        return;
        
    if (this.doSeparateCoverLayer)
    {
        this.cover = new SVGComponent(x, y);
        this.cover.appendChild(newCover);
        this.addAuxiliaryComponent(this.cover);
    }
    else
    {
        this.cover = newCover;
        this.appendChild(this.cover);
    }
}


ParamButton2.prototype.updateAppearance = function()
{
    var params = this.isSelected ? this.params.selectedElements : this.params.normalElements;
    
    if (!params)
        return;

    var state = this.isDisabled ? "disabled" : (this.isMouseover ? "mouseover" : "normal");
        
    var newAppearance = null;
    if (params[state])
        newAppearance = params[state];
    
    // If there's no appearance for the state, default to normal
    if (!newAppearance && params.normal)
        newAppearance = params.normal;
        
    if (newAppearance == this.appearance)
        return;
    
    // Remove the old appearance
    if (newAppearance != null)
	{
        if (this.appearance != null)
			this.appearance.detach();
    	
		this.appearance = newAppearance;
    	this.prependChild(this.appearance);
	}
}

ParamButton2.prototype.doAction = function(src, evt)
{
    ParamButton2.superClass.doAction.call(this, this, evt);

    if (!this.isDisabled)
    {
        if (evt.type == "mouseover")
        {
            this.isMouseover = true;
            this.updateAppearance();
	    }
        else if (evt.type == "mouseout")
        {
            this.isMouseover = false;
            this.updateAppearance();
	    }
        else if (evt.type == "mousedown")
        {
            if (this.doToggle)
            {
                this.setSelected(!this.isSelected);
            }
            else
            {
                this.setSelected(true);
            }
        }
        else if (evt.type == "mouseup")
        {
            //this.isSelected = false;
            this.updateAppearance();
	    }
    }
};

ParamButton2.prototype.setAble = function(isAble)
{
    // Set whether this button is active or not
    this.isDisabled = !isAble;
    this.updateAppearance();
};

// Set whether this button is selected or not
ParamButton2.prototype.setSelected = function(isSelected)
{
	if (this.isSelected == isSelected)
		return;
		
    this.isSelected = isSelected;
    this.updateAppearance();
	this.tellActionListeners(this, {type:"selection", value:this.isSelected});
};

ParamButton2.prototype.setToggle = function(doToggle)
{
    this.doToggle = doToggle;
}

function getParamButtonIdSet(idGroupName)
{
    return {x:0, y:0, 
		normalElements: {
			normal:cloneElementById(document, idGroupName + "Normal"), 
			mouseover:cloneElementById(document, idGroupName + "NormalOver"),
			cover:cloneElementById(document, idGroupName + "Cover")}, 
		selectedElements: {
			normal:cloneElementById(document, idGroupName + "Selected"), 
			mouseover:cloneElementById(document, idGroupName + "SelectedOver"),
			cover:cloneElementById(document, idGroupName + "Cover")
			}
		};
}

function makeSimpleCheckboxParamButtonIdSet()
{
	var normalButton = new SVGElement("rect", {width:10, height:10, rx:2, stroke:"black", fill:"none"});
	var normalMouseoverButton = new SVGElement("rect", {width:10, height:10, rx:2, stroke:"red", fill:"none"});
	var normalCoverButton = new SVGElement("rect", {width:10, height:10, rx:2, stroke:"none", fill:"white", opacity:0});

	var selectedButton = new SVGElement("g");
	selectedButton.appendChild(new SVGElement("rect", {width:10, height:10, rx:2, stroke:"black", fill:"none"}));
	selectedButton.appendChild(new SVGElement("path", {d:"M2,2L8,8M8,2L2,8", stroke:"black", fill:"black"}));
	var selectedMouseoverButton = new SVGElement("g");
	selectedMouseoverButton.appendChild(new SVGElement("rect", {width:10, height:10, rx:2, stroke:"red", fill:"none"}));
	selectedMouseoverButton.appendChild(new SVGElement("path", {d:"M2,2L8,8M8,2L2,8", stroke:"red", fill:"none"}));
	var selectedCoverButton = new SVGElement("rect", {width:10, height:10, rx:2, stroke:"none", fill:"white", opacity:0});
	
    return {x:0, y:0, 
		normalElements: {
			normal:normalButton, 
			mouseover:normalMouseoverButton,
			cover:normalCoverButton},
		selectedElements: {
			normal:selectedButton, 
			mouseover:selectedMouseoverButton,
			cover:selectedCoverButton
			}
		};
}

