var g_dragndrop = new DragNDropHandler();

function DragNDropHandler()
{
    this.dragObject = null;
    this.offsetX = 0;
    this.offsetY = 0;
}

DragNDropHandler.prototype.dragstart = function(src, evt, initialX, initialY)
{
    this.dragObject = src;

    var newScale = evt.target.ownerDocument.documentElement.currentScale;
    var translation = evt.target.ownerDocument.documentElement.currentTranslate;
    this.offsetX = (evt.clientX - translation.x) / newScale - initialX;
    this.offsetY = (evt.clientY - translation.y) / newScale - initialY;
}

DragNDropHandler.prototype.dragmove = function(evt)
{
    if (this.dragObject != null)
    {
       var newScale = evt.target.ownerDocument.documentElement.currentScale;
       var translation = evt.target.ownerDocument.documentElement.currentTranslate;
       var newX = (evt.clientX - translation.x) / newScale;
       var newY = (evt.clientY - translation.y) / newScale;
   
       this.dragObject.setDragPosition(newX - this.offsetX, newY - this.offsetY);
    }
}

DragNDropHandler.prototype.dragend = function(evt)
{
	if (this.dragObject != null)
		this.dragObject.setDragEnd(); // Let the drag object know we're done.
    
	this.dragObject = null;
}

function dragndrop_Start(src, evt, initialX, initialY)
{
    if (g_dragndrop)
       g_dragndrop.dragstart(src, evt, initialX, initialY);  
}

function dragndrop_Move(evt)
{
    if (g_dragndrop)
       g_dragndrop.dragmove(evt);  
}

function dragndrop_End(evt)
{
    if (g_dragndrop)
       g_dragndrop.dragend(evt);  
}

