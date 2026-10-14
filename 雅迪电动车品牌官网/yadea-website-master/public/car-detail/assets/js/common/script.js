$(function () {
	// 禁止拖动图片
	$('img').on('mousedown', function (e) {
		e.preventDefault()
	})

	// 页面滚动头部与页面区分
	var top = $(window).scrollTop();
	if (top > 0) {
		if ($('.header').hasClass('pro')) {
			$('.proheader').addClass('fixed');
			$('.header').hide();
		} else {
			$('.header').addClass('fixed');
		}
	} else {
		if ($('.header').hasClass('pro')) {
			$('.proheader').removeClass('fixed');
			$('.header').show();
		} else {
			$('.header').removeClass('fixed');
		}
	}

	if($(".header-info-box").hasClass("header-info-close")){
		$('.header .headr .sc .navcon').addClass('top')
	}else{
		$('.header .headr .sc .navcon').removeClass('top')
		if(top==0){
			$('.header .headr .sc .navcon').removeClass('top')
		}else{
			$('.header .headr .sc .navcon').addClass('top')
		}
	}

	$(window).scroll(function () {
		top = $(window).scrollTop();
		if (top > 0) {
			if ($('.header').hasClass('pro')) {
				$('.proheader').addClass('fixed');
				$('.header').hide();
			} else {
				$('.header').addClass('fixed');
			}
		} else {
			if ($('.header').hasClass('pro')) {
				$('.proheader').removeClass('fixed');
				$('.header').show();
			} else {
				$('.header').removeClass('fixed');
			}
		}

		if($(".header-info-box").hasClass("header-info-close")){
			$('.header .headr .sc .navcon').addClass('top')
		}else{
			$('.header .headr .sc .navcon').removeClass('top')
			if(top==0){
				$('.header .headr .sc .navcon').removeClass('top')
			}else{
				$('.header .headr .sc .navcon').addClass('top')
			}
		}

	})
	// 商城交互
	$('.header .headr .sc').on('click', function () {
		if ($(window).innerWidth() <= 1024) {
			if ($(this).hasClass('show')) {
				$(this).removeClass('show');
			} else {
				$(this).addClass('show');
				$('.header .headc').removeClass('show');
				$('.header .menu').removeClass('show');
			}
		}
	})
	// PC 语言按钮点击交互
	$('.header .headr .lan').on('click', function () {
		$(this).toggleClass('show')
	})
	$('.footer .bot .lan').on('click', function () {
		$(this).toggleClass('show')
		$(this).find('.navcon').fadeToggle(300)
	})
	$('body').on('click', function () {

	})

	var hoverTimer;
	// PC 导航栏交互
	$('.header .headc li').hover(function () {
		if ($(window).innerWidth() > 1024) {
			var that = this;
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(function () {
				$(that).addClass('active');
				$(that).find('.navcon').slideDown(200);
			}, 200)
		}
	}, function () {
		if ($(window).innerWidth() > 1024) {
			clearTimeout(hoverTimer);
			$('.header .headc li').removeClass('active');
			$('.header .headc li .navcon').slideUp(100)
		}
	})

	// wap 导航
	$('.header .headc li>a').on('click', function () {
		if ($(window).innerWidth() <= 1024) {
			if ($(this).next().length > 0) {
				if ($(this).hasClass('open')) {
					$('.header .headc li>a').removeClass('open');
					$('.header .headc li .navcon').slideUp(300);
				} else {
					$('.header .headc li>a').removeClass('open');
					$('.header .headc li .navcon').slideUp(300);
					$(this).addClass('open')
					$(this).next().slideDown(300);
				}

			}
		}
	})

	$('.header .headc li .navcon.cx .tabbox a').on('click', function () {
		var i = Number($(this).index()) + 1;
		if (!$(this).hasClass('active')) {
			var index = '.header .headc li .navcon.cx .content.cx' + i;
			$('.header .headc li .navcon.cx .tabbox a').removeClass('active')
			$('.header .headc li .navcon.cx .content').removeClass('show')
			$(this).addClass('active');
			$(index).addClass('show')
		}
	})
	// wap 导航栏交互
	$('.header .menu').on('click', function () {
		top = $(window).scrollTop()
		if ($(this).hasClass('show')) {
			// $('body').removeClass('fixed');
			// $(window).scrollTop($('body').attr('top'));
			$('body').removeClass('hide-body')
			$(this).removeClass('show');
			$('.header .headc').removeClass('show');
			$('.header .headc').removeClass('left');
			$('.header .headc li .navcon').fadeOut(0);
			$('.header .headc li').removeClass('left');
		} else {
			// var st = $(window).scrollTop()
			// $('body').attr('top', st);
			// $('body').addClass('fixed');
			// $('body').css('top', -st + 'px');
			$('body').addClass('hide-body')
			$(this).addClass('show');
			$('.header .headc li>a').removeClass('open');
			$('.header .headc li .navcon').slideUp(0);
			$('.header .headc').addClass('show');
			$('.header .headr .sc').removeClass('show')
			// $('.header .headc li:first-child a').addClass('open');
			// $('.header .headc li:first-child .navcon').slideDown(300);
		}
		if($(".header-info-box").hasClass("header-info-close")){
			$('.header .headc').addClass('no-top')
		}else{
			$('.header .headc').removeClass('no-top')
			if(top==0){
				$('.header .headc').removeClass('no-top')
			}else{
				$('.header .headc').addClass('no-top')
			}
		}
	})
	$('.header .headc li.morenav>a').on('click', function () {
		if ($(this).parents('li').hasClass('show')) {
			$(this).parents('li').removeClass('show');
			$(this).parents('li').find('.navcon').slideUp();
		} else {
			$(this).parents('li').addClass('show');
			$('.header .headc li.morenav .navcon').slideUp();
			$(this).parents('li').find('.navcon').slideDown();
		}

	})
	$('.header .headc .lanli>a,.header .headc .bot a.lan').on('click', function () {
		if ($('.header .headc .lanli').hasClass('show')) {
			$('.header .headc .lanli .hide').slideUp(300, function () {
				$('.header .headc .lanli').removeClass('show');
			});
		} else {
			$('.header .headc .lanli').addClass('show');
			$('.header .headc .lanli .hide').slideDown(300);
		}
	})
	$('.header .headc li .navcon .wap_title a').on('click', function () {
		$('.header .headc').removeClass('left');
		$(this).parents('li').removeClass('left');
	})
	$('.footer .con .nav dl dt').on('click', function () {
		// if ($(window).innerWidth() <= 970) {
		// 	if ($(this).parents('dl').hasClass('show')) {
		// 		$(this).parents('dl').find('div').slideUp(300, function () {
		// 			$(this).parents('dl').removeClass('show');
		// 		});
		// 	} else {
		// 		$(this).parents('dl').addClass('show');
		// 		$(this).parents('dl').find('div').slideDown(300);
		// 	}
		//
		// }
	})
	$('.proheader .headl').on('click', function () {
		if ($(window).innerWidth() <= 1024) {
			if ($(this).parents('.proheader').hasClass('show')) {
				$(this).parents('.proheader').find('.pronav').slideUp(300, function () {
					$(this).parents('.proheader').removeClass('show');
				});
			} else {
				$(this).parents('.proheader').addClass('show');
				$(this).parents('.proheader').find('.pronav').slideDown(300);
				$('.buypop').fadeOut();
			}

		}
	})

})
// 输入框过滤
function changenum(obj) {
	obj.value = obj.value.replace(/[^\d]/g, "");
	//清除“数字”和“.”以外的字符
}
//进入全屏
function FullScreen(id) {
	var ele = document.getElementById(id);
	console.dir(id, '------id---------')
	console.dir(ele)
	if (ele.requestFullscreen) {
		ele.requestFullscreen();
	} else if (ele.mozRequestFullScreen) {
		ele.mozRequestFullScreen();
	} else if (ele.webkitRequestFullScreen) {
		ele.webkitRequestFullScreen();
	}
}

//退出全屏
function exitFullscreen() {
	var de = document;
	if (de.exitFullscreen) {
		de.exitFullscreen();
	} else if (de.mozCancelFullScreen) {
		de.mozCancelFullScreen();
	} else if (de.webkitCancelFullScreen) {
		de.webkitCancelFullScreen();
	}
}
