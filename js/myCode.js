/* Let us define our LH component. LH stands for live HTML.*/
crx_registerClass("demoSlider", //The name of our class is demoSlider
{
	VERBOSE: 1,
	/* We have to extend this class, or any other LH component class.*/
	EXTENDS: "crxcmp.lhc.Component",
	/*
		We are not implementing a constructor, but we still need to forward whatever arguments the
				constructor of "crxcmp.lhc.Component" back to it. This is when you call something like
				'super' in other languages. If all you need to do is to call super so that you forward the
				arguments, CrxOop privdes the following convenient syntax.
	*/
	"public CONSTRUCT": 1,
	/* We have to define our tag name. The actual tag name will have 'cre' prepended to it,
			making tha actual tag name, creSlider which is case insensitive. */
	"public virtual function getTagName": function(){return "Slider";},

	/* We are going to define some variables for our book keeping. */
	"private var gNumberOfImages": -1,
	"private var gCurrentImageIndex": -1,

	/*
		The following fires automatically when the system needs to create the dom, and for other reasons.
				Because we are not using any templating for our tutorial, we are using (overriding) this
				function directly. The function needs to return the string which is the html representing
				our component.

		The HTML returned for our Component must have a single root element, and this element should be
				a block element. Not all block elements are allowed however, but this is beyond the scope
				of our tutorial. Furthermore, even myself, I only ever use the 'div' element for my root
				element.

		-- Parameters --
		pID: This is html id of our component, which is either generated automatically, or entered by the
				editor in the html. The id MUST be placed on the root element.

		pParametersArray: This is an object containing the parameters passed to our component. Note
				that parameters are stored by their lower cased names. So the 'borderColor' parameter
				will appear as 'bordercolor' here.

		pBody: This is a string that must be printed in the 'body element', but we shall ignore
				it for this tutorial because we are not building a component that allows children. Hence,
				this parameter will always be empty.
	*/
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
				/*
				The following contains a css hack for now to get images resizing without deformation,
						but it will not work all the time. I am keeping the tutorial simple.*/
				"<img style='display: block; width: 100%; min-height: 100%;' src='" +
							pParametersArray['images'][tKey] + "' />" +
			"</div>";
			}
		}

		vReturn +=
		"</div>";

		return vReturn;
	},
	/*
		The following fires when the DOM of the component itself is ready. It is here where
			we attach the event listeners to our DOM.
	*/
	"protected virtual function onReady": function()
	{
		/*
			We save a reference to our 'this' because inside our event handler we can not refer to it
					directly. To understand why, please refer to closures in the javascript
					documentations.
		*/
		var vThis = this;

		/* We attach our click handeler. getElement will get our root element. Notice how we can call it
				here, but we can not call it during onGetOutput() because the dom is not guaranteed to
				be ready there. */
		this.getElement().on('click', function()
		{
			/*
			getElementBit() takes two parameters. The first is a css selector, and should always start with
					'>', which is the (dom) child selector. Your css selector must always be exact.
					The second paramter is optional and is 'false' by default. If you pass 'true',
					the result is cached, and the next time you call getElementBit(), you get the cached
					result.
			*/
			vThis.getElementBit("> div.image:nth-child(" + vThis.gCurrentImageIndex + ")", true).
					css('display', 'none');

			/*If we reached the last image, we want to go back to the beginning*/
			if(vThis.gCurrentImageIndex === vThis.gNumberOfImages)
				{vThis.gCurrentImageIndex = 1;}
			else
				{vThis.gCurrentImageIndex = vThis.gCurrentImageIndex + 1;}

			vThis.getElementBit("> div.image:nth-child(" + vThis.gCurrentImageIndex + ")", true).
					css('display', 'block');
		});

		/* The dom just became ready, and if you remember in onGetOutput all div.image had
				css that hid them. We want to show the first image as a start. Currently the aspect ratio
				will be off.*/
		vThis.getElementBit("> div.image:nth-child(1)", true).
					css('display', 'block');
		vThis.gCurrentImageIndex = 1;
	},
	/*
		The following is called whenever rendering is required. This is where we can enforce
				our aspect ratio
	*/
	"protected virtual function onRender": function(pElement)
	{
		var vAspectRatio = this.getParameter('aspectratio');

		/* We only want to set a default aspect ratio if a value is not given*/
		if(!vAspectRatio)
			{vAspectRatio = 1.5;}

		this.getElement().height(this.getElement().width() * vAspectRatio);
	}
});

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
