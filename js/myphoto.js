
function GetAddress(){
    var tag = $('.ActiveStamp').attr('tag');
    var cid = $('#CID'+tag).val();
    var address = cid;
    return address;
}


      var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  window.onmousedown = preventDefault;
  document.onkeydown  = preventDefaultForScrollKeys;
  document.body.style.overflow = 'hidden';
  document.getElementsByTagName('html')[0].style.overflowY = "hidden";
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.onmousedown = null;
    window.ontouchmove = null;  
    document.onkeydown = null;
    document.body.style.overflow = 'auto';
    document.getElementsByTagName('html')[0].style.overflowY = "scroll";
}




function PhotoStamp(Opts){

    var thisObj = this;
    var MainCvs = document.getElementById('canvas');
    var MainCxt = MainCvs.getContext('2d');
    var StampAddress = "";

    var downloadBtn = $('#download');

    var PointActive = false;

    var cropbox = $('#CropBox');
    var cropHolder = $('#CropHolder');
    var JCropCanvas = $('#CropPhoto');
    var CropX = $('#CropX');
    var CropY = $('#CropY');
    var CropH = $('#CropH');
    var CropW = $('#CropW');
    var UserImgH = $('#UserImgH');
    var UserImgW = $('#UserImgW');
    var ScaleW = $('#ScaleW');
    var ScaleH = $('#ScaleH');

    var CropPhotoHolder = $('#CropPhotoHolder');

    var CropCvsLeft, CropCvsTop, CurrentCropH, CurrentCropW, MaxMoveX, CropTopTemp, CropLeftTemp, CropWTemp, CropHTemp, TopP = 0;

    var CropBtn, ShadowCvs, NorthEastPoint, SouthEastPoint, SouthWestPoint, NorthWestPoint;


    $('.ThemeContainer li').click(function(event) {
        /* Act on the event */
        $('.ActiveStamp').removeClass('ActiveStamp');
        $(this).addClass('ActiveStamp');


        if($('#Photo').val() == ""){
            StampAddress = GetAddress();
            thisObj.SetupStamp(StampAddress);
        } else {

            thisObj.CreateIMG();
        }
    });

    this.SetupStamp = function(address){
        var base_image = new Image();
        
        base_image.src = address;
        base_image.onload = function(){
            MainCxt.drawImage(base_image, 0, 0);
        }
    }



    var MainCanvas = document.getElementById('canvas');
    MainCanvas.height = Opts.NewHeight;
    MainCanvas.width = Opts.NewWidth;

    StampAddress = GetAddress();
    thisObj.SetupStamp(StampAddress);

    $('#Photo').change(function(e) {
        var Img_url = e.target.files[0]; 
        thisObj.UserPhoto(Img_url);
    });

    this.UserPhoto = function(url){
        var width, height;
        $('#CropPhotoBG').show();
                    var top = $(window).scrollTop();
            $('#CropPhotoBG').css('top', top);

        disableScroll();


        thisObj.ResetIMG();

        var reader = new FileReader();


        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

            var Cropcanvas = document.getElementById('CropPhoto'),
                width = image.width,
                height = image.height;

                    UserImgH.val(height);
                    UserImgW.val(width);

                    // resize the users image into crop canvas

                var scale_ratio = width / height;    
                if(width > Opts.maxWidth || height > Opts.maxHeight){
                    if(width > height){
                        // shink the width

                        width = Opts.maxHeight * scale_ratio;
                        height = Opts.maxWidth / scale_ratio;
                        UserImgH.val(height);
                        UserImgW.val(width);

                        ScaleW.val(image.width / width);
                        ScaleH.val(image.height / height);
                    } else {
                        // shink the height
                        width = Opts.maxHeight * scale_ratio;
                        height = Opts.maxWidth * scale_ratio;

                        UserImgH.val(height);
                        UserImgW.val(width);
                        ScaleW.val(image.width / width);
                        ScaleH.val(image.height / height);
                    }


                    

                } else {
                    // just use the image size because image isn't that big
                    ScaleW.val(1);
                    ScaleH.val(1);
                    UserImgH.val(height);
                    UserImgW.val(width);
                }



                Cropcanvas.width = width;
                Cropcanvas.height = height;

                ShadowCvs = document.getElementById('ShadowCvs');

                ShadowCvs.width = width;
                ShadowCvs.height = height;

                $('#CanvasHolder').height(height);
                $('#CanvasHolder').width(width);

                $('#CropHolder').height(height);
                $('#CropHolder').width(width);

                ShadowCvs.getContext('2d').drawImage(image, 0, 0, width, height);
                Cropcanvas.getContext('2d').drawImage(image, 0, 0, width, height);
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(url);

        var WidthO, WidthX, WidthL, HeightO, HeightX, HeightL = 0;

               thisObj.CreateCropBox(url);
    }

    this.CreateCropBox = function(url){
         cropHolder.mousedown(function(e) {

            var FirstLeft, FirstTop = 0;
            FirstLeft = e.pageX - $(this).offset().left;
            FirstTop = e.pageY - $(this).offset().top;


            cropbox.css('left', (e.pageX - $(this).offset().left));
            cropbox.css('top', (e.pageY - $(this).offset().top));

            CropX.val(e.pageX - $(this).offset().left);
            CropY.val(e.pageY - $(this).offset().top);

            JCropCanvas.css('top', -(e.pageY - $(this).offset().top));
            JCropCanvas.css('left', -(e.pageX - $(this).offset().left));


            cropHolder.mousemove(function(e) {
                WidthL = FirstLeft;
                WidthP = e.pageX - $(this).offset().left;

                HeightL = FirstTop;
                HeightP = e.pageY - $(this).offset().top;



                if(Math.abs(WidthP - WidthL) > Math.abs(HeightP - HeightL)){
                    CropWTemp = Math.abs(WidthP - WidthL);
                    if(WidthP - WidthL > 0){
                        if(HeightP - HeightL < 0){
                                if(FirstTop - CropWTemp <= 0 || FirstLeft + CropWTemp >= cropHolder.width()){
                                    // crop to height 
                                    if(FirstTop - CropWTemp <= 0){

                                        CropWTemp = CropWTemp - Math.abs(FirstTop - CropWTemp);
                                    } else if(FirstLeft + CropWTemp >= cropHolder.width()){

                                        CropWTemp = CropWTemp - (Math.abs(cropHolder.width() - (FirstLeft + CropWTemp)));

                                    } 
                                } 


                                cropbox.width(CropWTemp);
                                cropbox.height(CropWTemp);
                                cropbox.css('left', FirstLeft);
                                cropbox.css('top', FirstTop - CropWTemp);

                                JCropCanvas.css('top', -(FirstTop - CropWTemp));
                                JCropCanvas.css('left', -FirstLeft);

                                CropW.val(CropWTemp);
                                CropH.val(CropWTemp);
                                CropX.val(FirstLeft);
                                CropY.val(FirstTop - CropWTemp); 

                        } else {

                            if(FirstLeft + CropWTemp >= cropHolder.width() || FirstTop + CropWTemp >= cropHolder.height()){
                                if(FirstLeft + CropWTemp >= cropHolder.width()){
                                    CropWTemp = CropWTemp - (Math.abs(cropHolder.width() - (FirstLeft + CropWTemp)));
                                } else if(FirstTop + CropWTemp >= cropHolder.height()){
                                    CropWTemp = CropWTemp - (Math.abs(cropHolder.height() - (FirstTop + CropWTemp)));
                                }

                            } 

                            cropbox.width(CropWTemp);
                            cropbox.height(CropWTemp);
                            cropbox.css('left', FirstLeft);
                            cropbox.css('top', FirstTop);

                            JCropCanvas.css('top', -FirstTop);
                            JCropCanvas.css('left', -FirstLeft);

                            CropW.val(CropWTemp);
                            CropH.val(CropWTemp);
                            CropX.val(FirstLeft);
                            CropY.val(FirstTop); 
                        }

                    } else {

                        if(HeightP - HeightL < 0){

                            if(FirstTop - CropWTemp <= 0 || FirstLeft - CropWTemp <= 0){
                                if(FirstTop - CropWTemp <= 0){
                                    CropWTemp = CropWTemp - Math.abs(FirstTop - CropWTemp);
                                } else if(FirstLeft - CropWTemp <= 0){
                                    CropWTemp = CropWTemp - Math.abs(FirstLeft - CropWTemp);
                                }

                            }

                            cropbox.width(CropWTemp);
                            cropbox.height(CropWTemp);
                            cropbox.css('left', FirstLeft - CropWTemp);
                            cropbox.css('top', FirstTop - CropWTemp);

                            JCropCanvas.css('top', -(FirstTop - CropWTemp));
                            JCropCanvas.css('left', -(FirstLeft - CropWTemp));
          
                            CropW.val(CropWTemp);
                            CropH.val(CropWTemp);
                            CropX.val(FirstLeft - CropWTemp);
                            CropY.val(FirstTop - CropWTemp);

                        } else {


                            if(FirstLeft - CropWTemp <= 0 || FirstTop + CropWTemp >= cropHolder.height()){
                                if(FirstLeft - CropWTemp <= 0){
                                    CropWTemp = CropWTemp - Math.abs(FirstLeft - CropWTemp);
                                } else if(FirstTop + CropWTemp >= cropHolder.height()) {
                                    CropWTemp = CropWTemp - (Math.abs(cropHolder.height() - (FirstTop + CropWTemp)));
                                }

                            }

                            cropbox.width(CropWTemp);
                            cropbox.height(CropWTemp);
                            cropbox.css('left', FirstLeft - CropWTemp);
                            cropbox.css('top', FirstTop);

                            JCropCanvas.css('top', -FirstTop);
                            JCropCanvas.css('left', -(FirstLeft - CropWTemp));                           

                            CropW.val(CropWTemp);
                            CropH.val(CropWTemp);
                            CropX.val(FirstLeft - CropWTemp);
                            CropY.val(FirstTop);


                        }                     
                    }


                } else if(Math.abs(WidthP - WidthL) < Math.abs(HeightP - HeightL)){
                    CropHTemp = Math.abs(HeightP - HeightL);
                    if(HeightP - HeightL > 0){
                        if(WidthP - WidthL < 0){
                            if(FirstLeft - CropHTemp <= 0 || FirstTop + CropHTemp >= cropHolder.height()){
                                if(FirstLeft - CropHTemp <= 0){
                                    CropHTemp = CropHTemp - Math.abs(FirstLeft - CropHTemp);
                                } else if(FirstTop + CropHTemp >= cropHolder.height()) {
                                    CropHTemp = CropHTemp - (Math.abs(cropHolder.height() - (FirstTop + CropHTemp)));
                                }

                            }


                            cropbox.width(CropHTemp);
                            cropbox.height(CropHTemp);
                            cropbox.css('left', FirstLeft - CropHTemp);
                            cropbox.css('top', FirstTop);

                            JCropCanvas.css('top', -FirstTop);
                            JCropCanvas.css('left', -(FirstLeft - CropHTemp));

                            CropW.val(CropHTemp);
                            CropH.val(CropHTemp);
                            CropX.val(FirstLeft - CropHTemp);
                            CropY.val(FirstTop); 

                        } else {
                            if(FirstLeft + CropHTemp >= cropHolder.width() || FirstTop + CropHTemp >= cropHolder.height()){
                                if(FirstLeft + CropHTemp >= cropHolder.width()){
                                    CropHTemp = CropHTemp - (Math.abs(cropHolder.width() - (FirstLeft + CropHTemp)));
                                } else if(FirstTop + CropHTemp >= cropHolder.height()){
                                    CropHTemp = CropHTemp - (Math.abs(cropHolder.height() - (FirstTop + CropHTemp)));
                                }

                            } 
                            cropbox.width(CropHTemp);
                            cropbox.height(CropHTemp);
                            cropbox.css('left', FirstLeft);
                            cropbox.css('top', FirstTop);

                            JCropCanvas.css('top', -FirstTop);
                            JCropCanvas.css('left', -FirstLeft);

                            CropW.val(CropHTemp);
                            CropH.val(CropHTemp);
                            CropX.val(FirstLeft);
                            CropY.val(FirstTop); 

                        }
                    } else {

                        if(WidthP - WidthL < 0){

                            if(FirstTop - CropHTemp <= 0 || FirstLeft - CropHTemp <= 0){
                                if(FirstTop - CropHTemp <= 0){
                                    CropHTemp = CropHTemp - Math.abs(FirstTop - CropHTemp);
                                } else if(FirstLeft - CropHTemp <= 0){
                                    CropHTemp = CropHTemp - Math.abs(FirstLeft - CropHTemp);
                                }

                            }

                            cropbox.width(CropHTemp);
                            cropbox.height(CropHTemp);
                            cropbox.css('left', FirstLeft - CropHTemp);
                            cropbox.css('top', FirstTop - CropHTemp);

                            JCropCanvas.css('top', -(FirstTop - CropHTemp));
                            JCropCanvas.css('left', -(FirstLeft - CropHTemp));
          
                            CropW.val(CropHTemp);
                            CropH.val(CropHTemp);
                            CropX.val(-(FirstLeft - CropHTemp));
                            CropY.val(-(FirstTop - CropHTemp));
     
                        } else {

                            if(FirstTop - CropHTemp <= 0 || FirstTop + CropHTemp >= cropHolder.height()){
                                if(FirstTop - CropHTemp <= 0){
                                    CropHTemp = CropHTemp - Math.abs(FirstTop - CropHTemp);
                                } else if(FirstTop + CropHTemp >= cropHolder.height()) {
                                    CropHTemp = CropHTemp - (Math.abs(cropHolder.height() - (FirstTop + CropHTemp)));

                                }

                            }

                            cropbox.width(CropHTemp);
                            cropbox.height(CropHTemp);
                            cropbox.css('left', FirstLeft);
                            cropbox.css('top', FirstTop - CropHTemp);

                            JCropCanvas.css('top', -(FirstTop - CropHTemp));
                            JCropCanvas.css('left', -FirstLeft);                           

                            CropW.val(CropHTemp);
                            CropH.val(CropHTemp);
                            CropX.val(FirstLeft);
                            CropY.val(FirstTop - CropHTemp);
    

                        }                     
                    }

                }


            });

            cropHolder.mouseup(function(event) {
                /* Act on the event */
                cropHolder.unbind('mousemove');
                cropHolder.unbind('mouseup');
                cropHolder.unbind('mousedown');

            

                cropHolder.css('cursor', 'auto');
                CropPhotoHolder.unbind('mouseover');
                thisObj.ResizeCrop();
                CropBtn = $('#CropBtn');
                CropBtn.prop('disabled', false);

                if(CropH.val() < 50){
                    CropW.val(50);
                    CropH.val(50);         
                    cropbox.width(50);
                    cropbox.height(50);

                    if(cropHolder.width() < 50 + parseInt(CropX.val())){
                        var newX = 0;
                        newX = parseInt(CropX.val()) - Math.abs((50 + parseInt(CropX.val())) - parseInt(cropHolder.width()));

                        cropbox.css('left', newX);
                     
                        JCropCanvas.css('left', -newX);  
                        CropX.val(newX); 

                    }

                    if(cropHolder.height() < 50 + parseInt(CropY.val())){
                        var newY = 0;
                        newY = parseInt(CropY.val()) - Math.abs((50 + parseInt(CropY.val())) - parseInt(cropHolder.height()));
                        CropY.val(newY); 
                        cropbox.css('top', newY);  
                        JCropCanvas.css('top', -newY);
                    }

                }




                CropBtn.click(function(event) {
                    /* Act on the event */
                  
                    thisObj.CreateIMG(url);
                    cropbox.unbind('mousedown');
                    CropBtn.unbind('click');
                    cropHolder.unbind('mouseup');
                    cropHolder.unbind('mouseout');
                });


            });

            CropPhotoHolder.mouseover(function(e) {
                /* Act on the event */


                if(e.target.id == 'CropPhotoHolder'){
                    cropHolder.unbind('mousemove');
                    cropHolder.unbind('mouseup');
                    cropHolder.unbind('mousedown');

                    CropPhotoHolder.unbind('mouseover');
                    cropHolder.css('cursor', 'auto');
                    thisObj.ResizeCrop();
                    CropBtn = $('#CropBtn');
                    CropBtn.prop('disabled', false);

                if(CropH.val() < 50){
                    CropW.val(50);
                    CropH.val(50);         
                    cropbox.width(50);
                    cropbox.height(50);

                    if(cropHolder.width() < 50 + parseInt(CropX.val())){
                        var newX = 0;
                        newX = parseInt(CropX.val()) - Math.abs((50 + parseInt(CropX.val())) - parseInt(cropHolder.width()));

                        cropbox.css('left', newX);
                     
                        JCropCanvas.css('left', -newX);  
                        CropX.val(newX); 

                    }

                    if(cropHolder.height() < 50 + parseInt(CropY.val())){
                        var newY = 0;
                        newY = parseInt(CropY.val()) - Math.abs((50 + parseInt(CropY.val())) - parseInt(cropHolder.height()));
                        CropY.val(newY); 
                        cropbox.css('top', newY);  
                        JCropCanvas.css('top', -newY);
                    }

                }


                    CropBtn.click(function(event) {
                        /* Act on the event */
                     
                        thisObj.CreateIMG(url);
                        cropbox.unbind('mousedown');
                    cropHolder.unbind('mouseup');
                    cropHolder.unbind('mouseout');
                    });
                }

            });


        });  
    }


    this.CreateIMG = function(){


        var Photo = document.getElementById('Photo');
        var Img_url = Photo.files[0]; 
        $('#CropPhotoBG').hide();

        enableScroll();
        MainCxt.clearRect(0, 0, MainCvs.width, MainCvs.height);

        MainCxt.globalAlpha = 1;

        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

                var ScaleW = $('#ScaleW').val();
                var ScaleH = $('#ScaleH').val();

                var Px = CropX.val() * ScaleW;
                var Py = CropY.val() * ScaleH;

                var Ph = CropH.val() * ScaleH;
                var Pw = CropW.val() * ScaleW;

                MainCxt.drawImage(image, Px, Py, Pw, Ph, 0, 0, 600, 600);

                var stamp_image = new Image();
                StampAddress = GetAddress();

                stamp_image.src = StampAddress;
                stamp_image.onload = function(){
                
                    MainCxt.globalAlpha = 0.2;
                    MainCxt.drawImage(stamp_image, 0, 0);
            
                }   

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(Img_url);

        downloadBtn.click(function(event) {
            /* Act on the event */

                if(msieversion() == true){
                    var html="<p>Right-click on image below and Save-Picture-As</p>";
                    html+="<img src='"+MainCvs.toDataURL()+"' alt='from canvas'/>";
                    var tab=window.open();
                    tab.document.write(html);
                } else {

                var link = event.target;

                link.href = MainCvs.toDataURL("image/jpeg");
                link.download = 'MyPhoto.jpg';


                }

                
        });


    }



    this.ResetIMG = function(){
        var CropCvs = document.getElementById('CropPhoto');
        var CropCtx = CropCvs.getContext('2d');
        CropCtx.clearRect(0, 0, CropCvs.width, CropCvs.height);

        var ShadowCvs = document.getElementById('ShadowCvs');
        var ShodowCtx = ShadowCvs.getContext('2d');
        ShodowCtx.clearRect(0, 0, ShadowCvs.width, ShadowCvs.height);

        CropX.val(0);
        CropY.val(0);
        CropH.val(0);
        CropW.val(0);
        UserImgH.val(0);
        UserImgW.val(0);
        ScaleW.val(0);
        ScaleH.val(0);

        cropbox.css('left', 0);
        cropbox.css('top', 0);
        cropHolder.css('cursor', 'crosshair');
        cropbox.css('height', 0);
        cropbox.css('width', 0);

    }




    this.SetupPoints = function(){
        $('.CropTool').show();

        NorthEastPoint = $('#TopRight');
        SouthEastPoint = $('#BottomRight');
        SouthWestPoint = $('#BottomLeft');
        NorthWestPoint = $('#TopLeft');

        EastPoint = $('#LineRight');
        SouthPoint = $('#LineBottom');
        WestPoint = $('#LineLeft');
        NorthPoint = $('#LineTop');


        NorthPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(FirstTop < cropHolder.width() - (FirstW + FirstLeft)){
                    Max = FirstTop;
                } else {
                    Max = parseInt(cropHolder.width() - (FirstW + FirstLeft));
                }


                cropHolder.mousemove(function(e) {
                    /* Act on the event */
                    WidthP = (e.pageX - cropHolder.offset().left) - (FirstLeft + FirstW);

                    HeightP = FirstTop - (e.pageY - cropHolder.offset().top);

                    if(HeightP > WidthP){
                        //height greater

                        if(HeightP >= Max){

                            HeightP = Max;
                        }

                        cropbox.css('top', FirstTop - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);


                        JCropCanvas.css('top', -(FirstTop - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                         if(WidthP >= Max){

                            WidthP = Max;
                        }            
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        cropbox.css('top', FirstTop - WidthP);

                        JCropCanvas.css('top', -(FirstTop - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        CropY.val(FirstTop - WidthP);

                    }


                });


            }

        });


        NorthEastPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(FirstTop < cropHolder.width() - (FirstW + FirstLeft)){
                    Max = FirstTop;
                } else {
                    Max = parseInt(cropHolder.width() - (FirstW + FirstLeft));
                }


                cropHolder.mousemove(function(e) {
                    /* Act on the event */
                    WidthP = (e.pageX - cropHolder.offset().left) - (FirstLeft + FirstW);

                    HeightP = FirstTop - (e.pageY - cropHolder.offset().top);

                    if(HeightP > WidthP){
                        //height greater

                        if(HeightP >= Max){

                            HeightP = Max;
                        }

                        cropbox.css('top', FirstTop - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);


                        JCropCanvas.css('top', -(FirstTop - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                         if(WidthP >= Max){

                            WidthP = Max;
                        }            
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        cropbox.css('top', FirstTop - WidthP);

                        JCropCanvas.css('top', -(FirstTop - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        CropY.val(FirstTop - WidthP);

                    }


                });


            }

        });

        SouthPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(cropHolder.height() - (FirstTop + FirstH) < cropHolder.width() - (FirstW + FirstLeft)){
                    Max = cropHolder.height() - (FirstTop + FirstH);
                } else {
                    Max = cropHolder.width() - (FirstW + FirstLeft);
                }

            

                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = (e.pageX - cropHolder.offset().left) - (FirstLeft + FirstW);

                    HeightP =  (e.pageY - cropHolder.offset().top) - (FirstTop + FirstH);

                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }


                       // cropbox.css('top', FirstTop - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);


                        //JCropCanvas.css('top', -(FirstTop - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        //CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                          if(WidthP >= Max){

                            WidthP = Max;
                        }           
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        //cropbox.css('top', FirstTop - WidthP);

                        //JCropCanvas.css('top', -(FirstTop - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        //CropY.val(FirstTop - WidthP);

                    }
                });
            }
        });

        EastPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(cropHolder.height() - (FirstTop + FirstH) < cropHolder.width() - (FirstW + FirstLeft)){
                    Max = cropHolder.height() - (FirstTop + FirstH);
                } else {
                    Max = cropHolder.width() - (FirstW + FirstLeft);
                }

            

                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = (e.pageX - cropHolder.offset().left) - (FirstLeft + FirstW);

                    HeightP =  (e.pageY - cropHolder.offset().top) - (FirstTop + FirstH);

                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }


                       // cropbox.css('top', FirstTop - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);


                        //JCropCanvas.css('top', -(FirstTop - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        //CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                          if(WidthP >= Max){

                            WidthP = Max;
                        }           
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        //cropbox.css('top', FirstTop - WidthP);

                        //JCropCanvas.css('top', -(FirstTop - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        //CropY.val(FirstTop - WidthP);

                    }

                });


            }

        });


        SouthEastPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(cropHolder.height() - (FirstTop + FirstH) < cropHolder.width() - (FirstW + FirstLeft)){
                    Max = cropHolder.height() - (FirstTop + FirstH);
                } else {
                    Max = cropHolder.width() - (FirstW + FirstLeft);
                }

            

                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = (e.pageX - cropHolder.offset().left) - (FirstLeft + FirstW);

                    HeightP =  (e.pageY - cropHolder.offset().top) - (FirstTop + FirstH);

                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }


                       // cropbox.css('top', FirstTop - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);


                        //JCropCanvas.css('top', -(FirstTop - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        //CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                          if(WidthP >= Max){

                            WidthP = Max;
                        }           
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        //cropbox.css('top', FirstTop - WidthP);

                        //JCropCanvas.css('top', -(FirstTop - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        //CropY.val(FirstTop - WidthP);

                    }

                });


            }

        });

WestPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(cropHolder.height() - (FirstTop + FirstH) < FirstLeft){
                    Max = cropHolder.height() - (FirstTop + FirstH);
                } else {
                    Max = FirstLeft;
                }


                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = FirstLeft - (e.pageX - cropHolder.offset().left);

                    HeightP =  (e.pageY - cropHolder.offset().top) - (FirstTop + FirstH);

                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }
                        cropbox.css('left', FirstLeft - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);

                        JCropCanvas.css('left', -(FirstLeft - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        CropX.val(FirstLeft - HeightP);

                    } else {
                        //width greater
                          if(WidthP >= Max){

                            WidthP = Max;
                        }           
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        cropbox.css('left', FirstLeft - WidthP);

                        JCropCanvas.css('left', -(FirstLeft - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        CropX.val(FirstTop - WidthP);

                    }

                });



            }

        });

        SouthWestPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(cropHolder.height() - (FirstTop + FirstH) < FirstLeft){
                    Max = cropHolder.height() - (FirstTop + FirstH);
                } else {
                    Max = FirstLeft;
                }


                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = FirstLeft - (e.pageX - cropHolder.offset().left);

                    HeightP =  (e.pageY - cropHolder.offset().top) - (FirstTop + FirstH);

                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }
                        cropbox.css('left', FirstLeft - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);

                        JCropCanvas.css('left', -(FirstLeft - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        CropX.val(FirstLeft - HeightP);

                    } else {
                        //width greater
                          if(WidthP >= Max){

                            WidthP = Max;
                        }           
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);
                        cropbox.css('left', FirstLeft - WidthP);

                        JCropCanvas.css('left', -(FirstLeft - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        CropX.val(FirstTop - WidthP);

                    }

                });



            }

        });


        NorthWestPoint.mousedown(function(e) {
            /* Act on the event */

            if(PointActive == false){

                PointActive = true;

                var FirstLeft, FirstTop, FirstW, FirstH, Max = 0;
                FirstLeft = parseInt(cropbox.css('left'));
                FirstTop = parseInt(cropbox.css('top'));
                FirstW = cropbox.width();
                FirstH = cropbox.height();

                if(FirstTop < FirstLeft){
                    Max = FirstTop;
                } else {
                    Max = FirstLeft;
                }

                cropHolder.mousemove(function(e) {
                    /* Act on the event */

                    WidthP = FirstLeft - (e.pageX - cropHolder.offset().left);

                    HeightP = FirstTop - (e.pageY - cropHolder.offset().top);


                    if(HeightP > WidthP){
                        //height greater
                        if(HeightP >= Max){

                            HeightP = Max;
                        }
                        cropbox.css('top', FirstTop - HeightP);
                        cropbox.css('left', FirstLeft - HeightP);
                        cropbox.height(HeightP + FirstH);
                        cropbox.width(HeightP + FirstW);

                        JCropCanvas.css('top', -(FirstTop - HeightP));
                        JCropCanvas.css('left', -(FirstLeft - HeightP));
      
                        CropW.val(HeightP + FirstW);
                        CropH.val(HeightP + FirstH);

                        CropX.val(FirstLeft - HeightP);
                        CropY.val(FirstTop - HeightP);

                    } else {
                        //width greater
                        if(WidthP >= Max){

                            WidthP = Max;
                        }
                        cropbox.css('top', FirstTop - WidthP);
                        cropbox.css('left', FirstLeft - WidthP);
                        cropbox.height(WidthP + FirstH);
                        cropbox.width(WidthP + FirstW);

                        JCropCanvas.css('top', -(FirstTop - WidthP));
                        JCropCanvas.css('left', -(FirstLeft - WidthP));
      
                        CropW.val(WidthP + FirstW);
                        CropH.val(WidthP + FirstH);

                        CropX.val(FirstLeft - WidthP);
                        CropY.val(FirstTop - WidthP);


                    }

                });



            }

        });

        cropHolder.mouseup(function(event) {
            /* Act on the event */
            if(PointActive == true){
                cropHolder.unbind('mousemove');
                PointActive = false;
            }
        });



    }



    this.ResizeCrop = function(){
        // setup crop sections

        thisObj.SetupPoints();


        cropbox.mousedown(function(e) {
            /* Act on the event */
  
            if(e.target.id == 'CropPhoto'){
                var Xpos = 0;
                var Ypos = 0;
                CurrentCropH = cropbox.height();
                CurrentCropW = cropbox.width();
                CropCvsLeft = 0;
                CropCvsTop = 0;
                cropbox.mousemove(function(e) {

       
                    /* Act on the event */
                    CropCvsLeft = parseInt(cropbox.css('left'));
                    if(Xpos == 0){
                        Xpos = e.pageX; 
                    } else {
                        var MoveRate = 0;
                        MoveRate = CropCvsLeft + Math.floor((e.pageX - Xpos) * 2);
                        
                        if(UserImgW.val() > CurrentCropW + CropCvsLeft && MoveRate - CropCvsLeft > 0){

                            MaxMoveX =  UserImgW.val() - (CurrentCropW + CropCvsLeft);

                            if(MaxMoveX <= (MoveRate - CropCvsLeft)){
                                MoveRate = MaxMoveX + CropCvsLeft;
                            }
                           cropbox.css('left', MoveRate);
                           CropX.val(parseInt(cropbox.css('left')));
                           JCropCanvas.css('left', -MoveRate);
                           Xpos = 0;
                        } else if(CropCvsLeft > 0 && MoveRate - CropCvsLeft < 0){
                            if(MoveRate < 0){
                                MoveRate = 0;
                            }

                           cropbox.css('left', MoveRate);
                           JCropCanvas.css('left', -MoveRate);
                           CropX.val(parseInt(cropbox.css('left')));
                           Xpos = 0;
                        }


                    }

                    CropCvsTop = parseInt(cropbox.css('top'));
                    if(Ypos == 0){
                        Ypos = e.pageY; 
                    } else {
                        var MoveRate = CropCvsTop + Math.floor((e.pageY - Ypos) * 2);
                        
                        if(UserImgH.val() > CurrentCropH + CropCvsTop && MoveRate - CropCvsTop > 0){

                            MaxMoveY =  UserImgH.val() - (CurrentCropH + CropCvsTop);

                            if(MaxMoveY <= (MoveRate - CropCvsTop)){
                                MoveRate = MaxMoveY + CropCvsTop;
                            }
                           cropbox.css('top', MoveRate);
                           CropY.val(parseInt(cropbox.css('top')));
                           JCropCanvas.css('top', -MoveRate);
                           Ypos = 0;
                        } else if(CropCvsTop > 0 && MoveRate - CropCvsTop < 0){
                            if(MoveRate < 0){
                                MoveRate = 0;
                            }

                           cropbox.css('top', MoveRate);
                           JCropCanvas.css('top', -MoveRate);
                           CropY.val(parseInt(cropbox.css('top')));
                        Ypos = 0;
                        }
  
                    }

                });

                cropbox.mouseup(function(event) {
                    /* Act on the event */
                    cropbox.unbind('mousemove');
                    cropbox.unbind('mouseup');
                });

                cropbox.mouseout(function(event) {
                    /* Act on the event */
                    cropbox.unbind('mousemove');
                    cropbox.unbind('mouseup');
                });

            }

        });
    }



}

function msieversion() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  {    // If Internet Explorer, return version number
            return true;
       } else {                // If another browser, return 0
            return false;
        }
   
}
