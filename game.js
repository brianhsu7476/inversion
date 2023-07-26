document.querySelector('#imageInput').addEventListener('change', update);
var CX=document.querySelector('#cx'), CY=document.querySelector('#cy'), R=document.querySelector('#radius');
CX.value=300, CY.value=300, R.value=200;
var cx=Number(CX.value), cy=Number(CY.value), r=Number(R.value);
var w1=1000, h1=1000;

function f(x, y){
	var d=(x-cx)*(x-cx)+(y-cy)*(y-cy);
	if(d==0)return [];
	d=r*r/d;
	return [Math.round(cx+(x-cx)*d), Math.round(cy+(y-cy)*d)];
}

function inversion(){
	var cv0=document.querySelector('#original'), ct0=cv0.getContext('2d');
	var cv1=document.querySelector('#inversion'), ct1=cv1.getContext('2d');
	var w0=cv0.width, h0=cv0.height;
	cv1.width=w1, cv1.height=h1;
	var origin=ct0.getImageData(0, 0, cv0.width, cv0.height), inv=[];
	for(var i=0; i<w1*h1*4; ++i)inv.push(0);
	for(var i=0; i<h1; ++i)for(var j=0; j<w1; ++j){
		var ret=f(cx-h1/2+i, cy-w1/2+j);
		if(ret.length==0)continue;
		x0=ret[0], y0=ret[1];
		if(0<=x0&&x0<h0&&0<=y0&&y0<w0)for(var k=0; k<4; ++k)inv[4*(i*w1+j)+k]=origin.data[4*(x0*w0+y0)+k];
	}
	var inverse=ct1.getImageData(0, 0, cv1.width, cv1.height);
	for(var i=0; i<inv.length; ++i)inverse.data[i]=inv[i];
	ct1.putImageData(inverse, 0, 0);
	document.querySelector('#text1').innerHTML='反演皮計算完成（在網頁的最下面）！';
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
	ct1.arc(cy, cx, r, 0, 2*Math.PI);
	ct1.stroke();

	var ret=f(cx-h1/2, cy-w1/2);
	ct1.moveTo(ret[0], ret[1]);
	ct1.beginPath();
	for(var i=-h1/2, j=-w1/2; i<h1/2; ++i){
		var ret=f(cx+i, cy+j);
		ct1.lineTo(ret[0], ret[1]);
	}
	for(var i=h1/2, j=-w1/2; j<w1/2; ++j){
		var ret=f(cx+i, cy+j);
		ct1.lineTo(ret[0], ret[1]);
	}
	for(var i=h1/2, j=w1/2; i>=-h1/2; --i){
		var ret=f(cx+i, cy+j);
		ct1.lineTo(ret[0], ret[1]);
	}
	for(var i=-h1/2, j=w1/2; j>=-w1/2; --j){
		var ret=f(cx+i, cy+j);
		ct1.lineTo(ret[0], ret[1]);
	}
	ct1.strokeStyle='red', ct1.stroke();
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
