/*
 * A javascript tool library based on jQuery
 * https://github.com/situ2011/koala4j
 * gao_st@126.com
 * since: 2012-10-18
 */

/* koala tab plugin */
!function ( window, $, undefined ) {
	$('div.kl-tab').each(function () {
		var $tab = $( this ),
			type = $tab.attr('data-hover') ? 'mouseenter' : 'click',
			timer;

		$tab.find('.nav li:first-child').addClass('on').end().find('.wrap div:first-child').show();

		$tab
			.find('.nav li')
			.on(type, function () {
				var that = this;
				if ( type == 'mouseenter' ) {
					timer = setTimeout(function () {
						doTab(that);
					}, 350);
				} else {
					doTab( this );
				}
			})
			.on('mouseleave', function () {
				clearTimeout(timer);
			});

		function doTab ( it ) {
			$(it).addClass('on').siblings('.on').removeClass('on');
			$tab.find('.wrap div:eq('+$(it).index()+')').show().siblings(':visible').hide();
		}
	});
}( window, jQuery );

/* koala image slider plugin */
!function ( window, $, undefined ) {
	$('div.kl-slider').each(function () {
		var $slider = $( this ),
			width = $slider.find('img').width(),
			height = $slider.find('img').height(),
			navLiArr = [],
			oldIndex = 0,// *1
			timer,
			counter = 0,
			len;

		$slider.width( width ).height( height ).css('overflow', 'hidden');
		$slider.find('img').wrap('<a href="#"></a>');

		$slider.find('a').each(function () {
			$this = $( this );
			$this.attr( 'num', $this.index() ); // *2
			navLiArr.push('<li>'+ ( $this.index() + 1 )+'</li>')
		});

		len = $slider.find('a').length;

		$slider.append('<ul class="nav">'+navLiArr.join('')+'</ul>');
		$slider.append('<div class="prev">prev</div><div class="next">next</div>');

		$slider.find('.nav li:first-child').addClass('on');
		$slider.find('a:first-child').css('z-index', 9);

		function run () {
			var $this = $( this ),
				index = $this.index(), // *3
				$target = $slider.find('a[num='+index+']'),
				$oldTarget = $slider.find('a[num='+oldIndex+']');

			if ( oldIndex == index || $slider.find('a:animated').length > 0 ) return;

			$this.addClass('on').siblings('.on').removeClass('on');

			$target
				.css({'left': width, 'z-index': 9})
				.add($oldTarget)
				// .stop()
				.animate({
					'left': '-=' + width
				}, 500, function () {
					$oldTarget.css({'left': 0, 'z-index': 0});
					oldIndex = index;
			});

			counter = index;
		}

		$slider.find('.nav li').on( 'click', run );
		$slider.find('.prev, .next').on( 'click', function () {
			var $this = $(this);
			if ( $this.hasClass('prev') ) {
				counter--;
			} else {
				counter++;
			}
			if ( counter >= len ) counter = 0;
			$slider.find('.nav li:eq('+ counter +')').trigger('click');		
		});

		function autoPlay () {
			counter = ( counter >= len - 1 ) ? 0 : ++counter;
			$slider.find('.nav li:eq('+ counter +')').trigger('click');
		}

		timer = setInterval( autoPlay, 2000 );

		$slider.hover(function () {
			clearInterval( timer );
		}, function () {
			timer = setInterval( autoPlay, 2000 );
		});
	});
}( window, jQuery );

/*
 * No.001 - placeholder fix
 */
!function (window, document, $, undefined) {
	var target, i=0, len, tmpPh;
	if ( 'placeholder' in document.createElement('input') ) return;
	target = $('[placeholder]');
	for ( len = target.length; i<len; i++ ) {
		tmpPh = target[i].getAttribute( 'placeholder' );
		target[i].value = tmpPh;
		target[i].style.color = '#aaaaaa';
		target[i].onfocus = function () {
			if ( this.value != this.getAttribute( 'placeholder' ) ) return;
			this.value = '';
			this.style.color = '#000000';
		}
		target[i].onblur = function () {
			if ( this.value != '') return;
			this.value = this.getAttribute( 'placeholder' );
			this.style.color = '#aaaaaa';
		}
	}
}(window, document, jQuery);



/* Seamless rolling */
!function ( window, $, undefined ) {
	
   			var defaults = { 
			dir: "left", //none:不动,up:上,right:右,down:下,right:左 
			delay: 30,//执行时间 
			}; 
			$.fn.gysContentDisplay = function (opt) { 
			opt = $.extend({}, defaults, opt); 
			
			//全局变量区域 
			var obj = $(this); //当前对象 
			obj.css({ "overflow": "hidden" }); //初始化元素 
			if (opt.dir == "none") return; 
			var objLis = obj.children(); //对象中的子元素 
			objLis.css({ "overflow": "hidden" }); 
			var objSize = 0; //外框尺寸 
			var scrollEvent = "scrollLeft"; //滚动条的滚动方向 
			var liTotalSize = 0, liTotalSizeOther = 0; //每个li元素的尺寸(宽或者高),克隆之后的总尺寸 
			var scrollSize = 0, //滚动条的实际距离 
			scrollSizeMax = 0, //滚动条的最大距离 
			scrollSizeMin = 0; //滚动条的最小距离 
			var interval = ""; //记录setInterval 
			
			if (opt.dir == "up" || opt.dir == "down") {//上下 
			objSize = obj.innerHeight(); 
			scrollEvent = "scrollTop"; 
			obj.css({ "padding-top": 0, "padding-bottom": 0 }).height(objSize); 
			} 
			else if (opt.dir == "left" || opt.dir == "right") {//左右 
			objSize = obj.innerWidth(); 
			scrollEvent = "scrollLeft"; 
			obj.css({ "padding-left": 0, "padding-right": 0 }).width(objSize); 
			} 
			else { 
			alert("你的dir参数有误"); 
			} 
			
			var getChildTotalSize = function (dir) {// 定义获取li总尺寸的方法 
			if (dir == "left" || dir == "right") { 
			objLis.css("float", "left"); 
			return function () { 
			objLis.each(function () { 
			liTotalSize += $(this).outerWidth(true); 
			}); 
			} 
			} 
			else if (dir == "up" || dir == "down") { 
			objLis.css("float", "none"); 
			return function () { 
			objLis.each(function () { 
			liTotalSize += $(this).outerHeight(true); 
			}); 
			} 
			} 
			} (opt.dir); 
			getChildTotalSize(); //获得所有的li的总尺寸,在方法中赋值 
			
			(function () { 
			var cloneCount = Math.ceil(objSize * 2 / liTotalSize); //赋值子元素多少遍 
			var cloneHtmlNow = "", cloneHtmlStart = obj.html(); //原始的子元素字符串 
			
			for (var i = 0; i < cloneCount; i++) { 
			cloneHtmlNow += cloneHtmlStart; 
			} 
			obj.append(cloneHtmlNow); 
			liTotalSizeOther = (cloneCount + 1) * liTotalSize; //获取添加了子元素之后的长度 
			})(); 
			
			
			if (opt.dir == "left" || opt.dir == "right") { 
			obj.css({ "position": "relative", "z-index": 0 }); 
			obj.children().css({ "position": "absolute", "z-index": 1 }); 
			var left = 0; 
			obj.children().each(function () { 
			$(this).css({ "left": left + "px", "top": 0 }); 
			left += $(this).outerWidth(true); 
			}); 
			} 
			
			
			//滚动条的滚动方法 
			function scrollChange(dir) { 
			if (dir == "left" || dir == "up") { 
			obj[scrollEvent](0); 
			scrollChange = function () { 
			scrollSize++; 
			if (scrollSize >= liTotalSize) scrollSize = 0; 
			obj[scrollEvent](scrollSize); 
			} 
			} 
			else if (dir == "right" || dir == "down") { 
			scrollSizeMax = liTotalSizeOther - objSize; 
			obj[scrollEvent](scrollSizeMax); 
			scrollSize = scrollSizeMax; 
			scrollSizeMin = scrollSizeMax - liTotalSize; 
			scrollChange = function () { 
			scrollSize--; 
			if (scrollSize <= scrollSizeMin) scrollSize = scrollSizeMax; 
			obj[scrollEvent](scrollSize); 
			} 
			} 
			}; 
			scrollChange(opt.dir); 
			interval = setInterval(scrollChange, opt.delay); 
			obj.children().on("mouseover", function () { 
			clearInterval(interval); 
			}).on("mouseleave", function () { 
			interval = setInterval(scrollChange, opt.delay); 
			}); 
			} 
	
	
	/*调用*/
	
		/*$(function () { 
		$("#guoul1").gysContentDisplay({ dir: "right" }); 
		$("#guoul2").gysContentDisplay({ dir: "left" }); 
		$("#guoul3").gysContentDisplay({ dir: "up" }); 
		$("#guoul4").gysContentDisplay({ dir: "down" }); 
		$("#guoul5").gysContentDisplay({ dir: "right" }); 
		$("#guoul6").gysContentDisplay({ dir: "none" }); 
		}) */
	
	
}( window, jQuery );



/* template */
!function ( window, $, undefined ) {
}( window, jQuery );





