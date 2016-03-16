
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<meta name="robots" content="all" />
<meta name="revisit-after" content="30 days" />
<meta name="author" content="Barry Love" />

<link href="http://YOURWEBSITE.com/css/photo.css" rel="stylesheet" type="text/css"/>
<link href="http://YOURWEBSITE.com/css/crop.css" rel="stylesheet" type="text/css"/>
<script src="http://YOURWEBSITE.com/js/jquery-2.1.4.min.js" type="text/javascript"></script>
<script src="http://YOURWEBSITE.com/js/myphoto.js" type="text/javascript"></script>

<title>Crop and Stamp</title>

<script>
$(document).ready(function() {

    $('#Theme1').addClass('ActiveStamp');

    var ImageOpts = {
        maxWidth: 700, // maximum width size made cropping
        maxHeight: 550, // maximum height size made cropping
        NewHeight: 600, // new height the image needs to be
        NewWidth: 600 // new width the image needs to be
    };

   StampObj = new PhotoStamp(ImageOpts);

});

</script>

</head>
<body>
    <div class="Dialog_BG" id="CropPhotoBG">
        <div class="DialogHolder" id="CropPhotoHolder">
            <h1>Crop Photo</h1>
            <p>You will need to crop your photo to this size 600px * 600px it is advise that to use a photo that is much bigger than 600px so you can crop the photo to the size you like.</p>
            <div class="CanvasHolder" id="CanvasHolder"> 

                 <canvas id="ShadowCvs"></canvas>     
                <div id="CropHolder">
                    <div id="CropBox">
                        <canvas id="CropPhoto"></canvas>

                        <div id="LineTop" class="CropLine"></div>
                        <div id="LineBottom" class="CropLine"></div>
                        <div id="LineRight" class="CropLine"></div>
                        <div id="LineLeft" class="CropLine"></div>

                        <div id="TopRight" class="CropTool"></div>
                        <div id="TopLeft" class="CropTool"></div>
                        <div id="BottomRight" class="CropTool"></div>
                        <div id="BottomLeft" class="CropTool"></div>


                    </div>
                </div>

                <input type="hidden" name="UserImgH" id="UserImgH" value="0" />
                <input type="hidden" name="UserImgW" id="UserImgW" value="0" />

                <input type="hidden" name="NewImgH" id="NewImgH" value="0" />
                <input type="hidden" name="NewImgW" id="NewImgW" value="0" />

                <input type="hidden" name="CropX" id="CropX" value="0" />
                <input type="hidden" name="CropY" id="CropY" value="0" />               
                <input type="hidden" name="CropH" id="CropH" value="0" />
                <input type="hidden" name="CropW" id="CropW" value="0" />  

               <input type="hidden" name="ScaleW" id="ScaleW" value="1" /> 
               <input type="hidden" name="ScaleH" id="ScaleH" value="1" />

            </div>
            <input type="button" disabled="disabled" name="CropBtn" id="CropBtn" value="Crop" />

        </div>
    </div>
	<div id="main_bg">



        <div class="MyPhotoIntro">
            <p>Select any .jpg, .png or .gif image file from your computer to add a theme to it this will not be up loaded to any server this is converted through the broswer.  Note: that all photos will have to be cropped to a square as required for Social Networking profile photos.</p>
        </div>

        <div class="ContentHolder">
            <div class="PhotoContainer">
                <div class="CanvasHolder">
                    <canvas id="canvas">Sorry your broswer does not support canvas</canvas>
                </div>

                <div class="PhotoControls">
                    <p>Please upload your photo here</p>
      
                    <input type="file" name="Photo" id="Photo"  accept="image/*" />
                    <a id="download" name="download">Download</a>
                 </div>

            </div>
            <ul class="ThemeContainer">
                <li class="ThemeBox" id="Theme1" tag="1"><p><span>POW / MIA Recognition</span><br>Support and Remember Prisoners of War and Missing in action Soldiers.</p><img src="http://YOURWEBSITE.com/thumb208.jpg" alt="POW / MIA Recognition" height="100px" width="100px"></li>
   <input type="hidden" value="http://YOURWEBSITE.com/208.jpg" name="CID1" id="CID1" />


    <li class="ThemeBox" id="Theme2" tag="2"><p><span>Christian Persecution</span><br>Support the christian persecuted in the Middle East and around the world.</p><img src="http://YOURWEBSITE.com/thumb202.jpg" alt="Christian Persecution" height="100px" width="100px"></li>
   <input type="hidden" value="http://YOURWEBSITE.com/202.jpg" name="CID2" id="CID2" />


    <li class="ThemeBox" id="Theme3" tag="3"><p><span>USA Flag</span><br>Support the victims of terror in the USA.</p><img src="http://YOURWEBSITE.com/thumb203.jpg" alt="USA Flag" height="100px" width="100px"></li>
   <input type="hidden" value="http://YOURWEBSITE.com/203.jpg" name="CID3" id="CID3" />


    <li class="ThemeBox" id="Theme4" tag="4"><p><span>Christian Cross</span><br>Show your support for traditional marriage.</p><img src="http://YOURWEBSITE.com/thumb204.jpg" alt="Christian Cross" height="100px" width="100px"></li>
   <input type="hidden" value="http://YOURWEBSITE.com/204.jpg" name="CID4" id="CID4" />


    <li class="ThemeBox" id="Theme5" tag="5"><p><span>Support Israel</span><br>Support Israel in these dark days.</p><img src="http://YOURWEBSITE.com/thumb205.jpg" alt="Support Israel" height="100px" width="100px"></li>
   <input type="hidden" value="http://YOURWEBSITE.com/205.jpg" name="CID5" id="CID5" />


                </ul>
        </div>

    </div>

</body>
</html>