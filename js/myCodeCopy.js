
crx_registerClass("demoSlider", //The name of our class is demoSlider
{
	VERBOSE: 1,
	EXTENDS: "crxcmp.lhc.Component",
	"public CONSTRUCT": 1,
	"public virtual function getTagName": function(){return "Slider";},
	"private var gNumberOfImages": -1,
	"private var gCurrentImageIndex": -1,
	"public virtual function onGetOutput": function(pID, pParametersArray, pBody)
	{
		var vReturn =
		"<div id='" + pID + "' style='width: 100%;'>";
		if(pParametersArray['images'])
		{
			this.gNumberOfImages = 0;
			for(var tKey in pParametersArray['images'])
			{
				this.gNumberOfImages = this.gNumberOfImages + 1;
				vReturn +=
			"<div class='image' style='display: none; width: 100%; height: 100%; overflow:hidden;'>" +
				"<img style='display: block; width: 100%; min-height: 100%;' src='" +
							pParametersArray['images'][tKey] + "' />" +
			"</div>";
			}
		}
		vReturn +=
		"</div>";
		return vReturn;
	}, // end of public virtual function onGetOutput
	"protected virtual function onReady": function()
	{
		var vThis = this;
		this.getElement().on('click', function()
		{
			vThis.getElementBit("> div.image:nth-child(" + vThis.gCurrentImageIndex + ")", true).
					css('display', 'none');
			if(vThis.gCurrentImageIndex === vThis.gNumberOfImages)
				{vThis.gCurrentImageIndex = 1;}
			else
				{vThis.gCurrentImageIndex = vThis.gCurrentImageIndex + 1;}
			vThis.getElementBit("> div.image:nth-child(" + vThis.gCurrentImageIndex + ")", true).
					css('display', 'block');
		}); // end of getElement().on()

		vThis.getElementBit("> div.image:nth-child(1)", true).
					css('display', 'block');
		vThis.gCurrentImageIndex = 1;
	},
	"protected virtual function onRender": function(pElement)
	{
		var vAspectRatio = this.getParameter('aspectratio');

		/* We only want to set a default aspect ratio if a value is not given*/
		if(!vAspectRatio)
			{vAspectRatio = 1.5;}

		this.getElement().height(this.getElement().width() * vAspectRatio);
	}
}); //end of crx_registerClas()

/*
	Now that we created our component, we want to register to the system. However, before that we need
	to create the system.
*/
var gSecurity = crx_new("crxcmp.lhc.Security");


/*
	Now we can register our LH component. Notice how we are registering by its class name, not tag name.
*/
gSecurity.registerLHCComponentToAllAreas("demoSlider");

/*
	Next, we want to 'liven' the dom, which currently only contains the #Body element, and an element with
			the creSlider tag name. However, that dom is might not be ready yet, and so we have to wait for
			it to be ready. Remember, we are using jQuery.
*/
$(document).ready(function()
{
	/* Inside here, we can assume that that initial dom is now ready */

	/*
		First we register our live area.

		The first parameter any be any arbitrary name.
		The second parameter, is beyond the scope of this tutorial, and will always be 2.
		The third parameter is the html element which encloses the 'live' area.
	*/
	gSecurity.registerArea("MyLiveArea", 2, $("#Body"));

	/*
		Next we register a controller for our live area. What this does is beyond the scope of
		this tutorial, but this line will almost always never change, except for the first parameter
		which is an arbitrary name.
	*/
	gSecurity.registerController("MyLiveAreaController", "crxcmp.lhc.ControllerComponent", null);


	/*Now we can liven our area, using the controller defined before. */
	gSecurity.processArea("MyLiveArea", "MyLiveAreaController");
});
