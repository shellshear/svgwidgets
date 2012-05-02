// Slider
// params:
// 		orientation - "h" or "v" (default: "h")
// 		sliderWidth - width of the Slider (default: 10)
//      sliderLength - length of the Slider (default: 200)
//      startPosition - starting position of the slider, as a proportion between 0 and 1 (default: 0)
//      draggerWidth - width of the dragger (default: 10)
//      draggerHeight - height of the dragger (default: 20)
//      sliderColor - color of the slider (default: "gray")
//      draggerColor - color of the dragger (default: "white")
function Slider(params)
{   
    this.params = params;
    if (!this.params)
       this.params = [];
    
	if (!this.params.orientation)
		this.params.orientation = "h";

	if (!this.params.sliderWidth || isNaN(this.params.sliderWidth))
		this.params.sliderWidth = 10;

	if (!this.params.sliderLength || isNaN(this.params.sliderLength))
		this.params.sliderLength = 200;

	if (!this.params.draggerWidth || isNaN(this.params.draggerWidth))
		this.params.draggerWidth = 10;

	if (!this.params.draggerHeight || isNaN(this.params.draggerHeight))
		this.params.draggerHeight = 20;

	if (!this.params.sliderColor)
		this.params.sliderColor = "gray";

	if (!this.params.draggerColor)
		this.params.draggerColor = "white";

	if (!this.params.startPosition || isNaN(this.params.startPosition))
		this.params.startPosition = 0;
	else if (this.params.startPosition > 1.0)
		this.params.startPosition = 1.0;
	else if (this.params.startPosition < 0.0)
		this.params.startPosition = 0.0;

    var direction;
    var backIcon;
    var fwdIcon;
    var sliderWidth = 0;
    var sliderHeight = 0;
    var draggerWidth = 0;
    var draggerHeight = 0;
	var bgX = 0;
	var bgY = 0;
    if (params.orientation == "h")
    {
       	direction = "right";
       	sliderHeight = this.params.sliderWidth;
		sliderWidth = this.params.sliderLength;
       	draggerHeight = this.params.draggerHeight;
		draggerWidth = this.params.draggerWidth;
		bgY = (this.params.sliderWidth < this.params.draggerHeight) ? (this.params.draggerHeight - this.params.sliderWidth) / 2 : 0;
    }
    else
    {
       	direction = "down";
       	sliderWidth = this.params.sliderWidth;
		sliderHeight = this.params.sliderLength;
       	draggerWidth = this.params.draggerHeight;
		draggerHeight = this.params.draggerWidth;
		bgX = (this.params.sliderWidth < this.params.draggerHeight) ? (this.params.draggerHeight - this.params.sliderWidth) / 2 : 0;
    }
    Slider.baseConstructor.call(this, 0, 0);
   
    this.slider = new SVGComponent(0, 0);
    this.scrollBg = new RectButton("scrollBG", bgX, bgY, null, {fill:this.params.sliderColor, stroke:"black", width:sliderWidth, height:sliderHeight}, {opacity:0}, {opacity:0}, 4, false);
    this.scrollBg.addActionListener(this);

    this.scrollTop = new RectButton("scrollDragger", 0, 0, null, {fill:this.params.draggerColor, stroke:"black", width:draggerWidth, height:draggerHeight}, {fill:"blue"}, {fill:"blue"}, 4, false);
    this.scrollTop.addActionListener(this);
   
    this.slider.appendChild(this.scrollBg);
    this.slider.appendChild(this.scrollTop);
    this.appendChild(this.slider);
   
	this.setSliderPosition(this.params.startPosition * this.params.sliderLength);
}

KevLinDev.extend(Slider, SVGComponent);

Slider.prototype.setDragPosition = function(x, y)
{
    this.setSliderPosition(this.params.orientation == "h" ? x : y);
}

Slider.prototype.setDragEnd = function()
{
}

// Set the Slider position
Slider.prototype.setSliderPosition = function(position)
{
    this.position = position < 0 ? 0 : (position > (this.params.sliderLength - this.params.draggerWidth) ? (this.params.sliderLength - this.params.draggerWidth) : position);
    
    if (this.params.orientation == "h")
    {
        this.scrollTop.setPosition(this.position, 0);
    }
    else
    {
        this.scrollTop.setPosition(0, this.position);
    }

    this.tellActionListeners(this, {type:"dragSlider", position:this.position / (this.params.sliderLength - this.params.draggerWidth)});
    
}

Slider.prototype.doAction = function(src, evt)
{
    if (src.src == "scrollDragger" && evt.type == "mousedown")
    {
       	dragndrop_Start(this, evt, this.scrollTop.x, this.scrollTop.y);
    }
	else if (src.src == "scrollBG" && evt.type == "click")
	{
		// Move the slider to the specified position
		var currPos = 0;
	    if (this.params.orientation == "h")
	    {
			currPos = (evt.clientX - this.svg.getCTM().e) - 0.5 * this.params.draggerWidth;
		}
		else
		{
			currPos = (evt.clientY - this.svg.getCTM().f) - 0.5 * this.params.draggerWidth;
		}
	    
		this.setSliderPosition(currPos);
	}
}


