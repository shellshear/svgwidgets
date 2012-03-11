// ParamButton.js
// Defines a (fairly) simple paramaterisable button

function ParamButton(src, x, y, bgElement, mouseoverElement, selectElement, coverElement, doSeparateCoverLayer)
{
    ParamButton.baseConstructor.call(this, x, y);

    // Button ID passed to the doAction when event happens
    this.src = src;

    this.svg_bg = bgElement;
    this.appendChild(this.svg_bg);

    this.svg_contents = null;
   
    this.svg_mouseover = mouseoverElement;
    this.svg_mouseover.hide();
    this.appendChild(this.svg_mouseover);

    this.svg_select = selectElement;
    this.svg_select.hide();
    this.appendChild(this.svg_select);

    this.doSeparateCoverLayer = doSeparateCoverLayer;
        
    this.svg_cover = coverElement;
    this.svg_cover.addEventListener("click", this, false);
    this.svg_cover.addEventListener("mouseover", this, false);
    this.svg_cover.addEventListener("mouseout", this, false);
    this.svg_cover.addEventListener("mouseup", this, false);
    this.svg_cover.addEventListener("mousedown", this, false);
    
    if (this.doSeparateCoverLayer)
    {
        var newGroup = new SVGComponent(x, y);
        newGroup.appendChild(this.svg_cover);
        this.addAuxiliaryComponent(newGroup);
    }
    else
    {
        this.appendChild(this.svg_cover);
    }
        
    this.isAble = true; // The button is active
    this.doToggle = false; // Doesn't toggle by default
    this.toggleState = false;

    // Set up action listener so the mouseover and mouseout are shown.
    this.addActionListener(this);
}

KevLinDev.extend(ParamButton, SVGComponent);

ParamButton.prototype.doAction = function(src, evt)
{
    ParamButton.superClass.doAction.call(this, this, evt);

    if (this.isAble)
    {
     if (evt.type == "mouseover")
     {
         this.svg_mouseover.show();
     }
     else if (evt.type == "mouseout")
     {
         this.svg_mouseover.hide();

         if (this.toggleState == false)
         {                        
             this.svg_select.hide();
         }
     }
     else if (evt.type == "mousedown")
     {
         if (this.doToggle)
         {
             // Toggle means that it stays in "select"
             // state until clicked again
             this.toggleState = !this.toggleState;

             if (this.toggleState == true)
             {                        
                 this.svg_select.show();
             }
             else
             {
                 this.svg_select.hide();
             }
             
         }
         else
         {
             this.svg_select.show();
         }
     }
     else if (evt.type == "mouseup" && !this.doToggle)
     {
         this.svg_select.hide();
     }
    }
};

ParamButton.prototype.setAble = function(isAble)
{
    // Set whether this button is active or not
    if (isAble)
    {
     this.isAble = true;
     this.svg_cover.show();
    }
    else
    {
     this.isAble = false;
     this.svg_cover.hide();
    }
};

ParamButton.prototype.setSelected = function(isSelected)
{
    // Set whether this button is selected or not
    if (isSelected)
    {
       this.svg_select.show();
       if (this.doToggle)
           this.toggleState = true;
    }
    else
    {
       this.svg_select.hide();
       if (this.doToggle)
           this.toggleState = false;
    }
}

ParamButton.prototype.setToggle = function(doToggle)
{
    this.doToggle = doToggle;
}

ParamButton.prototype.setContents = function(contents)
{
    // Remove the existing contents
    if (this.svg_contents != null)
       this.removeChild(this.svg_contents);
   
    // Put the contents underneath all the visual modifier elements    
    if (contents != null)
       this.insertBefore(contents, this.svg_mouseover);
   
    this.svg_contents = contents;
}

