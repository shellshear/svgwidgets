// SimpleButton.js
// Defines a (fairly) simple button
// states is a list of attributes to be applied to the cover whenever the
// appropriate state is reached.
// states are:
// normal
// focus (default value is normal)
// over (default value is normal)
// select (default value is normal)
// disable (default value is normal)
// eg. states = {normal:{stroke:"white"}, focus:{stroke:"red"}}

function SimpleButton(src, coverType, coverAttributes, x, y, states)
{
    SimpleButton.baseConstructor.call(this, x, y);

    // Button ID passed to the doAction when event happens
    this.src = src;

    // Set up the button states
    this.states = states;
    if (this.states == null)
     this.states = {};
     
    if (this.states.focus == null)
     this.states.focus = this.states.normal;
     
    if (this.states.over == null)
     this.states.over = this.states.normal;

    if (this.states.select == null)
     this.states.select = this.states.normal;

    if (this.states.disable == null)
     this.states.disable = this.states.normal;

    // visible part of cover
    this.svg_border = new SVGElement(coverType, coverAttributes);
    this.svg_border.addAttributes(this.states.normal);
    this.appendChild(this.svg_border);

    // Cover
    this.svg_buttonCover = new SVGElement(coverType, coverAttributes);
    this.svg_buttonCover.addAttributes({fill:"white", "fill-opacity":0, stroke:"none"});
    this.svg_buttonCover.addEventListener("click", this, false);
    this.svg_buttonCover.addEventListener("mouseover", this, false);
    this.svg_buttonCover.addEventListener("mouseout", this, false);
    this.svg_buttonCover.addEventListener("mouseup", this, false);
    this.svg_buttonCover.addEventListener("mousedown", this, false);
    this.appendChild(this.svg_buttonCover);

    this.isAble = true; // The button is active
    this.doToggle = false; // Doesn't toggle by default
    this.toggleState = false;

    // Set up action listener so the mouseover and mouseout are shown.
    this.addActionListener(this);
}

KevLinDev.extend(SimpleButton, SVGComponent);

SimpleButton.prototype.addSVG = function(type, attributes, text)
{
    var newNode = new SVGElement(type, attributes, text);
    this.appendChild(newNode);

    this.liftButtonCover();

    return newNode;
};

// Make sure the cover is on top.
SimpleButton.prototype.liftButtonCover = function()
{
    this.appendChild(this.svg_buttonCover);
};

SimpleButton.prototype.doAction = function(src, evt)
{
    SimpleButton.superClass.doAction.call(this, this, evt);

    if (this.isAble)
    {
     if (!this.hasFocus)
     {
         if (evt.type == "mouseover")
         {
             this.svg_border.addAttributes(this.states.over);
         }
         else if (evt.type == "mouseout")
         {
             if (this.doToggle && this.toggleState == true)
             {
                 this.svg_border.addAttributes(this.states.select);
             }
             else
             {
                 this.svg_border.addAttributes(this.states.normal);
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
                     this.svg_border.addAttributes(this.states.select);
                 }
                 else
                 {
                     this.svg_border.addAttributes(this.states.normal);
                 }
                 
             }
             else
             {
                 this.svg_border.addAttributes(this.states.select);
             }
         }
         else if (evt.type == "mouseup" && !this.doToggle)
         {
             this.svg_border.addAttributes(this.states.normal);
         }
     }
     else if (evt.type == "keypress")
     {
         var charCode = evt.keyCode;
         if (evt.charCode)
         {
             charCode = evt.charCode;
         }
         if (charCode == 10 || charCode == 13)
         {
             // Enter key
             this.loseFocus();
             this.tellActionListeners(this, evt);
         }
     }
    }
};

SimpleButton.prototype.setAble = function(isAble)
{
    // Set whether this button is active or not
    if (isAble)
    {
     this.isAble = true;
     this.svg_border.addAttributes(this.states.normal);
     this.svg_buttonCover.show();
    }
    else
    {
     this.isAble = false;
     this.svg_buttonCover.hide();
     this.svg_border.addAttributes(this.states.disable);
    }
};

SimpleButton.prototype.setFocus = function()
{
    if (!this.hasFocus)
    {   
     this.svg_border.addAttributes(this.states.focus);
    }

    SimpleButton.superClass.setFocus.call(this);    
};

SimpleButton.prototype.loseFocus = function()
{
    if (this.hasFocus)
    {
     this.svg_border.addAttributes(this.states.normal);
    }

    SimpleButton.superClass.loseFocus.call(this);    
};

SimpleButton.prototype.setToggle = function(doToggle)
{
    this.doToggle = doToggle;
}

SimpleButton.prototype.setSelected = function(isSelected)
{
    // Set whether this button is selected or not
    if (isSelected)
    {
        this.svg_border.addAttributes(this.states.select);
        if (this.doToggle)
            this.toggleState = true;
    }
    else
    {
        this.svg_border.addAttributes(this.states.normal);
        if (this.doToggle)
            this.toggleState = false;
    }
}

