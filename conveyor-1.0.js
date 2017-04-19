var pgh=256;
    var pgw=750;
    var speed=5;
    var delta_ms=30;
    var boxpertimes=40;
    var spawncount=0;
    function box(node)
    {
        this.node=node;
        this.h=48;
        this.w=48;
        this.color="white";
        this.cenposy=this.h/2;
        this.border=5;
        this.borderstyle="outset";
        this.bordercolor="gray";
        this.posx=-this.w-(this.border*2);
        //this.posx=100;
        this.posy=this.cenposy-this.h/2-this.border;
        this.clan="n";
        
        this.init=function()
        {
            this.posy=this.cenposy-this.h/2-this.border;
            this.node.css("height",this.h);
            this.node.css("width",this.w);
            this.node.css("background",this.color);
            this.node.css("left",this.posx);//alert(this.posx);
            this.node.css("top",this.posy);
            this.node.css("border-width",this.border);
            this.node.css("border-style",this.borderstyle);
            this.node.css("border-color",this.bordercolor);
        }
        
        this.jump=function(cenposy)
        {
            this.cenposy=cenposy;
            this.posy=this.cenposy-this.h/2-this.border;
            this.node.css("top",this.posy);
        }
        
        this.move=function(dx)
        {
            this.posx+=dx;
            this.node.css("left",this.posx);
        }
        
        this.right=function()
        {
            var r=this.posx+this.w+this.border*2;
            return r;
        }
        
        this.clanset=function(clan,color,bordercolor)
        {
            this.color=color;
            this.bordercolor=bordercolor;
            this.node.css("border-color",this.bordercolor);
            this.node.css("background",this.color);
            this.clan=clan;
        }
    }
    
    
    
    function cvy(node)
    {
        this.node=node;
        this.h=pgh/4;
        this.w=pgw;
        this.cenposy=this.h/2;
        this.posx=0;
        this.posy=this.cenposy-this.h/2;
        this.color="gray";
        this.boxes=new Array();
        this.clan="n";
        this.lastboxleft;
        this.coll=0;
        this.rubb=0;
        
        //alert(this.boxes[0]);
        
        this.init=function()
        {
            
            this.posy=this.cenposy-this.h/2;
            this.node.css("height",this.h);
            this.node.css("width",this.w);
            this.node.css("background",this.color);
            this.node.css("left",this.posx);
            this.node.css("top",this.posy);
        }
        
        this.spawn=function(newbox)
        {
            this.boxes.push(newbox);
            var tempbox=$(newbox)[0].box;
            tempbox.jump(this.h/2);
            if(this.boxes.length>1)
            {
                this.lastboxleft=$(this.boxes[this.boxes.length-2])[0].box.posx;
                //var right=tempbox.posx+tempbox.w+tempbox.border*2;
                var right =tempbox.right();
                if(right>this.lastboxleft)
                {
                    tempbox.posx-=right-this.lastboxleft;
                }
            }
            //this.lastboxleft=tempbox.posx;
            tempbox.init();
        }
        
        this.check=function()
        {
            if(this.boxes.length>0)
            {
                while($(this.boxes[0])[0].box.posx>this.w)
                {
                    /*checkclan*/
                    if($(this.boxes[0])[0].box.clan==this.clan){this.coll++;}
                    else{this.rubb++;}
                    $(this.boxes[0]).remove();
                    this.boxes.shift();
                }
            }
        }
        
        this.move=function(dx)
        {
            this.boxes.forEach(function(box){
                $(box)[0].box.move(dx);
            });
        }
        
        this.in=function(box)
        {//alert(this.posy);
            $(box)[0].box.jump(this.h/2);
            var tx=$(box)[0].box.posx;
            var len=this.boxes.length;
            var put=false;
            var ix;
            for(var i=0;i<len;i++)
            {
                ix=$(this.boxes[i])[0].box.posx;
                if(ix<=tx)
                {
                    put=true;
                    this.boxes.splice(i,0,box);
                    break;
                }
            }
            if(!put)
            {
                //alert("ERROR:cvy.in(box).for loop error");
                this.boxes.push(box);
            }
            i++;
            while(i>0)
            {
                var leftbox=$(this.boxes[i])[0].box;//alert(leftbox);
                var rightbox=$(this.boxes[i-1])[0].box;
                var right=leftbox.right();
                if(right>rightbox.posx)
                {
                    rightbox.posx+=right-rightbox.posx;
                    i--;
                }
                else{break;}
            }//alert("??");
            $(box)[0].box.init();
        }
        
        this.out=function(ax)
        {
            var choose=false;
            var i;
            var tbox=new Array(false);
            this.boxes.forEach(function(box,index,tboxes){
                if(choose){return;}
                var bw=$(box)[0].box.w;
                var x=$(box)[0].box.posx;
                if(x<=ax && ax<=(x+bw))
                {
                    //alert(index);
                    //alert(this.boxes[0]);
                    choose=true;
                    //tbox=tboxes[index];
                    //tboxes.splice(index,1);
                    tbox=tboxes.splice(index,1);
                }
                return;
            });
            //if(tbox[0]==false){alert("ERROR:cvy.out.choose false error");}
            //alert(tbox);
            return tbox[0];
        }
    }
    
    
    function spawner(cvyid,autoid)
    {
        var boxid="b"+autoid;
        var tcvy=$(cvyid);
        tcvy.addSprite(boxid);
        boxid="#"+boxid;
        
        $(boxid).addClass("box");
        $(boxid)[0].box=new box($(boxid));
        tcvy[0].cvy.spawn($(boxid));
        return boxid;
    }
    
    function transcvy(fcvyid,tcvyid,autoid)
    {
        var tbox=$(fcvyid)[0].cvy.out(pgw/2);
        if(tbox!=false)
        {
            var boxid="b"+autoid;
            $(tcvyid).addSprite(boxid);
            boxid="#"+boxid;
            //alert(fcvyid+"-"+tcvyid+"/"+boxid);
            //alert($(boxid).parent()[0].css("id"));
            $(boxid).addClass("box");
            $(boxid)[0].box=$(tbox)[0].box;
            $(boxid)[0].box.node=$(boxid);
            $(tcvyid)[0].cvy.in($(boxid));
            $(tbox).remove();
        }
        else
        {
            //alert("ERROR:transcvy : false");
        }
        tbox=null;
    }
    
    
    
    //var t1=new box(123);
    //var t2=new cvy(123);
    var boxautoid=1;
    var boxid;
    
    
    $("#playground").playground({height:pgh,width:pgw,keyTracker: true});
    $("#playground").css("background","gray");
    
    
    $.playground().addGroup("cvybg").end();
    $.playground().addSprite("arrow").end();
    $.playground().addGroup("boxbg").end();
    
    
    $("#arrow").css("height",pgh);
    $("#arrow").css("width",1);
    $("#arrow").css("background","dimgray");
    $("#arrow").css("left",(pgw/2));
    //$("#arrow").css("top",0);
    
    $("#cvybg").addSprite("cvyup");
    $("#cvyup").addClass("cvy");
    $("#cvyup")[0].cvy=new cvy($("#cvyup"));
    
    $("#cvybg").addSprite("cvydw");
    $("#cvydw").addClass("cvy");
    $("#cvydw")[0].cvy=new cvy($("#cvydw"));
    
    
    var cvyup=$("#cvyup")[0].cvy;
    var cvydw=$("#cvydw")[0].cvy;
    
    cvyup.clan="up";
    cvydw.clan="dw";
    
    
    cvyup.cenposy+=16;
    cvyup.color="black";
    cvyup.init();
    cvydw.cenposy=200;
    cvydw.color="white";
    cvydw.init();
    
    //alert(cvydw);
    
    /*boxautoid++;
    boxid="b"+boxautoid;
    $("#cvyup").addSprite(boxid);
    boxid="#"+boxid;
    $(boxid).addClass("box");
    $(boxid)[0].box=new box($(boxid));
    
    $("#cvyup")[0].cvy.spawn($(boxid));
    
    */
    
    
    /*function tfunc(cvy)
    {
        this.cvy=cvy;
        this.boxes=cvy.boxes;
        this.cvy.check();
        this.cvy.move(1);
        //this.cvy.spawn();
    }
    //$.playground().registerCallback(function (){tfunc($("#cvyup")[0].cvy)},delta_ms);
    */
    
    
    //spawner("#cvyup",boxautoid++);
    //spawner("#cvydw",boxautoid++);
    
    function randclan(boxid)
    {
        var t=Math.random();
        if(t<=0.5)
        {
            $(boxid)[0].box.clanset("up","black","white");
        }
        else
        {
            $(boxid)[0].box.clanset("dw","white","black");
        }
    }
    
    function spawnmgr()
    {
        //random
        spawncount++;
        if(spawncount==boxpertimes)
        {
            spawncount=0;
            var tid=spawner("#cvyup",boxautoid++);
            //$(tid)[0].box.clanset("up","black","white");
            randclan(tid);
            
            tid=spawner("#cvydw",boxautoid++);
            //$(tid)[0].box.clanset("dw","white","black");
            randclan(tid);
            
        }
    }
    
    function scorecount()
    {
        //
    }
    
    function func()
    {
        cvyup.check();
        cvydw.check();
        
        cvyup.move(speed);
        cvydw.move(speed);
        
        spawnmgr();
        
        $("#upsb").html("[up: "+cvyup.coll+" / "+cvyup.rubb+"]");
        $("#dwsb").html("[dw: "+cvydw.coll+" / "+cvydw.rubb+"]");
        
        scorecount();
    }
    
    $.playground().registerCallback(function (){func()},delta_ms);
    
    
    function kbfunc()
    {
        if($.gQ.keyTracker[83])//s
        {
            transcvy("#cvyup","#cvydw",boxautoid++);
        }
        if($.gQ.keyTracker[87])//w
        {
            transcvy("#cvydw","#cvyup",boxautoid++);
        }
    }
    $.playground().registerCallback(function (){kbfunc()},delta_ms);
    
    
    //$("#lay").append("<div id='upsb' >up:</div><div id='dwsb'>dw:</div>");
    $("#playground").css("position","");
    //$("#lay").css("position","absolute");
    //$("#lay").css("visibility","hidden");
    
    $.playground().startGame();
    alert("W:上挪箱子 / S:下挪箱子\n\n把箱子挪到同色传送带上");
    
    /*
    $(document).keydown(function(e){
        //alert(e.keyCode);
        switch(e.keyCode)
        {
            case 83: //s
                //alert("???");
                transcvy("#cvyup","#cvydw",boxautoid++);
                break;
            case 87: //w
                transcvy("#cvydw","#cvyup",boxautoid++);
                break;
        }
    });*/
