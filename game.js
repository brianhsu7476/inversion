document.querySelector('#imageInput').addEventListener('change', update);
var CX=document.querySelector('#cx'), CY=document.querySelector('#cy'), R=document.querySelector('#radius');
CX.value=300, CY.value=300, R.value=200;
var cx=Number(CX.value), cy=Number(CY.value), r=Number(R.value);

function inversion(cx, cy, r){
	var cv0=document.querySelector('#original'), ct0=cv0.getContext('2d');
	var cv1=document.querySelector('#inversion'), ct1=cv1.getContext('2d');
	cv1.height=cv0.width, cv1.width=cv0.height;
	var origin=ct0.getImageData(0, 0, cv0.width, cv0.height), inv=[];
	for(var i=0; i<origin.data.length; ++i)inv.push(0);
	var w0=cv0.width, h0=cv0.height;
	var w1=h0, h1=w0;
	for(var i=0; i<h0; ++i){
		for(var j=0; j<w0; ++j){
			var d=(cx-i)*(cx-i)+(cy-j)*(cy-j);
			if(d==0)continue;
			d=r*r/((cx-i)*(cx-i)+(cy-j)*(cy-j));
			var x1=Math.round(cx+(i-cx)*d), y1=Math.round(cy+(j-cy)*d);
			for(var k=0; k<4; ++k)inv[4*(x1*w1+y1)+k]=origin.data[4*(i*w0+j)+k];
		}
	}
	var inverse=ct1.getImageData(0, 0, cv1.width, cv1.height);
	for(var i=0; i<inv.length; ++i)inverse.data[i]=inv[i];
	ct1.putImageData(inverse, 0, 0);
	document.querySelector('#text1').innerHTML='反演皮計算完成（在網頁的最下面）！';
	alert('反演皮計算完成（在網頁的最下面）！');
}

function update(evt){
	const file=evt.target.files[0];
	if(!file)return;
	const img=new Image();
	img.onload=function(){
		var canvas=document.querySelector('#original'), ctx=canvas.getContext('2d');
		canvas.height=img.height, canvas.width=img.width;
		ctx.drawImage(img, 0, 0);
		upd();
	};
	const reader=new FileReader();
	reader.onload=function(evt){img.src=evt.target.result;};
	reader.readAsDataURL(file);
}

function upd(){
	var cv0=document.querySelector('#original'), ct0=cv0.getContext('2d');
	var cv1=document.querySelector('#circle'), ct1=cv1.getContext('2d');
	cv1.width=cv0.width, cv1.height=cv0.height;
	var origin=ct0.getImageData(0, 0, cv0.width, cv0.height);
	ct1.putImageData(origin, 0, 0);
	ct1.beginPath();
	cx=Number(CX.value), cy=Number(CY.value), r=Number(R.value);
	ct1.arc(cx, cy, r, 0, 2*Math.PI);
	ct1.stroke();
}

function inverse(){
	document.querySelector('#text1').innerHTML='正在計算反演皮...';
	setTimeout(function(){
		inversion(cx, cy, r);
	}, 0);
}

document.onkeydown=function(e){
	e=window.event||e;
	var k=e.keyCode;
	if(k==13||k==108)upd();
}
